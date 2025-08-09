import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { SAMPLE_PRODUCTS } from '@/lib/data'
import { PurchaseService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { items, successUrl, cancelUrl } = await request.json()

    // ログインチェック
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // 商品情報を検証
    const lineItems = items.map((item: { id: number; quantity: number }) => {
      const product = SAMPLE_PRODUCTS.find(p => p.id === item.id)
      if (!product) {
        throw new Error(`商品ID ${item.id} が見つかりません`)
      }

      return {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: product.title,
            description: product.description,
            metadata: {
              productId: product.id.toString(),
              category: product.category,
            }
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      }
    })

    // Checkout セッションを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        orderItems: JSON.stringify(items),
        timestamp: new Date().toISOString(),
      },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    })

    // 購入記録を事前作成（pending状態）
    for (const item of items) {
      await PurchaseService.createPurchase({
        user_id: session.user.id,
        product_id: item.id,
        stripe_session_id: checkoutSession.id,
        amount: SAMPLE_PRODUCTS.find(p => p.id === item.id)?.price || 0,
        status: 'pending'
      })
    }

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error: unknown) {
    console.error('Stripe checkout session creation failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'チェックアウトセッションの作成に失敗しました',
        details: errorMessage 
      },
      { status: 500 }
    )
  }
}