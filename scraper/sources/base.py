import requests
from abc import ABC, abstractmethod
from bs4 import BeautifulSoup
from typing import Optional
import time
import random
import logging

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from models import ScrapedYachtRaw, YachtSource

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BaseYachtScraper(ABC):
    """Base class for yacht scrapers"""

    source: YachtSource
    base_url: str

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        })

    def fetch_page(self, url: str, delay: float = 1.0) -> Optional[BeautifulSoup]:
        """Fetch a page and return BeautifulSoup object"""
        try:
            # Random delay to be polite
            time.sleep(delay + random.uniform(0, 0.5))

            response = self.session.get(url, timeout=30)
            response.raise_for_status()

            # Auto-detect encoding
            if response.encoding is None or response.encoding == "ISO-8859-1":
                response.encoding = response.apparent_encoding

            return BeautifulSoup(response.text, "lxml")

        except requests.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            return None

    @abstractmethod
    def get_list_urls(self) -> list[str]:
        """Return list of URLs to scrape for yacht listings"""
        pass

    @abstractmethod
    def parse_list_page(self, soup: BeautifulSoup) -> list[str]:
        """Parse a list page and return yacht detail URLs"""
        pass

    @abstractmethod
    def parse_detail_page(self, soup: BeautifulSoup, url: str) -> Optional[ScrapedYachtRaw]:
        """Parse a yacht detail page and return raw yacht data"""
        pass

    def scrape_all(self, max_items: int = 50) -> list[ScrapedYachtRaw]:
        """Scrape all yachts from this source"""
        yachts = []

        list_urls = self.get_list_urls()
        logger.info(f"[{self.source}] Found {len(list_urls)} list pages to scrape")

        for list_url in list_urls:
            soup = self.fetch_page(list_url)
            if not soup:
                continue

            detail_urls = self.parse_list_page(soup)
            logger.info(f"[{self.source}] Found {len(detail_urls)} yachts on {list_url}")

            for detail_url in detail_urls:
                if len(yachts) >= max_items:
                    logger.info(f"[{self.source}] Reached max items limit ({max_items})")
                    return yachts

                detail_soup = self.fetch_page(detail_url)
                if not detail_soup:
                    continue

                yacht = self.parse_detail_page(detail_soup, detail_url)
                if yacht:
                    yachts.append(yacht)
                    logger.info(f"[{self.source}] Scraped: {yacht.raw_name}")

        logger.info(f"[{self.source}] Total yachts scraped: {len(yachts)}")
        return yachts

    def parse_list_page_with_data(self, soup: BeautifulSoup, url: str) -> list[ScrapedYachtRaw]:
        """Parse list page and extract yacht data directly (override in subclass)"""
        return []
