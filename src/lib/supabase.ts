import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  image_url: string;
  images?: string[];
  location: string;
  capacity: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  slug?: string | null;
  name_en?: string | null;
  description_en?: string | null;
  location_en?: string | null;
  features_en?: string[] | null;
  category_en?: string | null;
  name_kk?: string | null;
  description_kk?: string | null;
  location_kk?: string | null;
  features_kk?: string[] | null;
  category_kk?: string | null;
  name_ky?: string | null;
  description_ky?: string | null;
  location_ky?: string | null;
  features_ky?: string[] | null;
  category_ky?: string | null;
  name_az?: string | null;
  description_az?: string | null;
  location_az?: string | null;
  features_az?: string[] | null;
  category_az?: string | null;
  name_zh?: string | null;
  description_zh?: string | null;
  location_zh?: string | null;
  features_zh?: string[] | null;
  category_zh?: string | null;
  name_fr?: string | null;
  description_fr?: string | null;
  location_fr?: string | null;
  features_fr?: string[] | null;
  category_fr?: string | null;
  name_uz?: string | null;
  description_uz?: string | null;
  location_uz?: string | null;
  features_uz?: string[] | null;
  category_uz?: string | null;
  priority?: number | null;
}

export interface Booking {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  country_code?: string;
  dial_code?: string;
  tour_date?: string;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'failed';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  special_requests: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  product_id?: string;
  booking_id?: string;
  message: string;
  telegram_sent?: boolean;
  created_at?: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  address: string;
  license_info: string;
  insurance_info: string;
  payment_info: string;
  phone?: string | null;
  email?: string | null;
  opening_hours?: string | null;
  google_maps_url?: string | null;
  google_maps_place_id?: string | null;
  business_category?: string | null;
  address_en?: string | null;
  license_info_en?: string | null;
  insurance_info_en?: string | null;
  payment_info_en?: string | null;
  opening_hours_en?: string | null;
  address_az?: string | null;
  license_info_az?: string | null;
  insurance_info_az?: string | null;
  payment_info_az?: string | null;
  opening_hours_az?: string | null;
  address_kk?: string | null;
  license_info_kk?: string | null;
  insurance_info_kk?: string | null;
  payment_info_kk?: string | null;
  opening_hours_kk?: string | null;
  address_ky?: string | null;
  license_info_ky?: string | null;
  insurance_info_ky?: string | null;
  payment_info_ky?: string | null;
  opening_hours_ky?: string | null;
  address_zh?: string | null;
  license_info_zh?: string | null;
  insurance_info_zh?: string | null;
  payment_info_zh?: string | null;
  opening_hours_zh?: string | null;
  address_fr?: string | null;
  license_info_fr?: string | null;
  insurance_info_fr?: string | null;
  payment_info_fr?: string | null;
  opening_hours_fr?: string | null;
  address_uz?: string | null;
  license_info_uz?: string | null;
  insurance_info_uz?: string | null;
  payment_info_uz?: string | null;
  opening_hours_uz?: string | null;
  created_at: string;
  updated_at: string;
}
