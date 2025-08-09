'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Mail, ArrowRight, Home } from 'lucide-react'

interface PurchaseItem {
  id: number
  title: string
  price: number
  icon: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [purchasedItems, setPurchasedItems] = useState<PurchaseItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id')
    setSessionId(sessionIdParam)

    // 実際のプロダクトでは、session_idを使ってStripeから詳細情報を取得
    // ここではデモ用のダミーデータを設定
    if (sessionIdParam) {
      // デモ用の購入商品データ
      const demoItems: PurchaseItem[] = [
        { id: 1, title: '高性能ChatBotテンプレート', price: 2980, icon: '🤖' },
        { id: 2, title: 'AI画像生成ツール', price: 1480, icon: '🎨' }
      ]
      
      setPurchasedItems(demoItems)
      setTotalAmount(demoItems.reduce((sum, item) => sum + item.price, 0))
    }
    
    setIsLoading(false)
  }, [searchParams])

  const handleDownload = (itemId: number) => {
    // 実際のプロダクトでは、認証されたダウンロードリンクを提供
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
        {/* 成功メッセージ */}
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

        {/* 購入詳細カード */}
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

          {/* 合計金額 */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">合計金額</span>
              <span className="text-2xl font-bold text-blue-600">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* セッション情報 */}
        {sessionId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">取引情報</h3>
            <p className="text-sm text-blue-700">
              セッションID: <code className="bg-blue-100 px-2 py-1 rounded">{sessionId}</code>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              この情報は領収書や問い合わせの際に必要になる場合があります。
            </p>
          </div>
        )}

        {/* アクションボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={sendReceiptEmail}
            className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Mail size={20} />
            <span>領収書をメール送信</span>
          </button>
          
          <Link
            href="/purchases"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>購入履歴を確認</span>
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* 次のステップ */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">次のステップ</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-gray-800">商品をダウンロード</p>
                <p className="text-sm text-gray-600">上記の「ダウンロード」ボタンから商品をダウンロードしてください。</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-gray-800">セットアップガイドを確認</p>
                <p className="text-sm text-gray-600">ダウンロードファイルに含まれるREADMEをご確認ください。</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-gray-800">レビューを投稿</p>
                <p className="text-sm text-gray-600">商品をお試しいただいた後、ぜひレビューをお聞かせください。</p>
              </div>
            </div>
          </div>
        </div>

        {/* ホームに戻る */}
        <div className="text-center mt-8">
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