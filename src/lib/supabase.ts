import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface DbClass {
  id: string;
  name: string;
  theme: string;
  user_id: string;
  created_at: string;
}

export interface DbWidget {
  id: string;
  class_id: string;
  type: string;
  label?: string;
  position?: { x: number; y: number };
  size?: string;
  is_core: boolean;
  settings?: any;
  created_at: string;
}

export interface DbNote {
  id: string;
  widget_id: string;
  content: string;
  color?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface DbDocument {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  created_at: string;
  updated_at: string;
} 