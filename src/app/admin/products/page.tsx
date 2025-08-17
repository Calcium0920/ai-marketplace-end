'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  Download,
  ArrowLeft
} from 'lucide-react'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  icon: string
  creator: string
  is_active: boolean
  created_at: string
  rating: number
  review_count: number
}

export default function AdminProducts() {
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/auth/signin')
      return
    }

    loadProducts()
  }, [session, router])

  const loadProducts = async () => {
    try {
      // 実際のAPIが利用可能な場合は使用、そうでなければデモデータ
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        // デモデータ
        setProducts([
          {
            id: 1,
            title: '高性能ChatBotテンプレート',
            description: 'カスタマーサポートに最適な高性能ChatBotテンプレート',
            price: 2980,
            category: 'チャットボット',
            icon: '🤖',
            creator: 'AI Developer',
            is_active: true,
            created_at: '2024-08-01T00:00:00Z',
            rating: 4.8,
            review_count: 15
          },
          {
            id: 2,
            title: 'AI画像生成ツール',
            description: 'プロフェッショナル品質の画像を瞬時に生成',
            price: 1980,
            category: '画像生成',
            icon: '🎨',
            creator: 'Creative Studio',
            is_active: true,
            created_at: '2024-08-02T00:00:00Z',
            rating: 4.6,
            review_count: 23
          },
          {
            id: 3,
            title: '未承認テストツール',
            description: 'まだ承認されていないテスト商品',
            price: 5000,
            category: 'テスト',
            icon: '⚠️',
            creator: 'Test User',
            is_active: false,
            created_at: '2024-08-10T00:00:00Z',
            rating: 0,
            review_count: 0
          }
        ])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/products/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isActive: !currentStatus })
      })

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        ))
        alert(`商品を${!currentStatus ? '公開' : '非公開'}にしました`)
      } else {
        // デモ版の場合
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        ))
        alert(`商品を${!currentStatus ? '公開' : '非公開'}にしました（デモ版）`)
      }
    } catch (error) {
      console.error('Error toggling product status:', error)
      alert('ステータス変更に失敗しました')
    }
  }

  const deleteProduct = async (productId: number) => {
    if (!confirm('この商品を削除しますか？この操作は取り消せません。')) {
      return
    }

    try {
      const response = await fetch('/api/admin/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        alert('商品を削除しました')
      } else {
        // デモ版の場合
        setProducts(products.filter(p => p.id !== productId))
        alert('商品を削除しました（デモ版）')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('商品の削除に失敗しました')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesStatus = showInactive || product.is_active

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 flex items-center">
                <ArrowLeft size={20} className="mr-2" />
                ダッシュボード
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package size={24} className="mr-2" />
                商品管理
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                <Download size={16} className="mr-2" />
                CSV出力
              </button>
              <Link
                href="/sell"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                新規商品
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="商品名・作成者で検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">全カテゴリ</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">非公開商品も表示</span>
            </label>

            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{filteredProducts.length}件表示</span>
            </div>
          </div>
        </div>

        {/* 商品一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    評価
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{product.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.creator}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ¥{product.price.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-sm text-gray-900">
                          {product.rating} ({product.review_count})
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.is_active ? '公開中' : '非公開'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="商品詳細を見る"
                        >
                          <Eye size={16} />
                        </Link>
                        
                        <button
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          className={`${
                            product.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={product.is_active ? '非公開にする' : '公開する'}
                        >
                          {product.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        
                        <button
                          onClick={() => alert('編集機能は準備中です')}
                          className="text-gray-600 hover:text-gray-900"
                          title="編集"
                        >
                          <Edit size={16} />
                        </button>
                        
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="削除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">商品が見つかりません</h3>
              <p className="text-gray-500">検索条件を変更するか、新しい商品を追加してください。</p>
            </div>
          )}
        </div>

        {/* ページネーション */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {filteredProducts.length}件中 1-{filteredProducts.length}件を表示
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50">
              前へ
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white bg-blue-600">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50">
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}