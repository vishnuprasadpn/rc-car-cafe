import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import type { NextRequest } from "next/server"

// NextAuth v4 with Next.js 15 App Router
// NextAuth(options) returns a handler that expects synchronous params
// We need to await the params promise and pass it synchronously
// @ts-expect-error - NextAuth is callable but TypeScript types don't reflect this correctly
const authHandler = NextAuth(authOptions)

const handler = async (
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  try {
    // Await params to convert Promise to synchronous object for NextAuth handler
    const params = await context.params
    
    // Log callback requests for debugging
    if (params.nextauth?.[0] === "callback") {
      console.log(`🔄 OAuth callback received: ${params.nextauth.join("/")}`)
      const url = new URL(req.url)
      const code = url.searchParams.get("code")
      const error = url.searchParams.get("error")
      if (error) {
        console.error(`❌ OAuth callback error: ${error}`)
      }
      if (code) {
        console.log(`✅ OAuth callback code received`)
      }
    }
    
    // Call NextAuth handler with synchronous params object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (authHandler as any)(req as any, { params } as any)
    return response
  } catch (error) {
    console.error("❌ NextAuth handler error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw error
  }
}

export const GET = handler
export const POST = handler
