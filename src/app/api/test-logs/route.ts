import { NextRequest, NextResponse } from "next/server"

/**
 * Test endpoint to verify logging works in Vercel
 * Call this endpoint and check Vercel logs to see if logs appear
 */
export async function GET(_request: NextRequest) {
  console.log("🔵 ==========================================")
  console.log("🔵 TEST LOGS ENDPOINT CALLED")
  console.log("🔵 ==========================================")
  console.log("🔵 Timestamp:", new Date().toISOString())
  console.log("🔵 Environment:", process.env.NODE_ENV || "not set")
  console.log("🔵 Vercel Region:", process.env.VERCEL_REGION || "not set")
  
  // Test SMTP configuration
  console.log("🔵 SMTP Configuration:")
  console.log("   SMTP_HOST:", process.env.SMTP_HOST || "❌ NOT SET")
  console.log("   SMTP_PORT:", process.env.SMTP_PORT || "587 (default)")
  console.log("   SMTP_USER:", process.env.SMTP_USER || "❌ NOT SET")
  console.log("   SMTP_PASS:", process.env.SMTP_PASS ? "✅ SET" : "❌ NOT SET")
  
  // Test other important env vars
  console.log("🔵 Other Environment Variables:")
  console.log("   DATABASE_URL:", process.env.DATABASE_URL ? "✅ SET" : "❌ NOT SET")
  console.log("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NOT SET")
  console.log("   NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ SET" : "❌ NOT SET")
  console.log("   GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ SET" : "❌ NOT SET")
  console.log("   GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ SET" : "❌ NOT SET")
  
  console.log("🔵 ==========================================")
  console.log("✅ If you see this in Vercel logs, logging is working!")
  console.log("🔵 ==========================================")
  
  return NextResponse.json({
    success: true,
    message: "Test logs endpoint called successfully. Check Vercel logs to see the output.",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "not set",
    vercelRegion: process.env.VERCEL_REGION || "not set",
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  })
}

