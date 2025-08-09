import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo'
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
  callbacks: {
    async redirect({ baseUrl }) {
      // 常にホームページにリダイレクト
      return baseUrl
    }
  },
  debug: true // デバッグモード有効
}