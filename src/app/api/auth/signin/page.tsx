'use client'
import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Chrome, Shield, Zap } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // 既にログイン済みの場合はリダイレクト
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: true
      })

      // redirect: trueの場合、成功時は自動でリダイレクトされる
      if (result?.error) {
        setError('ログインに失敗しました。もう一度お試しください。')
        setIsLoading(false)
      }
    } catch (error) {
      setError('ログインエラーが発生しました。')
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  const handleEmailDemo = () => {
    alert('デモ版ではGoogleログインのみご利用いただけます。')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 戻るボタン */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          ホームに戻る
        </Link>

        {/* メインカード */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">AI</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              AI Marketplaceへようこそ
            </h1>
            <p className="text-gray-600">
              アカウントにログインして、AIツールの購入・販売を始めましょう
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* ログインボタン */}
          <div className="space-y-4">
            {/* Google認証 */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-3"></div>
              ) : (
                <Chrome size={20} className="mr-3 text-red-500" />
              )}
              <span>Googleでログイン</span>
            </button>

            {/* メール認証（デモ） */}
            <button
              onClick={handleEmailDemo}
              className="w-full flex items-center justify-center px-6 py-4 bg-gray-100 border-2 border-gray-200 rounded-xl font-medium text-gray-500 cursor-not-allowed"
            >
              <Mail size={20} className="mr-3" />
              <span>メールアドレスでログイン（準備中）</span>
            </button>
          </div>

          {/* 区切り線 */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">または</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* ゲスト体験 */}
          <Link
            href="/"
            className="block w-full text-center px-6 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
          >
            ゲストとして体験する
          </Link>

          {/* 利用規約 */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            ログインすることで、
            <Link href="/terms" className="text-blue-600 hover:underline">利用規約</Link>
            および
            <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            に同意したものとみなされます。
          </p>
        </div>

        {/* 特徴 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Shield size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">安全な決済</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Zap size={24} className="text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">即座にダウンロード</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Chrome size={24} className="text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600">簡単ログイン</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}