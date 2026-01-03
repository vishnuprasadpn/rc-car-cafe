import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendAdminLoginTestEmail } from "@/lib/email"

// Validate production environment variables on server startup
if (process.env.NODE_ENV === "production") {
  const requiredVars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_URL", "NEXTAUTH_SECRET"]
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error("❌ PRODUCTION ERROR: Missing required environment variables:")
    missingVars.forEach(varName => console.error(`   - ${varName}`))
    console.error("Please set these in your production environment (Vercel/Railway/etc.)")
  } else {
    // Validate NEXTAUTH_URL format
    const nextAuthUrl = process.env.NEXTAUTH_URL || ""
    if (nextAuthUrl.endsWith("/")) {
      console.error("❌ PRODUCTION ERROR: NEXTAUTH_URL should NOT have a trailing slash!")
      console.error(`   Current: ${nextAuthUrl}`)
      console.error(`   Should be: ${nextAuthUrl.slice(0, -1)}`)
    } else {
      // Log configuration (without exposing secrets)
      console.log("✅ Production OAuth configuration validated")
      console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`)
      console.log(`   Callback URL: ${process.env.NEXTAUTH_URL}/api/auth/callback/google`)
      if (process.env.GOOGLE_CLIENT_ID) {
        console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...`)
      }
    }
  }
}

export const authOptions = {
  // Using JWT strategy - PrismaAdapter helps with OAuth account linking
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development", // Enable debug logging in development
  trustHost: true, // Trust the host header (important for production)
  providers: [
    // Only add GoogleProvider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        },
        // Enhanced logging for debugging
        checks: ["pkce", "state"],
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.toLowerCase().trim()
        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }
        
        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            lastLoginAt: new Date(),
            authMethod: user.password ? "email" : undefined // Ensure authMethod is set
          }
        })
        
        // Send test email if admin logged in
        if (user.role === "ADMIN") {
          // Don't await - send email asynchronously so it doesn't block login
          sendAdminLoginTestEmail(user.email, user.name, "email/password").catch((error) => {
            console.error("Failed to send admin login test email:", error)
            // Don't throw - login should succeed even if email fails
          })
        }
        
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
    async signIn({ user, account }: any) {
      // If signing in with Google OAuth
      if (account?.provider === "google") {
        try {
          if (!user?.email) {
            console.error("OAuth: No email provided by Google")
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
                  image: user.image || null, // Profile image from Google
                  emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
                  authMethod: "google", // Track that this user uses Google OAuth
                  lastLoginAt: new Date(), // Set initial login time
                  // No password for OAuth users
                }
              })
              existingUser = newUser
              
              // Send test email if new admin user logged in via OAuth
              if (newUser.role === "ADMIN") {
                // Don't await - send email asynchronously so it doesn't block login
                sendAdminLoginTestEmail(newUser.email, newUser.name, "Google OAuth (new user)").catch((error) => {
                  console.error("Failed to send admin login test email:", error)
                  // Don't throw - login should succeed even if email fails
                })
              }
            } catch (createError) {
              // If creation fails (e.g., race condition), try to fetch again
              if (createError instanceof Error && (
                createError.message.includes("Unique constraint") ||
                createError.message.includes("duplicate key")
              )) {
                existingUser = await prisma.user.findUnique({
                  where: { email }
                })
                if (!existingUser) {
                  console.error("OAuth: User creation failed and user not found")
                  throw createError
                }
              } else {
                console.error("OAuth: User creation error:", createError)
                throw createError
              }
            }
          } else {
            
            // Update user info from OAuth (name, image might have changed)
            // Also update authMethod if user previously used email/password
            const updateData: {
              name?: string
              image?: string | null
              emailVerified?: Date | null
              authMethod?: string
              lastLoginAt: Date
            } = {
              lastLoginAt: new Date()
            }
            
            if (user.name && user.name !== existingUser.name) {
              updateData.name = user.name
            }
            if (user.image !== undefined) {
              updateData.image = user.image || null
            }
            if (user.emailVerified) {
              updateData.emailVerified = new Date(user.emailVerified)
            }
            
            // Update authMethod: if user had password, now they use both methods
            if (existingUser.password && existingUser.authMethod !== "email+google") {
              updateData.authMethod = "email+google"
            } else if (!existingUser.authMethod) {
              updateData.authMethod = "google"
            }
            
            // Only update if there are changes
            if (Object.keys(updateData).length > 1) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: updateData
              })
              console.log(`✅ OAuth: Updated user info for ${email}`)
            } else {
              // Still update lastLoginAt even if nothing else changed
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { lastLoginAt: new Date() }
              })
            }
            
            // Send test email if admin logged in via OAuth
            if (existingUser.role === "ADMIN") {
              console.log(`📧 ==========================================`)
              console.log(`📧 ADMIN OAUTH LOGIN DETECTED - TRIGGERING TEST EMAIL`)
              console.log(`📧 ==========================================`)
              console.log(`📧 User: ${existingUser.name} (${existingUser.email})`)
              console.log(`📧 Role: ${existingUser.role}`)
              console.log(`📧 Login Method: Google OAuth`)
              console.log(`📧 ==========================================`)
              // Don't await - send email asynchronously so it doesn't block login
              sendAdminLoginTestEmail(existingUser.email, existingUser.name, "Google OAuth").catch((error) => {
                console.error("❌ ==========================================")
                console.error("❌ FAILED TO SEND ADMIN LOGIN TEST EMAIL")
                console.error("❌ ==========================================")
                console.error("❌ Error:", error)
                if (error instanceof Error) {
                  console.error("❌ Error message:", error.message)
                  console.error("❌ Error stack:", error.stack)
                }
                console.error("❌ ==========================================")
                // Don't throw - login should succeed even if email fails
              })
            }
          }
          
          // Ensure user has a role (in case it was created by PrismaAdapter without role)
          if (existingUser && !existingUser.role) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { role: "CUSTOMER" }
            })
          }
          
          // IMPORTANT: Update the user object with the database user ID
          // This ensures PrismaAdapter can properly link the Account
          user.id = existingUser.id
          user.email = existingUser.email
          user.name = existingUser.name
          
          // Return true to allow sign-in - PrismaAdapter will handle Account creation
          return true
        } catch (error) {
          console.error("OAuth signIn callback error:", error)
          // Return false to prevent sign-in if there's an error
          return false
        }
      }
      // For credentials provider, always allow
      return true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account, isNewUser }: any) {
      console.log(`🔑 JWT callback: isNewUser=${isNewUser}, account.provider=${account?.provider}`)
      
      if (user) {
        token.role = user.role || "CUSTOMER" // Default role if not set
        token.email = user.email
        if (user.id) {
          token.sub = user.id // Set user ID from user object
        }
      }
      
      // If signing in with OAuth, always fetch fresh user data from database
      if (account?.provider === "google" && user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            select: { role: true, id: true }
          })
          if (dbUser) {
            token.role = dbUser.role || "CUSTOMER"
            token.sub = dbUser.id // Ensure user ID is set
          } else {
            token.role = "CUSTOMER" // Default role
          }
        } catch (error) {
          console.error("Error fetching user role in jwt callback:", error)
          // Don't fail the JWT creation, use default role
          token.role = token.role || "CUSTOMER"
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
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async redirect({ url, baseUrl }: any) {
      // Handle OAuth redirects properly
      // If url is relative, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // If url is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url
      }
      
      // Default: redirect to dashboard
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  }
}
