import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// This is a one-time script endpoint to reset admin passwords
// Should be removed or secured after use
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple secret check (in production, use proper authentication)
    if (secret !== process.env.ADMIN_PASSWORD_RESET_SECRET || !process.env.ADMIN_PASSWORD_RESET_SECRET) {
      // Allow if no secret is set (for one-time use)
      if (process.env.ADMIN_PASSWORD_RESET_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }
    }

    console.log('🔐 Resetting admin passwords...')

    // Update first admin password
    const admin1Password = await bcrypt.hash('FurY@2024', 12)
    const admin1 = await prisma.user.updateMany({
      where: { email: 'furyroadrcclub@gmail.com' },
      data: { password: admin1Password }
    })

    // Update second admin password
    const admin2Password = await bcrypt.hash('Vpn@1991', 12)
    const admin2 = await prisma.user.updateMany({
      where: { email: 'vishnuprasad1990@gmail.com' },
      data: { password: admin2Password }
    })

    return NextResponse.json({
      success: true,
      message: "Admin passwords updated successfully",
      updated: {
        admin1: admin1.count,
        admin2: admin2.count
      },
      credentials: {
        admin1: { email: 'furyroadrcclub@gmail.com', password: 'FurY@2024' },
        admin2: { email: 'vishnuprasad1990@gmail.com', password: 'Vpn@1991' }
      }
    })
  } catch (error) {
    console.error("Error resetting admin passwords:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

