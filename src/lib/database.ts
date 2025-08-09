import { supabase, DatabaseProduct, DatabaseReview, DatabaseUser, DatabasePurchase } from './supabase'

// 商品関連のサービス
export class ProductService {
  // 全商品を取得
  static async getAllProducts(): Promise<DatabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  }

  // 商品詳細を取得
  static async getProductById(id: number): Promise<DatabaseProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data
  }

  // カテゴリ別商品を取得
  static async getProductsByCategory(category: string): Promise<DatabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products by category:', error)
      return []
    }

    return data || []
  }

  // 商品を検索
  static async searchProducts(query: string): Promise<DatabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    return data || []
  }

  // 新商品を作成
  static async createProduct(productData: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseProduct | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return null
    }

    return data
  }
}

// レビュー関連のサービス
export class ReviewService {
  // 商品のレビューを取得
  static async getReviewsByProductId(productId: number): Promise<DatabaseReview[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }

    return data || []
  }

  // レビューを追加
  static async addReview(reviewData: Omit<DatabaseReview, 'id' | 'created_at'>): Promise<DatabaseReview | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()

    if (error) {
      console.error('Error adding review:', error)
      return null
    }

    // 商品の平均評価を更新
    await this.updateProductRating(reviewData.product_id)

    return data
  }

  // 商品の平均評価を更新
  static async updateProductRating(productId: number): Promise<void> {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (reviews && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      const reviewCount = reviews.length

      await supabase
        .from('products')
        .update({ 
          rating: Math.round(averageRating * 10) / 10,
          review_count: reviewCount 
        })
        .eq('id', productId)
    }
  }
}

// ユーザー関連のサービス
export class UserService {
  // ユーザーを作成または更新
  static async upsertUser(userData: Omit<DatabaseUser, 'created_at' | 'updated_at'>): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('users')
      .upsert([{ ...userData, updated_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) {
      console.error('Error upserting user:', error)
      return null
    }

    return data
  }

  // ユーザー情報を取得
  static async getUserById(id: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }
}

// 購入履歴関連のサービス
export class PurchaseService {
  // 購入記録を作成
  static async createPurchase(purchaseData: Omit<DatabasePurchase, 'id' | 'created_at'>): Promise<DatabasePurchase | null> {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select()
      .single()

    if (error) {
      console.error('Error creating purchase:', error)
      return null
    }

    return data
  }

  // ユーザーの購入履歴を取得
  static async getPurchasesByUserId(userId: string): Promise<DatabasePurchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (
          id,
          title,
          icon,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching purchases:', error)
      return []
    }

    return data || []
  }

  // 購入ステータスを更新
  static async updatePurchaseStatus(sessionId: string, status: 'completed' | 'failed'): Promise<void> {
    const { error } = await supabase
      .from('purchases')
      .update({ status })
      .eq('stripe_session_id', sessionId)

    if (error) {
      console.error('Error updating purchase status:', error)
    }
  }
}