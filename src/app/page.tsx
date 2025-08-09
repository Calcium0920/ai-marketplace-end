'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, LogOut, Star, Search } from 'lucide-react'
import { SAMPLE_PRODUCTS } from '@/lib/data'
import { Product } from '@/lib/types'

export default function HomePage() {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 一時的なログイン状態

  // 簡易ログイン機能（一時的）
  const handleSimpleLogin = () => {
    setIsLoggedIn(true)
    alert('ログインしました（デモ版）')
  }

  const handleSimpleLogout = () => {
    setIsLoggedIn(false)
    setCart([])
    alert('ログアウトしました')
  }

  // 商品検索・フィルタリング
  const handleSearch = (query: string, category: string) => {
    let filtered = SAMPLE_PRODUCTS

    if (query.trim()) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category)
    }

    setFilteredProducts(filtered)
  }

  // カート機能
  const addToCart = (product: Product) => {
    if (cart.find(item => item.id === product.id)) {
      alert('既にカートに追加されています')
      return
    }
    setCart([...cart, product])
    alert(`${product.title}をカートに追加しました！`)
  }

  // 決済処理
  const handleCheckout = () => {
    if (!session && !isLoggedIn) {
      alert('購入するにはログインが必要です')
      return
    }

    if (cart.length === 0) {
      alert('カートが空です')
      return
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0)
    alert(`🎉 購入完了！（デモ版）\n\n購入商品:\n${cart.map(item => `• ${item.title} - ¥${item.price.toLocaleString()}`).join('\n')}\n\n合計: ¥${total.toLocaleString()}`)
    setCart([])
  }

  // カテゴリリスト
  const categories = [...new Set(SAMPLE_PRODUCTS.map(p => p.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">🤖 AI Marketplace</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="hover:text-blue-200 transition-colors">ホーム</Link>
                <Link href="/categories" className="hover:text-blue-200 transition-colors">カテゴリ</Link>
                <Link href="/sell" className="hover:text-blue-200 transition-colors">出品する</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* カート */}
              <button
                onClick={handleCheckout}
                className="relative hover:text-blue-200 transition-colors"
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {/* ユーザー */}
              {session || isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">
                    {session?.user?.name || 'デモユーザー'}
                  </span>
                  <button 
                    onClick={session ? () => signOut() : handleSimpleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center space-x-1 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>ログアウト</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSimpleLogin}
                    className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
                  >
                    ログイン（デモ）
                  </button>
                  <Link
                    href="/auth/signin"
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors font-medium"
                  >
                    Google
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* カートサマリー */}
      {cart.length > 0 && (
        <div className="bg-green-50 border-b border-green-200 py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-green-800">
                  🛒 {cart.length}件の商品 - ¥{cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                </span>
                <div className="hidden md:flex space-x-2">
                  {cart.slice(0, 3).map((item) => (
                    <span key={item.id} className="bg-white text-green-800 px-2 py-1 rounded text-sm">
                      {item.icon} {item.title}
                    </span>
                  ))}
                  {cart.length > 3 && <span className="text-green-600">他{cart.length - 3}件</span>}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-medium"
              >
                購入手続きへ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ヒーロー */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🚀 AIツールを発見・購入しよう
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            厳選されたAIツールで、あなたの作業を効率化
          </p>
          
          {/* 検索バー */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="AIツールを検索..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value, selectedCategory)
                  }}
                />
              </div>
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  handleSearch(searchQuery, e.target.value)
                }}
              >
                <option value="">全カテゴリ</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{filteredProducts.length}</div>
            <div className="text-gray-600">利用可能ツール</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {(filteredProducts.reduce((sum, p) => sum + p.rating, 0) / filteredProducts.length).toFixed(1)}
            </div>
            <div className="text-gray-600">平均評価</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {filteredProducts.reduce((sum, p) => sum + p.reviewCount, 0)}
            </div>
            <div className="text-gray-600">総レビュー数</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              ¥{Math.round(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toLocaleString()}
            </div>
            <div className="text-gray-600">平均価格</div>
          </div>
        </div>

        {/* 商品グリッド */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              🛍️ {searchQuery ? `"${searchQuery}"の検索結果` : '人気のAIツール'}
              <span className="text-lg text-gray-500 ml-2">({filteredProducts.length}件)</span>
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">検索結果が見つかりません</h3>
              <p className="text-gray-600">検索条件を変更して再度お試しください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const isInCart = cart.find(item => item.id === product.id)
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* 商品画像エリア */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center">
                      <div className="text-5xl mb-2">{product.icon}</div>
                      <div className="text-sm text-gray-600">{product.category}</div>
                    </div>
                    
                    {/* 商品情報 */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {product.title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      
                      {/* 評価 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                        {product.creator && (
                          <span className="text-xs text-gray-500">{product.creator}</span>
                        )}
                      </div>
                      
                      {/* タグ */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* 価格とボタン */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-blue-600">
                            ¥{product.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!!isInCart}
                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                              isInCart 
                                ? 'bg-green-500 text-white cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                            }`}
                          >
                            {isInCart ? '✓ 追加済み' : 'カートに追加'}
                          </button>
                          <Link
                            href={`/product/${product.id}`}
                            className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
                          >
                            詳細
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h5 className="text-2xl font-bold mb-4">🤖 AI Marketplace</h5>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              革新的なAIツールを通じて、あなたの創造性と生産性を向上させる
              新しいプラットフォーム
            </p>
            <div className="text-sm text-gray-400 space-y-2">
              <p>© 2024 AI Marketplace. All rights reserved.</p>
              <p>🚀 現在はデモ版です - 実際の決済は行われません</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}