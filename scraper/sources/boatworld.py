"""
Scraper for BoatWorld Japan
https://www.boatworld.jp/
Wide variety of motor boats and yachts
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


class BoatWorldScraper(BaseYachtScraper):
    source = YachtSource.BOATWORLD
    base_url = "https://www.boatworld.jp"

    def get_list_urls(self) -> list[str]:
        """Return yacht and boat listing pages"""
        return [
            f"{self.base_url}/boat/stockList/index.html",
            f"{self.base_url}/boat/stockList/index.html?page=2",
            f"{self.base_url}/boat/stockList/index.html?page=3",
        ]

    def parse_list_page(self, soup: BeautifulSoup) -> list[str]:
        """Parse the boat listing page"""
        detail_urls = []

        # Find boat listing items
        items = soup.select("li a[href*='detail.html']")

        for link in items:
            href = link.get("href")
            if href:
                if not href.startswith("http"):
                    href = self.base_url + href
                if href not in detail_urls:
                    detail_urls.append(href)

        return detail_urls

    def parse_list_page_with_data(self, soup: BeautifulSoup, url: str) -> list[ScrapedYachtRaw]:
        """Parse list page and extract basic yacht data directly"""
        yachts = []

        # Find all boat items
        items = soup.select("ul.boat-list li, .stock-list li")

        for item in items:
            try:
                link = item.select_one("a[href*='detail.html']")
                if not link:
                    continue

                detail_url = link.get("href", "")
                if not detail_url.startswith("http"):
                    detail_url = self.base_url + detail_url

                # Extract boat name
                name_elem = item.select_one("h3, .boat-name")
                raw_name = name_elem.get_text(strip=True) if name_elem else "Unknown"

                # Extract maker
                maker_elem = item.select_one("h4, .maker")
                raw_maker = maker_elem.get_text(strip=True) if maker_elem else None

                # Extract price
                price_elem = item.select_one("strong, .price")
                raw_price = price_elem.get_text(strip=True) if price_elem else None

                # Extract image
                img = item.select_one("img")
                images = []
                if img:
                    src = img.get("src") or img.get("data-src")
                    if src:
                        if not src.startswith("http"):
                            src = self.base_url + src
                        images.append(src)

                # Generate source ID
                source_id_match = re.search(r"shipNo=(\d+)", detail_url)
                source_id = source_id_match.group(1) if source_id_match else raw_name.replace(" ", "_")

                yacht = ScrapedYachtRaw(
                    source=self.source,
                    source_url=detail_url,
                    source_id=f"boatworld_{source_id}",
                    raw_name=raw_name,
                    raw_maker=raw_maker,
                    raw_price=raw_price,
                    images=images,
                )
                yachts.append(yacht)

            except Exception as e:
                logger.error(f"Error parsing list item: {e}")
                continue

        return yachts

    def parse_detail_page(self, soup: BeautifulSoup, url: str) -> Optional[ScrapedYachtRaw]:
        """Parse individual boat detail page"""
        try:
            # Extract title
            title = soup.select_one("h1, .boat-title, .detail-title")
            raw_name = title.get_text(strip=True) if title else "Unknown"

            # Look for specs table
            raw_price = None
            raw_length = None
            raw_year = None
            raw_maker = None
            raw_type = None
            raw_engine = None
            raw_horsepower = None
            raw_location = None

            # Find spec table rows
            spec_rows = soup.select("table tr, dl dt, .spec-item")

            for row in spec_rows:
                text = row.get_text()

                if "価格" in text or "販売価格" in text:
                    price_match = re.search(r"([\d,]+)\s*(?:万円|円)", text)
                    if price_match:
                        raw_price = price_match.group(0)

                if "全長" in text or "サイズ" in text:
                    length_match = re.search(r"([\d.]+)\s*(?:m|ft|フィート)", text)
                    if length_match:
                        raw_length = length_match.group(1)

                if "年式" in text or "進水" in text or "建造" in text:
                    year_match = re.search(r"(\d{4})", text)
                    if year_match:
                        raw_year = year_match.group(1)

                if "メーカー" in text:
                    maker_match = re.search(r"メーカー[：:\s]*(.+?)(?:\n|$)", text)
                    if maker_match:
                        raw_maker = maker_match.group(1).strip()

                if "エンジン" in text or "機関" in text:
                    engine_match = re.search(r"(?:エンジン|機関)[：:\s]*(.+?)(?:\n|$)", text)
                    if engine_match:
                        raw_engine = engine_match.group(1).strip()

                if "馬力" in text or "PS" in text or "HP" in text:
                    hp_match = re.search(r"(\d+)\s*(?:PS|HP|馬力)", text)
                    if hp_match:
                        raw_horsepower = hp_match.group(1)

                if "保管場所" in text or "所在地" in text:
                    loc_match = re.search(r"(?:保管場所|所在地)[：:\s]*(.+?)(?:\n|$)", text)
                    if loc_match:
                        raw_location = loc_match.group(1).strip()

            # Determine yacht type
            full_text = soup.get_text().lower()
            if "ヨット" in full_text or "セーリング" in full_text:
                raw_type = "sailing"
            elif "クルーザー" in full_text:
                raw_type = "cruiser"
            else:
                raw_type = "motor"

            # Get images
            images = []
            img_elements = soup.select(".photo img, .gallery img, .detail-photo img, .main-image img")
            if not img_elements:
                img_elements = soup.select("img[src*='boat'], img[src*='ship']")

            for img in img_elements:
                src = img.get("src") or img.get("data-src")
                if src and "placeholder" not in src.lower() and "icon" not in src.lower():
                    if not src.startswith("http"):
                        src = self.base_url + src
                    images.append(src)

            # Generate source ID
            source_id_match = re.search(r"shipNo=(\d+)", url)
            source_id = source_id_match.group(1) if source_id_match else url.split("/")[-1]

            return ScrapedYachtRaw(
                source=self.source,
                source_url=url,
                source_id=f"boatworld_{source_id}",
                raw_name=raw_name,
                raw_type=raw_type,
                raw_maker=raw_maker,
                raw_price=raw_price,
                raw_length=raw_length,
                raw_year=raw_year,
                raw_engine=raw_engine,
                raw_horsepower=raw_horsepower,
                raw_location=raw_location,
                images=images[:10],
            )

        except Exception as e:
            logger.error(f"Error parsing {url}: {e}")
            return None
