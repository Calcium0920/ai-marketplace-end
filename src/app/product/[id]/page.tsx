'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  ArrowLeft, 
  Star, 
  Share2, 
  Heart, 
  ShoppingCart, 
  User,
  Shield,
  Clock,
  Download,
  MessageCircle,
  Edit3 
} from 'lucide-react'
import { SAMPLE_PRODUCTS } from '@/lib/data'
import { Product } from '@/lib/types'
import { reviewStore, Review } from '@/lib/reviews'
import ReviewForm from '@/components/ReviewForm'

export default function ProductDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isInCart, setIsInCart] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews' | 'creator'>('description')
  const [isLiked, setIsLiked] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [productStats, setProductStats] = useState({ averageRating: 0, reviewCount: 0 })
  const [isLoggedIn, setIsLoggedIn] = useState(false) // デモログイン状態

  useEffect(() => {
    const productId = parseInt(params.id as string)
    const foundProduct = SAMPLE_PRODUCTS.find(p => p.id === productId)
    setProduct(foundProduct || null)

    if (foundProduct) {
      // レビューデータを取得
      const productReviews = reviewStore.getReviewsByProductId(foundProduct.id)
      setReviews(productReviews)
      
      // 統計を更新
      setProductStats({
        averageRating: reviewStore.getAverageRating(foundProduct.id),
        reviewCount: reviewStore.getReviewCount(foundProduct.id)
      })
    }

    // ローカルストレージからデモログイン状態を取得
    const demoLoginStatus = localStorage.getItem('demoLoggedIn')
    setIsLoggedIn(demoLoginStatus === 'true')
  }, [params.id])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">商品が見つかりません</h2>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  const addToCart = () => {
    setIsInCart(true)
    alert(`${product.title}をカートに追加しました！`)
  }

  const handlePurchase = () => {
    alert(`🎉 ${product.title}を購入しました！（デモ版）`)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('URLをコピーしました！')
  }

  const handleReviewSubmit = (reviewData: {
    rating: number
    comment: string
    userName: string
    userImage?: string | null
    date: string
  }) => {
    // レビューを追加
    reviewStore.addReview(product.id, reviewData)
    
    // 状態を更新
    setReviews(reviewStore.getReviewsByProductId(product.id))
    setProductStats({
      averageRating: reviewStore.getAverageRating(product.id),
      reviewCount: reviewStore.getReviewCount(product.id)
    })
    
    setShowReviewForm(false)
  }

  const openReviewForm = () => {
    const isAuthenticated = session || isLoggedIn
    if (!isAuthenticated) {
      alert('レビューを投稿するにはログインが必要です')
      router.push('/auth/signin')
      return
    }
    setShowReviewForm(true)
  }

  // 関連商品
  const relatedProducts = SAMPLE_PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー（簡略版） */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>戻る</span>
            </button>
            <Link href="/" className="text-xl font-bold text-blue-600">
              🤖 AI Marketplace
            </Link>
            <div className="flex items-center space-x-3">
              <button onClick={handleShare} className="p-2 text-gray-600 hover:text-blue-600">
                <Share2 size={20} />
              </button>
              <button 
                onClick={toggleLike}
                className={`p-2 ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：商品画像とメイン情報 */}
          <div className="lg:col-span-2">
            {/* 商品画像エリア */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-16 text-center">
                <div className="text-8xl mb-4">{product.icon}</div>
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>
            </div>

            {/* タブナビゲーション */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {[
                    { key: 'description', label: '詳細情報' },
                    { key: 'reviews', label: `レビュー (${productStats.reviewCount})` },
                    { key: 'creator', label: '作成者情報' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedTab(tab.key as 'description' | 'reviews' | 'creator')}
                      className={`px-6 py-4 font-medium transition-colors ${
                        selectedTab === tab.key
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {selectedTab === 'description' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">商品説明</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        この革新的なAIツールは、最新の機械学習技術を活用して、
                        あなたの作業効率を劇的に向上させます。直感的なインターフェースと
                        強力な機能により、初心者から上級者まで幅広くご利用いただけます。
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">主な機能</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          高度なAI処理エンジン
                        </li>
                        <li className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          リアルタイム処理対応
                        </li>
                        <li className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          多言語サポート
                        </li>
                        <li className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          API連携可能
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">タグ</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800">ユーザーレビュー</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(productStats.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{productStats.averageRating}</span>
                          <span className="text-gray-500">({productStats.reviewCount}件)</span>
                        </div>
                        <button
                          onClick={openReviewForm}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Edit3 size={16} />
                          <span>レビューを書く</span>
                        </button>
                      </div>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">⭐</div>
                        <h4 className="text-lg font-medium text-gray-800 mb-2">まだレビューがありません</h4>
                        <p className="text-gray-600 mb-4">最初のレビューを投稿してみませんか？</p>
                        <button
                          onClick={openReviewForm}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          レビューを書く
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                {review.userImage ? (
                                  <Image
                                    src={review.userImage}
                                    alt="User"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User size={16} className="text-blue-600" />
                                  </div>
                                )}
                                <span className="font-medium">{review.userName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedTab === 'creator' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {product.creator || 'AI Developer'}
                        </h3>
                        <p className="text-gray-600">プロフェッショナル開発者</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">⭐ 4.8 (127件)</span>
                          <span className="text-sm text-gray-500">📦 15個の商品</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      AI・機械学習分野で10年以上の経験を持つ開発者です。
                      ユーザーの生産性向上を目指した実用的なツールの開発に注力しています。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側：購入パネル */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(productStats.averageRating || product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {productStats.averageRating || product.rating} ({productStats.reviewCount || product.reviewCount}件のレビュー)
                  </span>
                </div>

                <div className="text-3xl font-bold text-blue-600 mb-6">
                  ¥{product.price.toLocaleString()}
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
                  >
                    今すぐ購入
                  </button>
                  <button
                    onClick={addToCart}
                    disabled={isInCart}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isInCart
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {isInCart ? (
                      <span className="flex items-center justify-center">
                        <ShoppingCart size={20} className="mr-2" />
                        カートに追加済み
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <ShoppingCart size={20} className="mr-2" />
                        カートに追加
                      </span>
                    )}
                  </button>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield size={16} className="mr-2 text-green-500" />
                    30日間返金保証
                  </div>
                  <div className="flex items-center">
                    <Download size={16} className="mr-2 text-blue-500" />
                    即座にダウンロード可能
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-orange-500" />
                    24時間サポート
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-2 text-purple-500" />
                    作成者への質問可能
                  </div>
                </div>
              </div>

              {/* 関連商品 */}
              {relatedProducts.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">関連商品</h3>
                  <div className="space-y-3">
                    {relatedProducts.map((relatedProduct) => (
                      <Link
                        key={relatedProduct.id}
                        href={`/product/${relatedProduct.id}`}
                        className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{relatedProduct.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">
                              {relatedProduct.title}
                            </div>
                            <div className="text-sm text-blue-600 font-bold">
                              ¥{relatedProduct.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* レビューフォーム */}
      {showReviewForm && (
        <ReviewForm
          product={product}
          onClose={() => setShowReviewForm(false)}
          onSubmit={handleReviewSubmit}
          isLoggedIn={isLoggedIn}
          demoUser={isLoggedIn ? { name: 'デモユーザー' } : undefined}
        />
      )}
    </div>
  )
}