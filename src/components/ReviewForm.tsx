'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Star, Send, X } from 'lucide-react'
import { Product } from '@/lib/types'

interface ReviewFormProps {
  product: Product
  onClose: () => void
  onSubmit: (review: ReviewData) => void
}

interface ReviewData {
  rating: number
  comment: string
  userName: string
  userImage?: string | null
  date: string
}

export default function ReviewForm({ product, onClose, onSubmit }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      alert('レビューを投稿するにはログインが必要です')
      return
    }

    if (rating === 0) {
      alert('評価を選択してください')
      return
    }

    if (comment.trim().length < 10) {
      alert('コメントは10文字以上で入力してください')
      return
    }

    setIsSubmitting(true)

    // 仮の投稿処理
    await new Promise(resolve => setTimeout(resolve, 1000))

    const reviewData: ReviewData = {
      rating,
      comment: comment.trim(),
      userName: session.user?.name || 'Anonymous',
      userImage: session.user?.image,
      date: new Date().toLocaleDateString('ja-JP')
    }

    onSubmit(reviewData)
    
    alert('レビューを投稿しました！')
    onClose()
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">レビューを投稿</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 商品情報 */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{product.icon}</div>
            <div>
              <h4 className="font-medium text-gray-800">{product.title}</h4>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* 評価選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              評価 *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-colors"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } hover:text-yellow-400`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating}点 - {
                      rating === 5 ? '最高' :
                      rating === 4 ? '良い' :
                      rating === 3 ? '普通' :
                      rating === 2 ? 'イマイチ' : '悪い'
                    }
                  </>
                )}
              </span>
            </div>
          </div>

          {/* コメント入力 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              コメント *
            </label>
            <textarea
              rows={4}
              placeholder="この商品の使用感や感想を詳しく教えてください..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                最低10文字以上入力してください
              </span>
              <span className="text-xs text-gray-500">
                {comment.length}/500文字
              </span>
            </div>
          </div>

          {/* ユーザー情報 */}
          {session && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm text-blue-800">
                  {session.user?.name} としてレビューを投稿
                </span>
              </div>
            </div>
          )}

          {/* 送信ボタン */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>投稿中...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>レビューを投稿</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 注意事項 */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500">
            ※ 投稿されたレビューは他のユーザーに公開されます。適切な内容でのご投稿をお願いします。
          </p>
        </div>
      </div>
    </div>
  )
}