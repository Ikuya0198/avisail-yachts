"""
Scraper for 青木ヨット (Aoki Yacht)
https://www.aokiyacht.com/usedboat/
Specializes in refurbished sailboats
"""

from bs4 import BeautifulSoup
from typing import Optional
import re
import logging

from .base import BaseYachtScraper
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from models import ScrapedYachtRaw, YachtSource

logger = logging.getLogger(__name__)

# Known yacht data from Aoki Yacht (manually curated for accuracy)
AOKI_YACHTS = [
    {"id": "5144", "name": "Lundeme 18", "status": "incoming"},
    {"id": "5012", "name": "Y26-CEX", "status": "incoming"},
    {"id": "5011", "name": "YAMAHA Y26-II", "status": "incoming"},
    {"id": "5102", "name": "YAMAHA Y25ML", "status": "incoming"},
    {"id": "5001", "name": "Y23-EX", "status": "incoming"},
    {"id": "5002", "name": "AH24 Albatross", "status": "negotiating"},
    {"id": "4899", "name": "ARICA 27", "price": "210万円", "status": "available"},
    {"id": "4829", "name": "Newport 28", "price": "285万円", "status": "available"},
]


class AokiYachtScraper(BaseYachtScraper):
    source = YachtSource.AOKIYACHT
    base_url = "https://www.aokiyacht.com"

    def get_list_urls(self) -> list[str]:
        return [f"{self.base_url}/usedboat/"]

    def parse_list_page(self, soup: BeautifulSoup) -> list[str]:
        """Parse the used boat listing page"""
        detail_urls = []

        # Find all boat listing links
        links = soup.select("a[href*='/usedboat/'][href$='/']")

        for link in links:
            href = link.get("href", "")
            # Skip the main usedboat page
            if href.endswith("/usedboat/"):
                continue
            if "/usedboat/" in href and href not in detail_urls:
                if not href.startswith("http"):
                    href = self.base_url + href
                detail_urls.append(href)

        return detail_urls

    def parse_detail_page(self, soup: BeautifulSoup, url: str) -> Optional[ScrapedYachtRaw]:
        """Parse individual boat detail page"""
        try:
            # Extract source ID from URL
            source_id = url.rstrip("/").split("/")[-1]

            # Try to find yacht name from our known list
            raw_name = None
            raw_price = None
            raw_status = "available"

            for yacht in AOKI_YACHTS:
                if yacht["id"] == source_id:
                    raw_name = yacht["name"]
                    raw_price = yacht.get("price")
                    raw_status = yacht.get("status", "available")
                    break

            # If not in our list, try to parse from page
            if not raw_name:
                # Look for model name in title or content
                title = soup.select_one("title")
                if title:
                    title_text = title.get_text()
                    # Extract before the pipe or dash
                    parts = re.split(r"[|–-]", title_text)
                    if parts:
                        candidate = parts[0].strip()
                        if "青木ヨット" not in candidate:
                            raw_name = candidate

            if not raw_name:
                raw_name = f"Yacht {source_id}"

            # Look for additional specs in content
            content = soup.select_one(".entry-content, article")
            raw_length = None
            raw_year = None
            raw_maker = None
            raw_rig = None

            if content:
                text = content.get_text()

                # Extract length
                length_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:m|ft|フィート)", text, re.IGNORECASE)
                if length_match:
                    raw_length = length_match.group(0)

                # Extract year
                year_match = re.search(r"(?:建造|年式|進水)[：:\s]*(\d{4})", text)
                if year_match:
                    raw_year = year_match.group(1)

                # Check status from page text
                if "SOLD" in text.upper() or "成約" in text or "売約済" in text:
                    raw_status = "sold"
                elif "商談中" in text:
                    raw_status = "negotiating"
                elif "入荷予定" in text:
                    raw_status = "incoming"

                # Try to find price if not already set
                if not raw_price:
                    price_match = re.search(r"(\d+(?:,\d+)*)\s*万円", text)
                    if price_match:
                        raw_price = price_match.group(0)

            # Get images
            images = []
            img_elements = soup.select("img[src*='wp-content'], img[src*='uploads']")
            for img in img_elements:
                src = img.get("src") or img.get("data-src")
                if src and "placeholder" not in src.lower() and "logo" not in src.lower():
                    if not src.startswith("http"):
                        src = self.base_url + src
                    if src not in images:
                        images.append(src)

            return ScrapedYachtRaw(
                source=self.source,
                source_url=url,
                source_id=f"aoki_{source_id}",
                raw_name=raw_name,
                raw_type="sailing",  # Aoki specializes in sailboats
                raw_maker=raw_maker,
                raw_price=raw_price,
                raw_length=raw_length,
                raw_year=raw_year,
                raw_status=raw_status,
                raw_rig=raw_rig,
                images=images[:10],
            )

        except Exception as e:
            logger.error(f"Error parsing {url}: {e}")
            return None
