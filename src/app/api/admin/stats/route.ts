import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const [
      totalUsers,
      totalGames,
      totalBookings,
      totalRevenue,
      pendingPoints
    ] = await Promise.all([
      prisma.user.count(),
      prisma.game.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        where: { paymentStatus: "COMPLETED" },
        _sum: { totalPrice: true }
      }),
      prisma.point.count({ where: { status: "PENDING" } })
    ])

    return NextResponse.json({
      totalUsers,
      totalGames,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      pendingPoints
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
