import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetCodeEmail } from "@/lib/email"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Forgot password request received')
    const body = await request.json()
    console.log('   Request body:', { email: body.email ? 'provided' : 'missing' })
    
    const { email } = forgotPasswordSchema.parse(body)
    console.log('   Validated email:', email.toLowerCase())

    // Find user by email
    console.log('   Looking up user in database...')
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
    } catch (dbError) {
      console.error('   ❌ Database error while looking up user:', dbError)
      if (dbError instanceof Error) {
        if (dbError.message.includes('MaxClients') || dbError.message.includes('max clients')) {
          throw new Error('Database connection limit reached. Please try again in a moment.')
        }
      }
      throw dbError
    }

    // Always return success to prevent email enumeration
    if (!user) {
      console.log('   User not found, returning success (email enumeration protection)')
      return NextResponse.json(
        { message: "If an account exists with this email, a reset code has been sent." },
        { status: 200 }
      )
    }

    console.log('   User found:', { id: user.id, name: user.name, email: user.email })

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('   Generated reset code:', code)

    // Set expiration to 15 minutes from now
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    console.log('   Code expires at:', expires.toISOString())

    // Delete any existing reset tokens for this email
    console.log('   Deleting existing reset tokens...')
    try {
      await prisma.passwordResetToken.deleteMany({
        where: { email: email.toLowerCase() },
      })
      console.log('   ✅ Existing tokens deleted')
    } catch (deleteError) {
      console.error('   ⚠️  Error deleting existing tokens (continuing anyway):', deleteError)
      // Continue even if delete fails
    }

    // Create new reset token
    console.log('   Creating new reset token...')
    try {
      const resetToken = await prisma.passwordResetToken.create({
        data: {
          email: email.toLowerCase(),
          code,
          expires,
        },
      })
      console.log('   ✅ Reset token created successfully:', resetToken.id)
    } catch (createError) {
      console.error('   ❌ Error creating reset token:')
      if (createError instanceof Error) {
        console.error('   Error message:', createError.message)
        console.error('   Error name:', createError.name)
        console.error('   Error stack:', createError.stack)
        
        // Check for Prisma-specific errors
        if (createError.message.includes('does not exist') || createError.message.includes('relation') || createError.message.includes('table')) {
          console.error('   ⚠️  Database table might not exist. Run: npx prisma db push')
          throw new Error('Database table not found. Please contact the administrator.')
        }
        if (createError.message.includes('MaxClients') || createError.message.includes('max clients')) {
          console.error('   ⚠️  Database connection pool exhausted. Please try again in a moment.')
          throw new Error('Database connection limit reached. Please try again in a moment.')
        }
      }
      // Re-throw the original error if it's not a known issue
      throw createError
    }

    // Send email with reset code
    let emailSent = false
    let emailError: string | null = null
    
    console.log("📧 Preparing to send password reset email...")
    console.log("   User email:", user.email)
    console.log("   User name:", user.name)
    console.log("   Reset code:", code)
    
    try {
      await sendPasswordResetCodeEmail(user.email, user.name, code)
      console.log("✅ Password reset code sent successfully to:", user.email)
      emailSent = true
    } catch (error) {
      console.error("❌ Failed to send password reset email to", user.email)
      console.error("   Error details:", error)
      
      // Log detailed error
      if (error instanceof Error) {
        console.error("   Error message:", error.message)
        console.error("   Error stack:", error.stack)
        emailError = error.message
      }
      
      // Check if it's an SMTP configuration error
      if (error instanceof Error && error.message.includes('not configured')) {
        console.error("   ⚠️  SMTP is not properly configured!")
        console.error("   Please check SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables")
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
    console.error("❌ Error processing forgot password request:")
    
    if (error instanceof z.ZodError) {
      console.error("   Validation error:", error.issues)
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    // Log detailed error information
    if (error instanceof Error) {
      console.error("   Error message:", error.message)
      console.error("   Error name:", error.name)
      console.error("   Error stack:", error.stack)
    }
    
    if (error && typeof error === 'object') {
      if ('code' in error) {
        console.error("   Error code:", (error as { code: unknown }).code)
      }
      if ('meta' in error) {
        console.error("   Error meta:", (error as { meta: unknown }).meta)
      }
    }

    // Return a more helpful error message in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `Internal server error: ${error.message}`
      : "Internal server error. Please try again later."

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}

