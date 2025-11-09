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
