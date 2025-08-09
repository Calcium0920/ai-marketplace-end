import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベーステーブルの型定義
export interface DatabaseProduct {
  id: number
  title: string
  description: string
  price: number
  category: string
  tags: string[]
  icon: string
  creator: string
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface DatabaseReview {
  id: string
  product_id: number
  user_id: string
  user_name: string
  user_image?: string
  rating: number
  comment: string
  created_at: string
}

export interface DatabaseUser {
  id: string
  email: string
  name: string
  image?: string
  created_at: string
  updated_at: string
}

export interface DatabasePurchase {
  id: string
  user_id: string
  product_id: number
  stripe_session_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}