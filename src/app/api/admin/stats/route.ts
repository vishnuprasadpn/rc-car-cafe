import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const [
      totalUsers,
      totalGames,
      totalBookings,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }), // Only count customers, exclude ADMIN and STAFF
      prisma.game.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { 
          status: "CONFIRMED",
          paymentStatus: "COMPLETED" 
        },
        _sum: { totalPrice: true }
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalGames,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
