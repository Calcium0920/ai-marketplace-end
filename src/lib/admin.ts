import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { supabase } from './supabase'

// 管理者権限を持つメールアドレス
const ADMIN_EMAILS = [
  'admin@ai-marketplace.com',
  'your-email@gmail.com', // あなたのメールアドレスを追加
]

export async function isAdmin(email?: string | null): Promise<boolean> {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email || !await isAdmin(session.user.email)) {
    throw new Error('管理者権限が必要です')
  }
  
  return session
}

// 管理者統計データ取得
export class AdminService {
  static async getDashboardStats() {
    try {
      // 総ユーザー数
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      // 総商品数
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      // 総売上
      const { data: salesData } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed')

      const totalRevenue = salesData?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0

      // 今月の売上
      const currentMonth = new Date()
      currentMonth.setDate(1)
      const { data: monthlyData } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', currentMonth.toISOString())

      const monthlyRevenue = monthlyData?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0

      // 最近の購入
      const { data: recentPurchases } = await supabase
        .from('purchases')
        .select(`
          *,
          users(name, email),
          products(title, icon)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10)

      return {
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalRevenue,
        monthlyRevenue,
        recentPurchases: recentPurchases || []
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        recentPurchases: []
      }
    }
  }

  static async getUsers(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit

      const { data: users, count } = await supabase
        .from('users')
        .select(`
          *,
          purchases(count)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      return {
        users: users || [],
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { users: [], total: 0, pages: 0 }
    }
  }

  static async getProducts(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit

      const { data: products, count } = await supabase
        .from('products')
        .select(`
          *,
          purchases(count)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      return {
        products: products || [],
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { products: [], total: 0, pages: 0 }
    }
  }

  static async toggleProductStatus(productId: number, isActive: boolean) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId)

      return !error
    } catch (error) {
      console.error('Error toggling product status:', error)
      return false
    }
  }

  static async deleteProduct(productId: number) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      return !error
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }
}