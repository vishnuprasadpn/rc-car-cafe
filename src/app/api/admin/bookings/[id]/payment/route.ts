import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string }).role
    if (userRole !== "ADMIN" && userRole !== "STAFF") {
      return NextResponse.json({ message: "Forbidden: Admin or Staff access required" }, { status: 403 })
    }

    const { id: bookingId } = await params
    const body = await request.json()
    const { amount, paymentMethod } = updatePaymentSchema.parse(body)

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

    // Update payment status and amount
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "COMPLETED",
        totalPrice: amount,
        paymentId: paymentMethod ? `MANUAL_${Date.now()}` : undefined,
        notes: paymentMethod ? `Payment received via ${paymentMethod}. Amount: ₹${amount}` : `Payment received. Amount: ₹${amount}`
      }
    })


    return NextResponse.json({ 
      message: "Payment marked as received successfully",
      booking: updatedBooking
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating payment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

