import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { SAMPLE_PRODUCTS } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { items, successUrl, cancelUrl } = await request.json()

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
            images: [], // 実際のプロダクトでは商品画像URLを設定
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderItems: JSON.stringify(items),
        timestamp: new Date().toISOString(),
      },
      customer_email: undefined, // ログインユーザーの場合はメールアドレスを設定
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['JP'], // 日本のみ配送対応
      },
      allow_promotion_codes: true, // プロモーションコード対応
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
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