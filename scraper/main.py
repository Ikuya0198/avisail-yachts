#!/usr/bin/env python3
"""
Main scraper script for Avisail Yachts
Scrapes Japanese yacht sales websites and exports data for frontend
"""

import json
import argparse
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional
import re

from sources import AokiYachtScraper, BoatWorldScraper, ChukoteiScraper
from models import ScrapedYachtRaw, Yacht, YachtSource, YachtType, YachtStatus, Currency

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def parse_price(raw_price: Optional[str]) -> tuple[Optional[int], Currency]:
    """Parse price string to integer value and currency"""
    if not raw_price:
        return None, Currency.JPY

    # Remove commas and whitespace
    clean = raw_price.replace(",", "").replace(" ", "")

    # Check for 万円 (10,000 yen units)
    man_match = re.search(r"([\d.]+)万", clean)
    if man_match:
        value = float(man_match.group(1))
        return int(value * 10000), Currency.JPY

    # Check for regular yen
    yen_match = re.search(r"([\d]+)円", clean)
    if yen_match:
        return int(yen_match.group(1)), Currency.JPY

    # Just numbers
    num_match = re.search(r"([\d]+)", clean)
    if num_match:
        value = int(num_match.group(1))
        # If small number, probably in 万円
        if value < 10000:
            return value * 10000, Currency.JPY
        return value, Currency.JPY

    return None, Currency.JPY


def parse_length(raw_length: Optional[str]) -> tuple[Optional[float], Optional[float]]:
    """Parse length string to meters and feet"""
    if not raw_length:
        return None, None

    # Check for feet
    ft_match = re.search(r"([\d.]+)\s*(?:ft|フィート|')", raw_length, re.IGNORECASE)
    if ft_match:
        ft = float(ft_match.group(1))
        m = ft * 0.3048
        return round(m, 2), round(ft, 1)

    # Check for meters
    m_match = re.search(r"([\d.]+)\s*m", raw_length, re.IGNORECASE)
    if m_match:
        m = float(m_match.group(1))
        ft = m / 0.3048
        return round(m, 2), round(ft, 1)

    # Just numbers
    num_match = re.search(r"([\d.]+)", raw_length)
    if num_match:
        value = float(num_match.group(1))
        # Assume feet if > 10, meters if <= 10
        if value > 10:
            ft = value
            m = value * 0.3048
        else:
            m = value
            ft = value / 0.3048
        return round(m, 2), round(ft, 1)

    return None, None


def parse_year(raw_year: Optional[str]) -> Optional[int]:
    """Parse year string"""
    if not raw_year:
        return None

    match = re.search(r"(\d{4})", raw_year)
    if match:
        year = int(match.group(1))
        if 1950 <= year <= 2030:
            return year
    return None


def parse_horsepower(raw_hp: Optional[str]) -> Optional[int]:
    """Parse horsepower string"""
    if not raw_hp:
        return None

    match = re.search(r"(\d+)", raw_hp)
    if match:
        return int(match.group(1))
    return None


def parse_yacht_type(raw_type: Optional[str], raw_name: str) -> YachtType:
    """Determine yacht type from raw data"""
    combined = f"{raw_type or ''} {raw_name}".lower()

    if any(x in combined for x in ["sailing", "ヨット", "セーリング", "帆"]):
        return YachtType.SAILING
    if any(x in combined for x in ["catamaran", "カタマラン", "双胴"]):
        return YachtType.CATAMARAN
    if any(x in combined for x in ["sportfish", "フィッシング", "釣"]):
        return YachtType.SPORTFISH
    if any(x in combined for x in ["cruiser", "クルーザー"]):
        return YachtType.CRUISER
    if any(x in combined for x in ["motor", "モーター", "パワー"]):
        return YachtType.MOTOR

    return YachtType.OTHER


