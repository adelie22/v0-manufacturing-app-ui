import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Kakao from "next-auth/providers/kakao"
import { prisma } from "@/lib/prisma"

// Naver 커스텀 OAuth 프로바이더
const NaverProvider = {
  id: "naver",
  name: "네이버",
  type: "oauth" as const,
  authorization: {
    url: "https://nid.naver.com/oauth2.0/authorize",
    params: { scope: "" },
  },
  token: "https://nid.naver.com/oauth2.0/token",
  userinfo: {
    url: "https://openapi.naver.com/v1/nid/me",
    async request({
      tokens,
      provider,
    }: {
      tokens: { access_token: string }
      provider: { userinfo: { url: string } }
    }) {
      const res = await fetch(provider.userinfo.url, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      const data = await res.json()
      return data.response
    },
  },
  profile(profile: {
    id: string
    email?: string
    name?: string
    profile_image?: string
  }) {
    return {
      id: profile.id,
      name: profile.name ?? null,
      email: profile.email ?? null,
      image: profile.profile_image ?? null,
    }
  },
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
  checks: ["state"] as const,
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? "",
    }),
    NaverProvider,
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-expect-error custom field
        session.user.role = (user as { role?: string }).role ?? null
        // @ts-expect-error custom field
        session.user.isProfileComplete =
          (user as { isProfileComplete?: boolean }).isProfileComplete ?? false
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
})
