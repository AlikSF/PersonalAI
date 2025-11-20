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
  priority?: number | null;
}

export interface Booking {
  id: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  payment_status: 'pending' | 'paid' | 'failed';
  booking_status: 'confirmed' | 'cancelled' | 'completed';
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
  address_en?: string | null;
  license_info_en?: string | null;
  insurance_info_en?: string | null;
  payment_info_en?: string | null;
  address_az?: string | null;
  license_info_az?: string | null;
  insurance_info_az?: string | null;
  payment_info_az?: string | null;
  address_kk?: string | null;
  license_info_kk?: string | null;
  insurance_info_kk?: string | null;
  payment_info_kk?: string | null;
  address_ky?: string | null;
  license_info_ky?: string | null;
  insurance_info_ky?: string | null;
  payment_info_ky?: string | null;
  created_at: string;
  updated_at: string;
}
