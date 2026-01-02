import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [
      totalBookings,
      todayBookings,
      pendingPoints,
      totalCustomers
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({
        where: {
          startTime: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      prisma.point.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } })
    ])

    return NextResponse.json({
      totalBookings,
      todayBookings,
      pendingPoints,
      totalCustomers
    })
  } catch (error) {
    console.error("Error fetching staff stats:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
