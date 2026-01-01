from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class YachtSource(str, Enum):
    AOKIYACHT = "aokiyacht"
    BOATWORLD = "boatworld"
    CHUKOTEI = "chukotei"


class YachtType(str, Enum):
    MOTOR = "motor"
    SAILING = "sailing"
    CATAMARAN = "catamaran"
    CRUISER = "cruiser"
    SPORTFISH = "sportfish"
    OTHER = "other"


class YachtStatus(str, Enum):
    AVAILABLE = "available"
    NEGOTIATING = "negotiating"
    SOLD = "sold"
    INCOMING = "incoming"


class Currency(str, Enum):
    JPY = "JPY"
    USD = "USD"
    EUR = "EUR"


class Yacht(BaseModel):
    id: str
    source: YachtSource
    source_url: str

    # Basic info
    name: str
    name_en: Optional[str] = None
    yacht_type: YachtType = YachtType.OTHER
    maker: Optional[str] = None
    model: Optional[str] = None

    # Pricing
    price: Optional[int] = None
    price_currency: Currency = Currency.JPY
    price_negotiable: bool = False

    # Specifications
    length_m: Optional[float] = None
    length_ft: Optional[float] = None
    beam_m: Optional[float] = None
    draft_m: Optional[float] = None
    displacement_kg: Optional[float] = None
    year_built: Optional[int] = None

    # Engine
    engine_maker: Optional[str] = None
    engine_model: Optional[str] = None
    horsepower: Optional[int] = None
    fuel_type: Optional[str] = None

    # Sailing specs (for sailboats)
    sail_area: Optional[float] = None
    rig_type: Optional[str] = None

    # Location
    location: str = ""
    location_en: Optional[str] = None
    marina: Optional[str] = None
    prefecture: Optional[str] = None

    # Media
    images: list[str] = Field(default_factory=list)
    thumbnail: Optional[str] = None

    # Status
    status: YachtStatus = YachtStatus.AVAILABLE

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_scraped_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        use_enum_values = True


class ScrapedYachtRaw(BaseModel):
    """Raw scraped data before normalization"""
    source: YachtSource
    source_url: str
    source_id: str

    # Raw fields as scraped
    raw_name: str
    raw_type: Optional[str] = None
    raw_maker: Optional[str] = None
    raw_model: Optional[str] = None
    raw_price: Optional[str] = None
    raw_length: Optional[str] = None
    raw_year: Optional[str] = None
    raw_engine: Optional[str] = None
    raw_horsepower: Optional[str] = None
    raw_location: Optional[str] = None
    raw_status: Optional[str] = None
    raw_rig: Optional[str] = None

    images: list[str] = Field(default_factory=list)

    scraped_at: datetime = Field(default_factory=datetime.utcnow)
