'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowRight, Home } from 'lucide-react'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

interface PurchaseItem {
  id: number
  title: string
  price: number
  icon: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [purchasedItems, setPurchasedItems] = useState<PurchaseItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const sessionIdParam = searchParams.get('session_id')
      setSessionId(sessionIdParam)

      if (sessionIdParam) {
        const demoItems: PurchaseItem[] = [
          { id: 1, title: '高性能ChatBotテンプレート', price: 2980, icon: '🤖' },
          { id: 2, title: 'AI画像生成ツール', price: 1480, icon: '🎨' }
        ]
        
        setPurchasedItems(demoItems)
        setTotalAmount(demoItems.reduce((sum, item) => sum + item.price, 0))
      }
    } catch (error) {
      console.error('Error processing payment success:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  const handleDownload = (itemId: number) => {
    alert(`商品ID ${itemId} のダウンロードを開始します（デモ版）`)
  }

  const sendReceiptEmail = () => {
    alert('領収書をメールで送信しました！（デモ版）')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 購入完了！
          </h1>
          <p className="text-gray-600">
            ご購入ありがとうございます。すぐにAIツールをご利用いただけます。
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">購入商品</h2>
          
          <div className="space-y-4 mb-6">
            {purchasedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-blue-600 font-bold">¥{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(item.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>ダウンロード</span>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">合計金額</span>
              <span className="text-2xl font-bold text-blue-600">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {sessionId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">取引情報</h3>
            <p className="text-sm text-blue-700">
              セッションID: <code className="bg-blue-100 px-2 py-1 rounded">{sessionId}</code>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={sendReceiptEmail}
            className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Mail size={20} />
            <span>領収書をメール送信</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>ホームに戻る</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Home size={20} />
            <span>マーケットプレイスに戻る</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">決済情報を確認しています...</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}