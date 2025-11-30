import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Code must be 6 digits"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = verifyCodeSchema.parse(body)

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
        code,
        used: false,
        expires: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        createdAt: "desc", // Get the most recent one
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset code. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Mark token as used (but don't delete yet, in case reset fails)
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    })

    return NextResponse.json(
      { message: "Code verified successfully", tokenId: resetToken.id },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error verifying reset code:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

