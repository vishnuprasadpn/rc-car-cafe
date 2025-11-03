import { NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhook } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  // Payment webhook is disabled
  return NextResponse.json(
    { message: "Payment webhook is currently disabled." },
    { status: 503 }
  )

  // Disabled code below
  /*try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    const event = verifyStripeWebhook(body, signature)

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      
      // Find booking by payment ID
      const booking = await prisma.booking.findFirst({
        where: { paymentId: paymentIntent.id }
      })

      if (booking) {
        // Update booking status
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "CONFIRMED",
            paymentStatus: "COMPLETED"
          }
        })

        // TODO: Send confirmation email
        // await sendBookingConfirmationEmail(booking)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { message: "Webhook error" },
      { status: 400 }
    )
  }
  */
}
