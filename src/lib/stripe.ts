import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// クライアントサイド用
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// サーバーサイド用
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

// 商品情報を取得
export function getProductPrice(productId: number): number {
  // 実際のプロダクトでは、データベースから取得
  const prices: { [key: number]: number } = {
    1: 2980,
    2: 1480,
    3: 3980,
    4: 1980,
    5: 2480,
    6: 3480
  }
  return prices[productId] || 1000
}