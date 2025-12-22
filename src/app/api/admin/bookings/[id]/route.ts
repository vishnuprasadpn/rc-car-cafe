import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/admin-auth"

// Also allow STAFF to delete bookings
function isAdminOrStaff(session: Session | null): boolean {
  if (!session || !session.user) {
    return false
  }
  const userRole = (session.user as { role?: string }).role
  return userRole === "ADMIN" || userRole === "STAFF"
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Only admins and staff can delete bookings
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

    // Delete the booking
    await prisma.booking.delete({
      where: { id: bookingId }
    })

    console.log(`✅ Admin ${(session.user as { email?: string }).email} deleted booking ${bookingId} (User: ${booking.user.email}, Game: ${booking.game.name})`)

    return NextResponse.json({ 
      message: "Booking deleted successfully",
      deletedBooking: {
        id: booking.id,
        user: booking.user.name,
        game: booking.game.name
      }
    })
  } catch (error) {
    console.error("Error deleting booking:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

