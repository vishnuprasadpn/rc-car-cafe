import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  // Using JWT strategy - PrismaAdapter helps with OAuth account linking but isn't required
  // If you get errors, you can remove the adapter and handle OAuth accounts manually
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development", // Enable debug logging in development
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
          let existingUser = await prisma.user.findUnique({
            where: { email }
          })

          // If user doesn't exist, create a new user with CUSTOMER role
          // This must happen before PrismaAdapter tries to link the account
          if (!existingUser) {
            try {
              const newUser = await prisma.user.create({
                data: {
                  email,
                  name: user.name || "User",
                  role: "CUSTOMER",
                  // No password for OAuth users
                }
              })
              console.log(`✅ OAuth: Created new user ${email} with ID ${newUser.id}`)
              existingUser = newUser
            } catch (createError) {
              // If creation fails (e.g., race condition), try to fetch again
              if (createError instanceof Error && createError.message.includes("Unique constraint")) {
                existingUser = await prisma.user.findUnique({
                  where: { email }
                })
                if (existingUser) {
                  console.log(`✅ OAuth: User ${email} was created by another process`)
                } else {
                  throw createError
                }
              } else {
                throw createError
              }
            }
          } else {
            console.log(`✅ OAuth: Existing user ${email} (ID: ${existingUser.id}) signed in`)
          }
          
          // Ensure user has a role (in case it was created by PrismaAdapter without role)
          if (existingUser && !existingUser.role) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { role: "CUSTOMER" }
            })
            console.log(`✅ OAuth: Set role for user ${email}`)
          }
          
          // Return true to allow sign-in
          return true
        } catch (error) {
          console.error("❌ OAuth signIn callback error:", error)
          if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
          } else {
            console.error("Error details:", JSON.stringify(error, null, 2))
          }
          // Return false to prevent sign-in if there's an error
          return false
        }
      }
      // For credentials provider, always allow
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
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            select: { role: true }
          })
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("❌ Error fetching user role in jwt callback:", error)
          // Don't fail the JWT creation, just log the error
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
