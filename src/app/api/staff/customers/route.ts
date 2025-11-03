import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || (session.user as { role?: string }).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        points: {
          select: {
            amount: true,
            status: true
          }
        },
        bookings: {
          select: {
            id: true,
            startTime: true,
            status: true
          },
          orderBy: {
            startTime: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate total points and booking stats for each customer
    const customersWithStats = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      points: customer.points
        .filter(p => p.status === 'APPROVED')
        .reduce((sum, p) => sum + p.amount, 0),
      totalBookings: customer.bookings.length,
      lastBooking: customer.bookings.length > 0 ? customer.bookings[0].startTime : null
    }))

    return NextResponse.json({ customers: customersWithStats })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
