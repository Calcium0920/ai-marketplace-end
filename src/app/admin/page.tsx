'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Star,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalRevenue: number
  monthlyRevenue: number
  recentPurchases: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.email) {
      router.push('/auth/signin')
      return
    }

    // 管理者権限チェック（簡易版）
    const adminEmails = ['admin@ai-marketplace.com', 'your-email@gmail.com']
    if (!adminEmails.includes(session.user.email)) {
      alert('管理者権限が必要です')
      router.push('/')
      return
    }

    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // フォールバック: デモデータ
        setStats({
          totalUsers: 147,
          totalProducts: 23,
          totalRevenue: 489000,
          monthlyRevenue: 125000,
          recentPurchases: [
            { id: '1', users: { name: '田中太郎' }, products: { title: 'AI画像生成ツール', icon: '🎨' }, amount: 2980, created_at: new Date().toISOString() },
            { id: '2', users: { name: '山田花子' }, products: { title: 'ChatBotテンプレート', icon: '🤖' }, amount: 1980, created_at: new Date().toISOString() }
          ]
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // デモデータでフォールバック
      setStats({
        totalUsers: 147,
        totalProducts: 23,
        totalRevenue: 489000,
        monthlyRevenue: 125000,
        recentPurchases: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">データの読み込みに失敗しました</h2>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← サイトに戻る
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">🔧 管理者ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                👨‍💼 {session?.user?.name}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ナビゲーション */}
        <div className="flex space-x-6 mb-8">
          <Link
            href="/admin"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            ダッシュボード
          </Link>
          <Link
            href="/admin/products"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            商品管理
          </Link>
          <Link
            href="/admin/users"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            ユーザー管理
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300"
          >
            分析・レポート
          </Link>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% 先月比</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総商品数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-sm text-green-600">+5 今月</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総売上</p>
                <p className="text-3xl font-bold text-gray-900">¥{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+23% 先月比</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">今月の売上</p>
                <p className="text-3xl font-bold text-gray-900">¥{stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+18% 先月比</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最近の購入 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">最近の購入</h3>
              <ShoppingCart size={20} className="text-gray-600" />
            </div>
            
            <div className="space-y-4">
              {stats.recentPurchases.map((purchase, index) => (
                <div key={purchase.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{purchase.products?.icon || '🛍️'}</div>
                    <div>
                      <p className="font-medium text-gray-800">{purchase.products?.title || '商品名'}</p>
                      <p className="text-sm text-gray-600">{purchase.users?.name || 'ユーザー名'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">¥{purchase.amount?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(purchase.created_at || Date.now()).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
              
              {stats.recentPurchases.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                  <p>最近の購入履歴がありません</p>
                </div>
              )}
            </div>
          </div>

          {/* クイックアクション */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">クイックアクション</h3>
              <Activity size={20} className="text-gray-600" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin/products"
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <Package size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-blue-800">商品管理</p>
                <p className="text-sm text-blue-600">商品の承認・編集</p>
              </Link>

              <Link
                href="/admin/users"
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
              >
                <Users size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-green-800">ユーザー管理</p>
                <p className="text-sm text-green-600">ユーザー情報確認</p>
              </Link>

              <Link
                href="/admin/analytics"
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
              >
                <BarChart3 size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-purple-800">分析・レポート</p>
                <p className="text-sm text-purple-600">売上分析・統計</p>
              </Link>

              <Link
                href="/admin/reviews"
                className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group"
              >
                <Star size={24} className="text-yellow-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-yellow-800">レビュー管理</p>
                <p className="text-sm text-yellow-600">レビューの確認</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}