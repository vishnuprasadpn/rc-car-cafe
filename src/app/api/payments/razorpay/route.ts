import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createRazorpayOrder } from "@/lib/razorpay"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrderSchema = z.object({
  bookingId: z.string(),
  amount: z.number().min(1),
})

export async function POST(request: NextRequest) {
  // Payment functionality is disabled
  return NextResponse.json(
    { message: "Payment is currently disabled. Please check back later." },
    { status: 503 }
  )

  // Disabled code below
  /*try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, amount } = createOrderSchema.parse(body)

    // Verify booking belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: "PENDING"
      }
    })

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(amount)

    // Update booking with payment order ID
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentId: order.id }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
  */
}
