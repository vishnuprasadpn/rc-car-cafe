import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetCodeEmail } from "@/lib/email"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, a reset code has been sent." },
        { status: 200 }
      )
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration to 15 minutes from now
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    // Delete any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        code,
        expires,
      },
    })

    // Send email with reset code
    let emailSent = false
    let emailError: string | null = null
    
    try {
      await sendPasswordResetCodeEmail(user.email, user.name, code)
      console.log("✅ Password reset code sent to:", user.email)
      emailSent = true
    } catch (error) {
      console.error("❌ Failed to send password reset email to", user.email, ":", error)
      // Log detailed error
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        emailError = error.message
      }
      // Still return success to prevent email enumeration, but log the error
      // In production, you might want to return an error or queue the email for retry
    }

    // In development, include error info in response for debugging
    const response: {
      message: string
      debug?: {
        emailSent: boolean
        emailError: string | null
        code?: string
      }
    } = { 
      message: "If an account exists with this email, a reset code has been sent." 
    }
    
    if (process.env.NODE_ENV === 'development') {
      response.debug = {
        emailSent,
        emailError,
        code: emailSent ? code : undefined, // Only include code if email was sent (for testing)
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error processing forgot password request:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

