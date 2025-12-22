import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  // Note: Using JWT strategy, so PrismaAdapter is optional but helps with OAuth account linking
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Auth: Missing email or password')
          return null
        }

        const email = credentials.email.toLowerCase().trim()
        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        })

        if (!user) {
          console.log(`❌ Auth: User not found for email: ${email}`)
          return null
        }

        if (!user.password) {
          console.log(`❌ Auth: No password set for user: ${email}`)
          return null
        }

        // Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          console.log(`❌ Auth: Invalid password for user: ${email}`)
          return null
        }

        console.log(`✅ Auth: Successful login for ${email} (${user.role})`)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account, profile }: any) {
      // If signing in with Google OAuth
      if (account?.provider === "google") {
        try {
          if (!user?.email) {
            console.error("❌ OAuth: No email provided by Google")
            return false
          }

          const email = user.email.toLowerCase()
          
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email }
          })

          // If user doesn't exist, create a new user with CUSTOMER role
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email,
                name: user.name || "User",
                role: "CUSTOMER",
                // No password for OAuth users
              }
            })
            console.log(`✅ OAuth: Created new user ${email}`)
          } else {
            console.log(`✅ OAuth: Existing user ${email} signed in`)
          }
        } catch (error) {
          console.error("❌ OAuth signIn callback error:", error)
          // Return false to prevent sign-in if there's an error
          return false
        }
      }
      return true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role
        token.email = user.email
      }
      // If signing in with OAuth, fetch user role from database
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
          select: { role: true }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  }
}
