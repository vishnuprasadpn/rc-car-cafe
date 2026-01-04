import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingNotificationToAdmin, sendBookingRequestEmail } from "@/lib/email"

export async function GET() {
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
    const { gameId, startTime, players, duration, totalPrice } = body

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

    // Calculate end time - use custom duration if provided (for special offers), otherwise use game duration
    const bookingDuration = duration || game.duration
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + bookingDuration)

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

    // Check if user has active membership (optional - members can use membership sessions)
    const userId = (session.user as { id: string }).id
    const activeMembership = await prisma.membership.findFirst({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
    })

    // If user has active membership, validate it
    if (activeMembership) {
      const now = new Date()
      
      // Check if membership is expired
      if (activeMembership.expiryDate < now) {
        // Auto-update to expired
        await prisma.membership.update({
          where: { id: activeMembership.id },
          data: { status: "EXPIRED" },
        })
        return NextResponse.json(
          { message: "Your membership has expired. Please renew to continue booking." },
          { status: 400 }
        )
      }

      // Check if sessions are exhausted
      if (activeMembership.sessionsRemaining <= 0) {
        // Auto-update to completed
        await prisma.membership.update({
          where: { id: activeMembership.id },
          data: { status: "COMPLETED" },
        })
        return NextResponse.json(
          { message: "You have used all your membership sessions. Please renew to continue booking." },
          { status: 400 }
        )
      }

    }

    // Calculate total price - use custom price if provided (for special offers), otherwise calculate from game price
    const bookingTotalPrice = totalPrice !== undefined ? Number(totalPrice) : Number(game.price) * players

    // Get user details for email
    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Create booking with instant confirmation
    const booking = await prisma.booking.create({
      data: {
        userId: (session.user as { id: string }).id,
        gameId: gameId,
        startTime: start,
        endTime: end,
        duration: bookingDuration,
        players: players,
        totalPrice: bookingTotalPrice,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
      },
      include: {
        game: true,
      },
    })

    // Calculate and allocate points (10 points per ₹100 spent)
    const pointsEarned = Math.floor(Number(bookingTotalPrice) / 100) * 10
    
    if (pointsEarned > 0) {
      try {
        // Find an admin user for auto-approval
        const adminUser = await prisma.user.findFirst({
          where: { role: "ADMIN" },
          select: { id: true },
        })

        // Create points entry - auto-approved for bookings
        await prisma.point.create({
          data: {
            userId: (session.user as { id: string }).id,
            amount: pointsEarned,
            reason: `Booking points - ${game.name} (₹${Number(bookingTotalPrice).toLocaleString("en-IN")})`,
            status: "APPROVED",
            approvedBy: adminUser?.id || null,
            approvedAt: new Date(),
          },
        })
      } catch (error) {
        console.error("Error allocating points for booking:", booking.id, error)
        // Don't fail the booking creation if points allocation fails
      }
    }

    // Send emails to both customer and admin
    try {
      // Send booking request email to customer
      await sendBookingRequestEmail({
        user: {
          name: user.name,
          email: user.email,
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
          duration: bookingDuration,
        },
      })
    } catch (error) {
      console.error("Error sending booking request email to customer:", error)
      // Don't fail the booking creation if email fails
    }

    try {
      // Send notification email to admin
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
          duration: bookingDuration,
        },
      })
    } catch (error) {
      console.error("Error sending admin notification email for booking:", booking.id, error)
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
