"""
Scraper for 中古艇ドットコム (Chukotei.com)
https://www.chukotei.com/
Largest Japanese used boat marketplace
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


class ChukoteiScraper(BaseYachtScraper):
    source = YachtSource.CHUKOTEI
    base_url = "https://www.chukotei.com"

    def get_list_urls(self) -> list[str]:
        """Return yacht category listing pages"""
        return [
            # Yachts/Sailboats (type 2)
            f"{self.base_url}/ship/ship_list.php?m=si&ship_type_data[2]=1",
            # Motor boats (type 1) - luxury cruisers
            f"{self.base_url}/ship/ship_list.php?m=si&ship_type_data[1]=1&ship_feet_from=30",
        ]

    def parse_list_page(self, soup: BeautifulSoup) -> list[str]:
        """Parse the boat listing page"""
        detail_urls = []

        # Find boat listing links
        links = soup.select("a[href*='/ship/detail/']")

        for link in links:
            href = link.get("href")
            if href:
                if not href.startswith("http"):
                    href = self.base_url + href
                if href not in detail_urls and "detail" in href:
                    detail_urls.append(href)

        return detail_urls

    def parse_list_page_with_data(self, soup: BeautifulSoup, url: str) -> list[ScrapedYachtRaw]:
        """Parse list page and extract basic yacht data directly"""
        yachts = []

        # Find yacht listing items
        items = soup.select(".ship_list_new, .ship-item, .boat-item")

        for item in items:
            try:
                link = item.select_one("a[href*='detail']")
                if not link:
                    continue

                detail_url = link.get("href", "")
                if not detail_url.startswith("http"):
                    detail_url = self.base_url + detail_url

                # Extract name
                name_elem = item.select_one("h3, .ship-name, .title")
                raw_name = name_elem.get_text(strip=True) if name_elem else "Unknown"

                # Extract price
                price_elem = item.select_one("strong, .price")
                raw_price = None
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    if "万" in price_text or "円" in price_text:
                        raw_price = price_text

                # Extract specs from item text
                item_text = item.get_text()

                # Length
                raw_length = None
                length_match = re.search(r"(\d+)\s*(?:ft|フィート)", item_text)
                if length_match:
                    raw_length = length_match.group(1)

                # Year
                raw_year = None
                year_match = re.search(r"(\d{4})年?", item_text)
                if year_match:
                    raw_year = year_match.group(1)

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
                source_id_match = re.search(r"detail/(\d+)", detail_url)
                source_id = source_id_match.group(1) if source_id_match else raw_name.replace(" ", "_")

                yacht = ScrapedYachtRaw(
                    source=self.source,
                    source_url=detail_url,
                    source_id=f"chukotei_{source_id}",
                    raw_name=raw_name,
                    raw_price=raw_price,
                    raw_length=raw_length,
                    raw_year=raw_year,
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
            title = soup.select_one("h1, .ship-title, .detail-title")
            raw_name = title.get_text(strip=True) if title else "Unknown"

            # Initialize specs
            raw_price = None
            raw_length = None
            raw_year = None
            raw_maker = None
            raw_model = None
            raw_type = None
            raw_engine = None
            raw_horsepower = None
            raw_location = None
            raw_status = "available"

            # Find spec table
            spec_tables = soup.select("table, .spec-table, dl.specs")

            for table in spec_tables:
                rows = table.select("tr, .spec-row")
                for row in rows:
                    cells = row.select("td, th, dt, dd")
                    if len(cells) >= 2:
                        label = cells[0].get_text(strip=True)
                        value = cells[1].get_text(strip=True)

                        if "価格" in label or "販売価格" in label:
                            raw_price = value
                        elif "全長" in label:
                            raw_length = value
                        elif "年式" in label or "進水" in label or "建造" in label:
                            year_match = re.search(r"(\d{4})", value)
                            raw_year = year_match.group(1) if year_match else value
                        elif "メーカー" in label or "造船所" in label:
                            raw_maker = value
                        elif "モデル" in label or "型式" in label:
                            raw_model = value
                        elif "エンジン" in label or "機関" in label:
                            raw_engine = value
                        elif "馬力" in label or "出力" in label:
                            raw_horsepower = value
                        elif "保管場所" in label or "所在地" in label or "係留地" in label:
                            raw_location = value
                        elif "種類" in label or "艇種" in label:
                            raw_type = value

            # Fallback: scan page text
            page_text = soup.get_text()

            if not raw_price:
                price_match = re.search(r"([\d,]+)\s*万円", page_text)
                if price_match:
                    raw_price = price_match.group(0)

            if not raw_length:
                length_match = re.search(r"(\d+)\s*(?:ft|フィート)", page_text)
                if length_match:
                    raw_length = length_match.group(0)

            if not raw_year:
                year_match = re.search(r"(?:年式|建造).*?(\d{4})", page_text)
                if year_match:
                    raw_year = year_match.group(1)

            # Determine yacht type from category or text
            if "ヨット" in page_text or "セーリング" in page_text or "帆走" in page_text:
                raw_type = "sailing"
            elif "クルーザー" in page_text:
                raw_type = "cruiser"
            elif "モーター" in page_text or "パワー" in page_text:
                raw_type = "motor"
            elif raw_type is None:
                # Check URL category
                if "category=4" in url:
                    raw_type = "sailing"
                elif "category=3" in url:
                    raw_type = "cruiser"
                else:
                    raw_type = "other"

            # Check status
            if "SOLD" in page_text.upper() or "売約済" in page_text:
                raw_status = "sold"
            elif "商談中" in page_text:
                raw_status = "negotiating"

            # Get images
            images = []
            img_elements = soup.select(".photo img, .gallery img, .ship-photo img, .main-image img")
            if not img_elements:
                img_elements = soup.select("img[src*='ship'], img[src*='photo']")

            for img in img_elements:
                src = img.get("src") or img.get("data-src")
                if src and "placeholder" not in src.lower() and "icon" not in src.lower():
                    if not src.startswith("http"):
                        src = self.base_url + src
                    images.append(src)

            # Generate source ID
            source_id_match = re.search(r"detail/(\d+)", url)
            source_id = source_id_match.group(1) if source_id_match else url.split("/")[-1].replace(".php", "")

            return ScrapedYachtRaw(
                source=self.source,
                source_url=url,
                source_id=f"chukotei_{source_id}",
                raw_name=raw_name,
                raw_type=raw_type,
                raw_maker=raw_maker,
                raw_model=raw_model,
                raw_price=raw_price,
                raw_length=raw_length,
                raw_year=raw_year,
                raw_engine=raw_engine,
                raw_horsepower=raw_horsepower,
                raw_location=raw_location,
                raw_status=raw_status,
                images=images[:10],
            )

        except Exception as e:
            logger.error(f"Error parsing {url}: {e}")
            return None
