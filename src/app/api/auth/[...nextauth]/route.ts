import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// NextAuth handler is compatible with Next.js 15 route handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions) as any

export const GET = handler
export const POST = handler
