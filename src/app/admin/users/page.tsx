'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Search,
  Mail,
  Calendar,
  ShoppingCart,
  Star,
  Ban,
  CheckCircle,
  ArrowLeft,
  Download,
  Filter
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  image?: string
  created_at: string
  purchase_count: number
  total_spent: number
  review_count: number
  is_active: boolean
}

export default function AdminUsers() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/auth/signin')
      return
    }

    loadUsers()
  }, [session, router])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        // デモデータ
        setUsers([
          {
            id: '1',
            name: '田中太郎',
            email: 'tanaka@example.com',
            image: '',
            created_at: '2024-07-15T00:00:00Z',
            purchase_count: 5,
            total_spent: 12400,
            review_count: 3,
            is_active: true
          },
          {
            id: '2',
            name: '山田花子',
            email: 'yamada@example.com',
            image: '',
            created_at: '2024-07-20T00:00:00Z',
            purchase_count: 2,
            total_spent: 4960,
            review_count: 1,
            is_active: true
          },
          {
            id: '3',
            name: '佐藤次郎',
            email: 'sato@example.com',
            image: '',
            created_at: '2024-08-01T00:00:00Z',
            purchase_count: 8,
            total_spent: 24800,
            review_count: 6,
            is_active: true
          },
          {
            id: '4',
            name: '停止ユーザー',
            email: 'banned@example.com',
            image: '',
            created_at: '2024-06-10T00:00:00Z',
            purchase_count: 0,
            total_spent: 0,
            review_count: 0,
            is_active: false
          }
        ])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`このユーザーを${currentStatus ? '停止' : '有効化'}しますか？`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus })
      })

      if (response.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, is_active: !currentStatus } : u
        ))
        alert(`ユーザーを${!currentStatus ? '有効化' : '停止'}しました`)
      } else {
        // デモ版
        setUsers(users.map(u => 
          u.id === userId ? { ...u, is_active: !currentStatus } : u
        ))
        alert(`ユーザーを${!currentStatus ? '有効化' : '停止'}しました（デモ版）`)
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'email':
        return a.email.localeCompare(b.email)
      case 'purchase_count':
        return b.purchase_count - a.purchase_count
      case 'total_spent':
        return b.total_spent - a.total_spent
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 flex items-center">
                <ArrowLeft size={20} className="mr-2" />
                ダッシュボード
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Users size={24} className="mr-2" />
                ユーザー管理
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                <Download size={16} className="mr-2" />
                CSV出力
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users size={24} className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle size={24} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">アクティブユーザー</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.is_active).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <ShoppingCart size={24} className="text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総購入数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, u) => sum + u.purchase_count, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Star size={24} className="text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総レビュー数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((sum, u) => sum + u.review_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="ユーザー名・メールアドレスで検索..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">登録日順</option>
              <option value="name">名前順</option>
              <option value="purchase_count">購入数順</option>
              <option value="total_spent">購入金額順</option>
            </select>

            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">{sortedUsers.length}件表示</span>
            </div>
          </div>
        </div>

        {/* ユーザー一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    登録日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    購入実績
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    レビュー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail size={12} className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <ShoppingCart size={12} className="mr-1" />
                          {user.purchase_count}件
                        </div>
                        <div className="text-xs text-gray-500">
                          ¥{user.total_spent.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Star size={12} className="mr-1 text-yellow-500" />
                        {user.review_count}件
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.is_active ? 'アクティブ' : '停止中'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alert(`${user.name}の詳細画面（準備中）`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="詳細を見る"
                        >
                          詳細
                        </button>
                        
                        <button
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className={`${
                            user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={user.is_active ? 'ユーザーを停止' : 'ユーザーを有効化'}
                        >
                          {user.is_active ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ユーザーが見つかりません</h3>
              <p className="text-gray-500">検索条件を変更してください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}