def parse_status(raw_status: Optional[str]) -> YachtStatus:
    """Parse yacht status"""
    if not raw_status:
        return YachtStatus.AVAILABLE

    status_lower = raw_status.lower()
    if "sold" in status_lower or "売約" in status_lower:
        return YachtStatus.SOLD
    if "negoti" in status_lower or "商談" in status_lower:
        return YachtStatus.NEGOTIATING
    if "incoming" in status_lower or "入荷" in status_lower:
        return YachtStatus.INCOMING

    return YachtStatus.AVAILABLE


def normalize_yacht(raw: ScrapedYachtRaw) -> Yacht:
    """Normalize raw scraped data to Yacht model"""
    price, currency = parse_price(raw.raw_price)
    length_m, length_ft = parse_length(raw.raw_length)
    year = parse_year(raw.raw_year)
    hp = parse_horsepower(raw.raw_horsepower)
    yacht_type = parse_yacht_type(raw.raw_type, raw.raw_name)
    status = parse_status(raw.raw_status)

    # Generate name from maker + model if name is empty
    name = raw.raw_name.strip() if raw.raw_name else ""
    if not name:
        parts = []
        if raw.raw_maker:
            parts.append(raw.raw_maker)
        if raw.raw_model:
            parts.append(raw.raw_model)
        name = " ".join(parts) if parts else f"Yacht {raw.source_id}"

    return Yacht(
        id=raw.source_id,
        source=raw.source,
        source_url=raw.source_url,
        name=name,
        yacht_type=yacht_type,
        maker=raw.raw_maker,
        model=raw.raw_model,
        price=price,
        price_currency=currency,
        price_negotiable=bool(raw.raw_price and ("相談" in raw.raw_price or "応相談" in raw.raw_price)),
        length_m=length_m,
        length_ft=length_ft,
        year_built=year,
        engine_maker=None,
        engine_model=raw.raw_engine,
        horsepower=hp,
        rig_type=raw.raw_rig,
        location=raw.raw_location or "",
        images=raw.images,
        thumbnail=raw.images[0] if raw.images else None,
        status=status,
    )


def export_for_frontend(yachts: list[Yacht], output_path: Path):
    """Export yachts to JSON for frontend consumption"""
    data = {
        "yachts": [y.model_dump() for y in yachts],
        "meta": {
            "count": len(yachts),
            "scraped_at": datetime.utcnow().isoformat(),
            "sources": list(set(y.source for y in yachts)),
        }
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)

    logger.info(f"Exported {len(yachts)} yachts to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Scrape Japanese yacht sales websites")
    parser.add_argument("--source", choices=["aoki", "boatworld", "chukotei", "all"], default="all")
    parser.add_argument("--max-items", type=int, default=20, help="Max items per source")
    parser.add_argument("--output", type=Path, default=Path("../src/data/yachts.json"))
    args = parser.parse_args()

    scrapers = {
        "aoki": AokiYachtScraper,
        "boatworld": BoatWorldScraper,
        "chukotei": ChukoteiScraper,
    }

    all_raw: list[ScrapedYachtRaw] = []

    if args.source == "all":
        sources = list(scrapers.keys())
    else:
        sources = [args.source]

    for source_name in sources:
        logger.info(f"Starting scrape of {source_name}...")
        scraper = scrapers[source_name]()

        try:
            raw_yachts = scraper.scrape_all(max_items=args.max_items)
            all_raw.extend(raw_yachts)
            logger.info(f"Scraped {len(raw_yachts)} yachts from {source_name}")
        except Exception as e:
            logger.error(f"Error scraping {source_name}: {e}")

    # Normalize all yachts
    yachts = []
    for raw in all_raw:
        try:
            yacht = normalize_yacht(raw)
            # Skip sold yachts
            if yacht.status != YachtStatus.SOLD:
                yachts.append(yacht)
        except Exception as e:
            logger.error(f"Error normalizing yacht {raw.source_id}: {e}")

    logger.info(f"Total available yachts: {len(yachts)}")

    # Export for frontend
    export_for_frontend(yachts, args.output)


if __name__ == "__main__":
    main()
