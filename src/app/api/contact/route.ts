import { NextRequest, NextResponse } from "next/server"
import { sendContactFormEmail } from "@/lib/email"
import { z } from "zod"

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactFormSchema.parse(body)

    // Send email
    await sendContactFormEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })

    return NextResponse.json(
      { message: "Thank you for your message! We'll get back to you soon." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending contact form email:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    // Check if it's an SMTP configuration error
    if (error instanceof Error && error.message.includes('not configured')) {
      return NextResponse.json(
        { message: "Email service is temporarily unavailable. Please contact us directly at furyroadrcclub@gmail.com" },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { message: "Failed to send message. Please try again later or contact us directly at furyroadrcclub@gmail.com" },
      { status: 500 }
    )
  }
}

