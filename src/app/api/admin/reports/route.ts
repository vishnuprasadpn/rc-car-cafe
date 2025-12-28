import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {}
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    } else {
      const now = new Date()
      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFilter = {
          createdAt: {
            gte: weekAgo
          }
        }
      } else if (period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateFilter = {
          createdAt: {
            gte: monthAgo
          }
        }
      }
    }

    const [
      totalRevenue,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      newUsers,
      gameStats,
      dailyRevenue,
      topGames
    ] = await Promise.all([
      // Total revenue - only confirmed bookings with completed payments
      prisma.booking.aggregate({
        where: {
          ...dateFilter,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED"
        },
        _sum: { totalPrice: true }
      }),
      
      // Total bookings
      prisma.booking.count({
        where: dateFilter
      }),
      
      // Completed bookings
      prisma.booking.count({
        where: {
          ...dateFilter,
          status: "COMPLETED"
        }
      }),
      
      // Cancelled bookings
      prisma.booking.count({
        where: {
          ...dateFilter,
          status: "CANCELLED"
        }
      }),
      
      // Total users
      prisma.user.count({
        where: {
          role: "CUSTOMER"
        }
      }),
      
      // New users in period
      prisma.user.count({
        where: {
          ...dateFilter,
          role: "CUSTOMER"
        }
      }),
      
      // Game statistics - only confirmed bookings with completed payments
      prisma.booking.groupBy({
        by: ['gameId'],
        where: {
          ...dateFilter,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED"
        },
        _count: { id: true },
        _sum: { totalPrice: true }
      }),
      
      // Daily revenue for chart - only confirmed bookings with completed payments
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          SUM(total_price) as revenue
        FROM bookings
        WHERE status = 'CONFIRMED'
        AND payment_status = 'COMPLETED'
        AND created_at >= ${dateFilter.createdAt?.gte || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(created_at)
        ORDER BY date
      `,
      
      // Top games by revenue - only confirmed bookings with completed payments
      prisma.booking.groupBy({
        by: ['gameId'],
        where: {
          ...dateFilter,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED"
        },
        _sum: { totalPrice: true },
        _count: { id: true },
        orderBy: {
          _sum: {
            totalPrice: 'desc'
          }
        },
        take: 5
      })
    ])

    // Get game details for top games
    const topGamesWithDetails = await Promise.all(
      topGames.map(async (game) => {
        const gameDetails = await prisma.game.findUnique({
          where: { id: game.gameId },
          select: { name: true }
        })
        return {
          ...game,
          gameName: gameDetails?.name || 'Unknown'
        }
      })
    )

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalBookings,
        completedBookings,
        cancelledBookings,
        totalUsers,
        newUsers,
        averageBookingValue: totalBookings > 0 ? (Number(totalRevenue._sum.totalPrice) || 0) / totalBookings : 0
      },
      gameStats: gameStats.map(stat => ({
        gameId: stat.gameId,
        bookings: stat._count.id,
        revenue: stat._sum.totalPrice || 0
      })),
      dailyRevenue,
      topGames: topGamesWithDetails
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
