// src/lib/data.ts
import { Product } from './types'

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'AI文章校正ツール',
    description: '日本語の文章を自動で校正・改善してくれるAIツール。ビジネス文書からブログ記事まで対応。誤字脱字の検出、敬語の提案、読みやすさの向上を実現します。',
    price: 2980,
    category: '文章作成',
    icon: '🧠',
    rating: 4.8,
    reviewCount: 127,
    tags: ['文章作成', '校正', 'ビジネス', 'AI', '日本語'],
    creator: '田中AI研究所'
  },
  {
    id: 2,
    title: 'データ分析アシスタント',
    description: 'CSVファイルを自動でグラフ化・分析するAIツール。複雑なデータも瞬時に美しいグラフに変換し、トレンドや相関関係を発見します。',
    price: 4500,
    category: 'データ分析',
    icon: '📊',
    rating: 4.6,
    reviewCount: 89,
    tags: ['データ分析', 'グラフ', '統計', 'CSV', '自動化'],
    creator: 'データサイエンス株式会社'
  },
  {
    id: 3,
    title: 'ロゴ生成AI',
    description: '会社名を入力するだけでプロ品質のロゴを自動生成。複数のデザインパターンから選択でき、高解像度での出力も可能です。',
    price: 1980,
    category: 'デザイン',
    icon: '🎨',
    rating: 4.9,
    reviewCount: 203,
    tags: ['デザイン', 'ロゴ', 'ブランディング', 'AI', '自動生成'],
    creator: 'クリエイティブAI'
  },
  {
    id: 4,
    title: 'カスタマーサポートBot',
    description: '24時間365日対応のAIチャットボット。よくある質問への自動回答、エスカレーション機能、学習機能を搭載。',
    price: 3500,
    category: 'チャットボット',
    icon: '💬',
    rating: 4.4,
    reviewCount: 156,
    tags: ['チャットボット', 'サポート', '自動化', 'FAQ', 'ビジネス'],
    creator: 'サポートテック'
  },
  {
    id: 5,
    title: '学習計画AI',
    description: '目標と現在のレベルを入力すると、最適化された学習スケジュールを自動作成。進捗管理とモチベーション維持をサポート。',
    price: 2200,
    category: '教育',
    icon: '📚',
    rating: 4.7,
    reviewCount: 95,
    tags: ['教育', '学習', '計画', 'スケジュール', 'AI'],
    creator: 'エデュテックAI'
  },
  {
    id: 6,
    title: 'SEO最適化ツール',
    description: 'WebサイトのSEO状況を自動分析し、具体的な改善提案を提供。競合分析、キーワード調査、技術的SEO診断を網羅。',
    price: 5980,
    category: 'マーケティング',
    icon: '🔍',
    rating: 4.5,
    reviewCount: 74,
    tags: ['SEO', '分析', 'マーケティング', 'Web', '最適化'],
    creator: 'SEOマスター'
  }
]