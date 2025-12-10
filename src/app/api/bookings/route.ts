import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingNotificationToAdmin } from "@/lib/email"

export async function GET(_request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: (session.user as { id: string }).id
      },
      include: {
        game: true
      },
      orderBy: {
        startTime: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { gameId, startTime, players } = body

    // Validate input
    if (!gameId || !startTime || !players) {
      return NextResponse.json(
        { message: "Missing required fields: gameId, startTime, and players" },
        { status: 400 }
      )
    }

    // Check if game exists and is active
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 })
    }

    if (!game.isActive) {
      return NextResponse.json({ message: "Game is not available" }, { status: 400 })
    }

    // Validate players count
    if (players < 1) {
      return NextResponse.json(
        { message: "Number of players must be at least 1" },
        { status: 400 }
      )
    }

    // Parse and validate start time
    const start = new Date(startTime)
    if (isNaN(start.getTime())) {
      return NextResponse.json({ message: "Invalid start time" }, { status: 400 })
    }

    // Check if start time is in the future
    if (start < new Date()) {
      return NextResponse.json({ message: "Start time must be in the future" }, { status: 400 })
    }

    // Calculate end time
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + game.duration)

    // Check for booking conflicts (overlapping time slots for the same game)
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        gameId: gameId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            startTime: {
              lt: end,
            },
            endTime: {
              gt: start,
            },
          },
        ],
      },
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { message: "This time slot is already booked. Please choose another time." },
        { status: 409 }
      )
    }

    // Calculate total price
    const totalPrice = Number(game.price) * players

    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: (session.user as { id: string }).id,
        gameId: gameId,
        startTime: start,
        endTime: end,
        duration: game.duration,
        players: players,
        totalPrice: totalPrice,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: {
        game: true,
      },
    })

    // Send notification email to admin
    try {
      await sendBookingNotificationToAdmin({
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone || undefined,
        },
        booking: {
          id: booking.id,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          totalPrice: Number(booking.totalPrice),
          players: booking.players,
        },
        game: {
          name: game.name,
          duration: game.duration,
        },
      })
    } catch (error) {
      console.error("Error sending admin notification email:", error)
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
