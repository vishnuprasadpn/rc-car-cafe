import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Session } from "next-auth"
import nodemailer from "nodemailer"

export async function GET(request: NextRequest) {
  try {
    // Only allow admins to test email
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check SMTP configuration
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpPort = process.env.SMTP_PORT || "587"

    const configStatus = {
      SMTP_HOST: smtpHost ? "✅ Set" : "❌ MISSING",
      SMTP_USER: smtpUser ? "✅ Set" : "❌ MISSING",
      SMTP_PASS: smtpPass ? "✅ Set" : "❌ MISSING",
      SMTP_PORT: smtpPort,
    }

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        status: "not_configured",
        message: "SMTP is not fully configured",
        config: configStatus,
        instructions: [
          "1. Go to Vercel Dashboard → Settings → Environment Variables",
          "2. Add SMTP_HOST (e.g., smtp.gmail.com)",
          "3. Add SMTP_USER (your email address)",
          "4. Add SMTP_PASS (Gmail App Password - 16 characters)",
          "5. Add SMTP_PORT (587 for Gmail)",
          "6. Redeploy the application",
        ],
      }, { status: 200 })
    }

    // Try to create transporter and verify connection
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      })

      // Verify connection
      await transporter.verify()

      // Try sending a test email
      const testEmail = {
        from: smtpUser,
        to: smtpUser, // Send to self for testing
        subject: "Test Email - Fury Road RC Club",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #F71B0F;">Test Email</h2>
            <p>This is a test email to verify SMTP configuration is working correctly.</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p>If you received this email, your SMTP configuration is correct!</p>
          </div>
        `,
      }

      const info = await transporter.sendMail(testEmail)

      return NextResponse.json({
        status: "success",
        message: "Test email sent successfully!",
        config: configStatus,
        emailInfo: {
          messageId: info.messageId,
          response: info.response,
        },
      }, { status: 200 })
    } catch (error) {
      return NextResponse.json({
        status: "error",
        message: "Failed to send test email",
        config: configStatus,
        error: error instanceof Error ? error.message : String(error),
        errorDetails: error instanceof Error ? {
          name: error.name,
          stack: error.stack,
        } : null,
      }, { status: 200 })
    }
  } catch (error) {
    console.error("Error in test email endpoint:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

