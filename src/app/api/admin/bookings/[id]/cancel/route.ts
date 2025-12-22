import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/admin-auth"

// Helper function to check if user is admin or staff
function isAdminOrStaff(session: Session | null): boolean {
  if (!session || !session.user) {
    return false
  }
  const userRole = (session.user as { role?: string }).role
  return userRole === "ADMIN" || userRole === "STAFF"
}

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

    // Only admins and staff can cancel bookings
    if (!isAdminOrStaff(session)) {
      return NextResponse.json({ message: "Forbidden: Admin or Staff access required" }, { status: 403 })
    }

    const { id: bookingId } = await params

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        game: {
          select: {
            name: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    // Only allow cancellation of pending or confirmed bookings
    if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { message: `Cannot cancel a booking that is ${booking.status.toLowerCase()}` },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        game: {
          select: {
            name: true
          }
        }
      }
    })

    console.log(`✅ ${(session.user as { role?: string }).role} ${(session.user as { email?: string }).email} cancelled booking ${bookingId} (User: ${booking.user.email}, Game: ${booking.game.name})`)

    return NextResponse.json({ 
      message: "Booking cancelled successfully",
      booking: updatedBooking
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

