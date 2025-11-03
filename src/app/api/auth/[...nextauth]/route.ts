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
  // Await params to convert Promise to synchronous object for NextAuth handler
  const params = await context.params
  
  // Call NextAuth handler with synchronous params object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (authHandler as any)(req as any, { params } as any)
}

export const GET = handler
export const POST = handler
