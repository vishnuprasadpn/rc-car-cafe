import { NextResponse } from "next/server"

export async function GET() {
  const config = {
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID 
      ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` 
      : "NOT SET",
    callbackUrl: process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` 
      : "NOT SET",
    hasTrailingSlash: process.env.NEXTAUTH_URL?.endsWith("/") || false,
    nodeEnv: process.env.NODE_ENV || "NOT SET",
    // Validation warnings
    warnings: [] as string[],
    errors: [] as string[]
  }
  
  // Check for common issues
  if (!config.hasClientId) {
    config.errors.push("GOOGLE_CLIENT_ID is not set")
  }
  if (!config.hasClientSecret) {
    config.errors.push("GOOGLE_CLIENT_SECRET is not set")
  }
  if (!config.hasNextAuthUrl) {
    config.errors.push("NEXTAUTH_URL is not set")
  }
  if (!config.hasNextAuthSecret) {
    config.errors.push("NEXTAUTH_SECRET is not set")
  }
  if (config.hasTrailingSlash) {
    config.warnings.push("NEXTAUTH_URL has a trailing slash - this can cause OAuth errors!")
  }
  
  return NextResponse.json(config, { 
    headers: { 
      "Cache-Control": "no-store" 
    } 
  })
}

