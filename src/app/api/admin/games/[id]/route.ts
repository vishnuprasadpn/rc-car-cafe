import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateGameSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  maxPlayers: z.number().min(1).max(4, "Max players must be between 1 and 4").optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const game = await prisma.game.findUnique({
      where: { id }
    })

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 })
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updateData = updateGameSchema.parse(body)

    const game = await prisma.game.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ game })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating game:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updateData = updateGameSchema.parse(body)

    const game = await prisma.game.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ game })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating game:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    // Check if game has any bookings
    const bookingsCount = await prisma.booking.count({
      where: { gameId: id }
    })

    if (bookingsCount > 0) {
      return NextResponse.json(
        { message: "Cannot delete game with existing bookings" },
        { status: 400 }
      )
    }

    await prisma.game.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Game deleted successfully" })
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
