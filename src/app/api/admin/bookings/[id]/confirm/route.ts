import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmationEmail } from "@/lib/email"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const userRole = (session.user as { role?: string }).role
    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id: bookingId } = await params

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        game: true,
        user: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    // Only allow confirmation of pending bookings
    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { message: `Cannot confirm a booking that is ${booking.status.toLowerCase()}` },
        { status: 400 }
      )
    }

    // Update booking status to confirmed
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
      },
      include: {
        game: true,
        user: true,
      },
    })

    // Send confirmation email to customer
    try {
      await sendBookingConfirmationEmail({
        user: {
          name: booking.user.name,
          email: booking.user.email,
        },
        booking: {
          id: booking.id,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          totalPrice: Number(booking.totalPrice),
          players: booking.players,
        },
        game: {
          name: booking.game.name,
          duration: booking.game.duration,
        },
      })
    } catch (error) {
      console.error("Error sending confirmation email:", error)
      // Don't fail the confirmation if email fails
    }

    return NextResponse.json({ booking: updatedBooking, message: "Booking confirmed successfully" })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

