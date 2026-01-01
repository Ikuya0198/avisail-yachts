import { Yacht } from "@/types/yacht";
import yachtsData from "@/data/yachts.json";

const data = yachtsData as {
  generated_at: string;
  total_count: number;
  yachts: Yacht[];
};

export type Locale = "en" | "ja" | "ar";

export function getYachtDisplayName(yacht: Yacht, locale: Locale = "en"): string {
  if (locale === "ja" && yacht.name_ja) {
    return yacht.name_ja;
  }
  return yacht.name;
}

export function getYachtDescription(yacht: Yacht, locale: Locale = "en"): string {
  if (locale === "ja" && yacht.description_ja) {
    return yacht.description_ja;
  }
  return yacht.description;
}

export function getAllYachts(): Yacht[] {
  return data.yachts;
}

export function getFeaturedYachts(): Yacht[] {
  return data.yachts.filter((y) => y.featured && y.status === "available");
}

export function getYachtById(id: string): Yacht | undefined {
  return data.yachts.find((y) => y.id === id);
}

export function getRelatedYachts(yacht: Yacht, limit: number = 3): Yacht[] {
  const allYachts = data.yachts.filter((y) => y.id !== yacht.id && y.status === "available");

  const scored = allYachts.map((y) => {
    let score = 0;

    // Same yacht type
    if (y.yacht_type === yacht.yacht_type) {
      score += 10;
    }

    // Similar price range (within 50%)
    if (yacht.price && y.price) {
      const priceDiff = Math.abs(y.price - yacht.price) / yacht.price;
      if (priceDiff < 0.5) {
        score += 5 * (1 - priceDiff);
      }
    }

    // Similar length (within 20%)
    if (yacht.length_m && y.length_m) {
      const lengthDiff = Math.abs(y.length_m - yacht.length_m) / yacht.length_m;
      if (lengthDiff < 0.2) {
        score += 3 * (1 - lengthDiff);
      }
    }

    // Similar year
    if (yacht.year_built && y.year_built) {
      const yearDiff = Math.abs(y.year_built - yacht.year_built);
      if (yearDiff <= 5) {
        score += 2 * (1 - yearDiff / 5);
      }
    }

    return { yacht: y, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.yacht);
}

export function formatYachtPrice(yacht: Yacht): string {
  if (!yacht.price) return "Price on Request";
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: yacht.price_currency,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(yacht.price);
}

export const yachtTypeLabels: Record<string, { en: string; ja: string }> = {
  motor_yacht: { en: "Motor Yacht", ja: "モーターヨット" },
  sailing_yacht: { en: "Sailing Yacht", ja: "セーリングヨット" },
  catamaran: { en: "Catamaran", ja: "カタマラン" },
  superyacht: { en: "Superyacht", ja: "スーパーヨット" },
  sport_fishing: { en: "Sport Fishing", ja: "スポーツフィッシング" },
  cruiser: { en: "Cruiser", ja: "クルーザー" },
};

export const statusLabels: Record<string, { en: string; ja: string }> = {
  available: { en: "Available", ja: "販売中" },
  under_offer: { en: "Under Offer", ja: "商談中" },
  sold: { en: "Sold", ja: "売却済み" },
};
