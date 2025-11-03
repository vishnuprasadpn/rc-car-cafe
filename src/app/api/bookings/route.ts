import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createBookingSchema = z.object({
  gameId: z.string(),
  startTime: z.string(),
  players: z.number().min(1).max(4),
})

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id
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
  // Booking functionality is disabled
  return NextResponse.json(
    { message: "Booking is currently disabled. Please check back later." },
    { status: 503 }
  )

  // Disabled code below
  /*try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { gameId, startTime, players } = createBookingSchema.parse(body)

    // Get game details
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 })
    }

    const start = new Date(startTime)
    const end = new Date(start.getTime() + game.duration * 60 * 1000)
    const totalPrice = game.price * players

    // Check for conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          {
            startTime: {
              lt: end
            },
            endTime: {
              gt: start
            }
          }
        ],
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { message: "Time slot is not available" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        gameId,
        startTime: start,
        endTime: end,
        duration: game.duration,
        players,
        totalPrice
      },
      include: {
        game: true
      }
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating booking:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
  */
}
