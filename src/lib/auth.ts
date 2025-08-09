import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // 初回ログイン時にユーザーIDを設定
      if (account && user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // セッションにユーザーIDを追加
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // ログイン後は常にホームページにリダイレクト
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      // ユーザー情報をSupabaseに同期
      if (account?.provider === 'google' && user.email) {
        try {
          await supabase
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              name: user.name || 'Unknown',
              image: user.image,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
        } catch (error) {
          console.error('Error syncing user to Supabase:', error)
        }
      }
    }
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}