import { NextRequest, NextResponse } from "next/server"
import { verifyRazorpayPayment } from "@/lib/razorpay"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
  bookingId: z.string(),
})

export async function POST(request: NextRequest) {
  // Payment verification is disabled
  return NextResponse.json(
    { message: "Payment verification is currently disabled. Please check back later." },
    { status: 503 }
  )

  // Disabled code below
  /*try {
    const body = await request.json()
    const { orderId, paymentId, signature, bookingId } = verifyPaymentSchema.parse(body)

    // Verify payment signature
    const isValid = await verifyRazorpayPayment(orderId, paymentId, signature)

    if (!isValid) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 })
    }

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "COMPLETED",
        paymentId: paymentId
      },
      include: {
        user: true,
        game: true
      }
    })

    // TODO: Send confirmation email
    // await sendBookingConfirmationEmail(booking)

    return NextResponse.json({ 
      success: true, 
      booking,
      message: "Payment verified and booking confirmed" 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
  */
}
