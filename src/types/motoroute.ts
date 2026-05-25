export type CatalogSummary = {
  brand_count: number;
  model_count: number;
  generation_count: number;
  trim_count: number;
  master_part_count: number;
  catalog_part_count: number;
  quality_issue_count: number;
  generated_at: string;
};

export type BrandProfile = {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  origin_country_tr?: string | null;
  flag_emoji?: string | null;
  founded_year?: number | null;
  logo_url?: string | null;
  logo_asset_path?: string | null;
  description_short_tr?: string | null;
  model_count: number;
  generation_count: number;
  trim_count: number;
  car_model_count: number;
  motorcycle_model_count: number;
  commercial_model_count: number;
  turkey_market_model_count: number;
};

export type VehicleSearchResult = {
  result_type: "model" | "generation" | "trim" | string;
  brand_id: string;
  model_id: string | null;
  generation_id: string | null;
  trim_id: string | null;
  brand_name: string;
  model_name: string | null;
  generation_name: string | null;
  generation_code: string | null;
  trim_name: string | null;
  title: string;
  subtitle: string | null;
  rank_score: number;
};

export type GlobalSearchResult = {
  entity_type: string;
  entity_id: string;
  title: string;
  subtitle: string | null;
  url_path: string;
  rank_score: number;
  match_reason: string;
};

export type VehicleSpec = {
  group_slug: string;
  group_name_tr: string;
  label_key: string;
  label_tr: string;
  value_text: string;
  value_number?: number | null;
  unit?: string | null;
  sort_order: number;
  confidence?: number | null;
};

export type VehicleDetail = {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  logo_url?: string | null;
  logo_asset_path?: string | null;
  brand_country_tr?: string | null;
  brand_country_flag?: string | null;
  model_id: string;
  model_name: string;
  model_slug: string;
  kind?: string | null;
  body_type?: string | null;
  segment?: string | null;
  generation_id: string;
  generation_name?: string | null;
  generation_code?: string | null;
  generation_slug?: string | null;
  trim_id: string;
  trim_name: string;
  trim_slug: string;
  model_year_start?: number | null;
  model_year_end?: number | null;
  fuel?: string | null;
  engine_code?: string | null;
  engine_name?: string | null;
  engine_displacement_cc?: number | null;
  power_hp?: number | null;
  torque_nm?: number | null;
  transmission?: string | null;
  drive?: string | null;
  zero_to_100_kmh_sec?: number | null;
  top_speed_kmh?: number | null;
  fuel_consumption_l_100km?: number | null;
  specs_json?: VehicleSpec[] | null;
};

export type BusinessResult = {
  business_id: string;
  account_type: string;
  business_name: string;
  slug: string;
  short_description_tr: string | null;
  city: string | null;
  district: string | null;
  is_verified: boolean;
  rating_avg: number;
  review_count: number;
  service_names_tr: string[] | null;
  supported_brands: string[] | null;
  supported_models: string[] | null;
  supported_generation_codes: string[] | null;
  distance_km: number | null;
  rank_score: number;
};

export type PartResult = {
  part_id: string;
  name_tr: string;
  category_tr: string | null;
  manufacturer_name: string | null;
  primary_part_number: string | null;
  oe_part_number: string | null;
  cross_numbers: string | null;
  compatible_summary: string | null;
  rank_score: number;
};
