import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Force Node.js runtime
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpPort = process.env.SMTP_PORT || "587"

  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "not set",
    vercelUrl: process.env.VERCEL_URL || "not set",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "not set",
    smtp: {
      SMTP_HOST: smtpHost ? `✅ Set (${smtpHost})` : "❌ MISSING",
      SMTP_USER: smtpUser ? `✅ Set (${smtpUser})` : "❌ MISSING",
      SMTP_PASS: smtpPass ? `✅ Set (${smtpPass.length} chars)` : "❌ MISSING",
      SMTP_PORT: smtpPort,
    },
  }

  // If SMTP is configured, try to connect
  if (smtpHost && smtpUser && smtpPass) {
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

      await transporter.verify()
      diagnostics.smtpConnection = "✅ Connected successfully"

      // Send a test email
      const info = await transporter.sendMail({
        from: smtpUser,
        to: smtpUser,
        subject: `[Debug] Email test from ${process.env.VERCEL_ENV || "unknown"} - ${new Date().toLocaleString()}`,
        html: `<p>This is a test email sent from the <strong>${process.env.VERCEL_ENV || "unknown"}</strong> environment.</p>
               <p>Domain: ${process.env.VERCEL_URL || "unknown"}</p>
               <p>Time: ${new Date().toISOString()}</p>`,
      })

      diagnostics.testEmail = {
        status: "✅ Sent",
        messageId: info.messageId,
        response: info.response,
      }
    } catch (error) {
      diagnostics.smtpConnection = `❌ Failed: ${error instanceof Error ? error.message : String(error)}`
    }
  } else {
    diagnostics.smtpConnection = "⏭️ Skipped - SMTP not configured"
  }

  return NextResponse.json(diagnostics, { status: 200 })
}
