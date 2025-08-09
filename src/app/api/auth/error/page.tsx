'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Home } from 'lucide-react'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return 'サーバー設定にエラーがあります。管理者にお問い合わせください。'
      case 'AccessDenied':
        return 'アクセスが拒否されました。適切な権限がない可能性があります。'
      case 'Verification':
        return 'メール認証に失敗しました。'
      case 'Default':
      default:
        return 'ログイン中にエラーが発生しました。もう一度お試しください。'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          ホームに戻る
        </Link>

        {/* エラーカード */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ログインエラー
            </h1>
            <p className="text-gray-600">
              {getErrorMessage(error)}
            </p>
          </div>

          {/* エラー詳細 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                エラーコード: <code className="bg-red-100 px-2 py-1 rounded">{error}</code>
              </p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full block text-center bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              もう一度ログインする
            </Link>
            
            <Link
              href="/"
              className="w-full block text-center bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>ホームページに戻る</span>
            </Link>
          </div>

          {/* 問い合わせ */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              問題が解決しない場合は、
              <a href="mailto:support@ai-marketplace.com" className="text-blue-600 hover:underline">
                サポートチーム
              </a>
              までお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}