export type YachtType =
  | "motor_yacht"
  | "sailing_yacht"
  | "catamaran"
  | "superyacht"
  | "sport_fishing"
  | "cruiser";

export type YachtStatus = "available" | "under_offer" | "sold";

export interface YachtSpec {
  label: string;
  value: string;
}

export interface Yacht {
  id: string;

  // Basic info
  name: string;
  name_ja?: string;
  yacht_type: YachtType;
  yacht_type_detail: string;

  // Pricing
  price: number | null;
  price_currency: "USD" | "EUR" | "JPY";
  price_display: string;

  // Specifications
  length_m: number;
  length_ft: number;
  beam_m: number;
  draft_m: number;
  year_built: number;
  builder: string;
  model?: string;
  hull_material: string;

  // Capacity
  cabins: number;
  berths: number;
  heads: number;
  crew_quarters?: number;

  // Engine
  engine_type: string;
  engine_make: string;
  engine_model?: string;
  engine_hours?: number;
  fuel_capacity_l: number;
  water_capacity_l: number;
  max_speed_knots?: number;
  cruise_speed_knots?: number;
  range_nm?: number;

  // Location
  location: string;
  location_country: string;

  // Media
  images: string[];
  thumbnail: string;
  video_url?: string;

  // Features
  highlights: string[];
  equipment: string[];

  // Description
  description: string;
  description_ja?: string;

  // Status
  status: YachtStatus;
  featured: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}
