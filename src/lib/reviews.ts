interface Review {
  id: string
  productId: number
  rating: number
  comment: string
  userName: string
  userImage?: string
  date: string
}

// ローカルストレージ風の仮想データストア
class ReviewStore {
  private reviews: Review[] = [
    {
      id: '1',
      productId: 1,
      rating: 5,
      comment: '非常に使いやすく、業務効率が格段に向上しました！AIの応答速度も早く、精度も高いです。',
      userName: '田中太郎',
      date: '2024-08-05'
    },
    {
      id: '2',
      productId: 1,
      rating: 4,
      comment: '機能は豊富ですが、少し設定が複雑でした。でも慣れれば問題なし。',
      userName: '山田花子',
      date: '2024-08-03'
    },
    {
      id: '3',
      productId: 1,
      rating: 5,
      comment: 'コスパ最高！この価格でこの機能は驚きです。',
      userName: '佐藤次郎',
      date: '2024-08-01'
    },
    {
      id: '4',
      productId: 2,
      rating: 4,
      comment: '画像生成の品質が非常に高く、創作活動に重宝しています。',
      userName: '鈴木美咲',
      date: '2024-08-04'
    },
    {
      id: '5',
      productId: 3,
      rating: 5,
      comment: 'データ分析が驚くほど簡単になりました。グラフも自動生成されて便利です。',
      userName: '高橋健一',
      date: '2024-08-02'
    }
  ]

  // 商品のレビューを取得
  getReviewsByProductId(productId: number): Review[] {
    return this.reviews.filter(review => review.productId === productId)
  }

  // レビューを追加
  addReview(productId: number, reviewData: {
    rating: number
    comment: string
    userName: string
    userImage?: string | null
    date: string
  }): Review {
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      ...reviewData,
      userImage: reviewData.userImage || undefined
    }

    this.reviews.unshift(newReview) // 新しいレビューを先頭に追加
    return newReview
  }

  // 商品の平均評価を計算
  getAverageRating(productId: number): number {
    const productReviews = this.getReviewsByProductId(productId)
    if (productReviews.length === 0) return 0

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((totalRating / productReviews.length) * 10) / 10
  }

  // 商品のレビュー数を取得
  getReviewCount(productId: number): number {
    return this.getReviewsByProductId(productId).length
  }

  // 全レビューの統計
  getStats() {
    const totalReviews = this.reviews.length
    const averageRating = totalReviews > 0 
      ? this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10
    }
  }
}

// シングルトンインスタンス
export const reviewStore = new ReviewStore()
export type { Review }