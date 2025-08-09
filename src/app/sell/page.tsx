'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Plus, 
  X,
  AlertCircle,
  Save
} from 'lucide-react'

interface ProductForm {
  title: string
  description: string
  category: string
  price: number
  tags: string[]
  icon: string
  targetUsers: string
  features: string[]
  isPublic: boolean
}

type FormStep = 'basic' | 'details' | 'preview'

export default function SellPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>('basic')
  const [newTag, setNewTag] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    description: '',
    category: '',
    price: 0,
    tags: [],
    icon: '🤖',
    targetUsers: '',
    features: [],
    isPublic: true
  })

  const categories = [
    'チャットボット',
    '画像生成',
    'テキスト処理',
    'データ分析',
    '音声認識',
    '翻訳',
    'コード生成',
    'その他'
  ]

  const iconOptions = [
    '🤖', '💬', '🎨', '📊', '🎵', '🌐', '💻', '📝',
    '🔍', '⚡', '🧠', '🎯', '🚀', '💡', '🛠️', '📱'
  ]

  const handleInputChange = (field: keyof ProductForm, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }))
  }

  const validateBasicForm = (): boolean => {
    return formData.title.trim() !== '' && 
           formData.description.trim() !== '' && 
           formData.category !== '' && 
           formData.price > 0
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // 仮の送信処理（実際にはAPIに送信）
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`🎉 商品「${formData.title}」を出品しました！\n\n審査完了後、マーケットプレイスに公開されます。`)
    
    setIsSubmitting(false)
    router.push('/')
  }

  const nextStep = () => {
    if (currentStep === 'basic' && validateBasicForm()) {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('preview')
    }
  }

  const prevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('basic')
    } else if (currentStep === 'preview') {
      setCurrentStep('details')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>ホームに戻る</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">AIツール出品</h1>
            <div className="text-sm text-gray-500">
              ステップ {currentStep === 'basic' ? '1' : currentStep === 'details' ? '2' : '3'}/3
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${currentStep === 'basic' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              基本情報
            </span>
            <span className={`text-sm ${currentStep === 'details' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              詳細設定
            </span>
            <span className={`text-sm ${currentStep === 'preview' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              プレビュー
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: currentStep === 'basic' ? '33%' : 
                       currentStep === 'details' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* 基本情報ステップ */}
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">基本情報</h2>
              
              {/* 商品タイトル */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品タイトル *
                </label>
                <input
                  type="text"
                  placeholder="例: 高性能ChatBotテンプレート"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              {/* 商品説明 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品説明 *
                </label>
                <textarea
                  rows={4}
                  placeholder="あなたのAIツールの特徴や使用方法を詳しく説明してください..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* カテゴリとアイコン */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    カテゴリ *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">カテゴリを選択</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アイコン
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleInputChange('icon', icon)}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                          formData.icon === icon 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 価格 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  価格 (円) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">¥</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 詳細設定ステップ */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">詳細設定</h2>

              {/* ターゲットユーザー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ターゲットユーザー
                </label>
                <input
                  type="text"
                  placeholder="例: マーケティング担当者、ブロガー、学生"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.targetUsers}
                  onChange={(e) => handleInputChange('targetUsers', e.target.value)}
                />
              </div>

              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="タグを入力..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 主な機能 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主な機能
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder="機能を入力..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 公開設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公開設定
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-gray-700">
                    審査完了後、すぐにマーケットプレイスで公開する
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* プレビューステップ */}
          {currentStep === 'preview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">プレビュー</h2>

              {/* 商品カードプレビュー */}
              <div className="border rounded-xl p-6 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">商品カードプレビュー</h3>
                <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-md">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 text-center">
                    <div className="text-5xl mb-2">{formData.icon}</div>
                    <div className="text-sm text-gray-600">{formData.category}</div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{formData.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{formData.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {formData.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      ¥{formData.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 入力内容確認 */}
              <div className="border rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">入力内容の確認</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">基本情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">タイトル:</span> {formData.title}</div>
                      <div><span className="text-gray-500">カテゴリ:</span> {formData.category}</div>
                      <div><span className="text-gray-500">価格:</span> ¥{formData.price.toLocaleString()}</div>
                      <div><span className="text-gray-500">公開設定:</span> {formData.isPublic ? '公開' : '非公開'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">詳細情報</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">ターゲット:</span> {formData.targetUsers || '未設定'}</div>
                      <div><span className="text-gray-500">タグ数:</span> {formData.tags.length}個</div>
                      <div><span className="text-gray-500">機能数:</span> {formData.features.length}個</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 'basic'}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 'basic'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              戻る
            </button>

            {currentStep === 'preview' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>出品中...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>出品する</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === 'basic' && !validateBasicForm()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  (currentStep === 'basic' && !validateBasicForm())
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>次へ</span>
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            )}
          </div>

          {/* バリデーションエラー */}
          {currentStep === 'basic' && !validateBasicForm() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium">入力を完了してください</h4>
                <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                  {!formData.title.trim() && <li>• 商品タイトルを入力してください</li>}
                  {!formData.description.trim() && <li>• 商品説明を入力してください</li>}
                  {!formData.category && <li>• カテゴリを選択してください</li>}
                  {formData.price <= 0 && <li>• 価格を設定してください</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}