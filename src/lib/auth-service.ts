import { supabase } from './supabase'
import { UserService } from './database'

export class AuthService {
  // ユーザーの購入権限チェック
  static async canUserPurchase(userId: string, productId: number): Promise<boolean> {
    const { data } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .single()

    return !data // まだ購入していない場合true
  }

  // ユーザーのレビュー権限チェック（購入済みユーザーのみ）
  static async canUserReview(userId: string, productId: number): Promise<boolean> {
    const { data } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('status', 'completed')
      .single()

    return !!data // 購入済みの場合true
  }

  // 既存レビューチェック（1商品1レビューまで）
  static async hasUserReviewed(userId: string, productId: number): Promise<boolean> {
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()

    return !!data
  }

  // ユーザープロフィール取得
  static async getUserProfile(userId: string) {
    return await UserService.getUserById(userId)
  }

  // ユーザーの購入履歴取得
  static async getUserPurchases(userId: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (
          id,
          title,
          icon,
          price,
          category
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user purchases:', error)
      return []
    }

    return data || []
  }

  // ユーザーのレビュー履歴取得
  static async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        products (
          id,
          title,
          icon
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user reviews:', error)
      return []
    }

    return data || []
  }
}