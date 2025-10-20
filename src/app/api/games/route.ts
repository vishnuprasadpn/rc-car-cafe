import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const games = await prisma.game.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ games })
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, duration, price, maxPlayers } = await request.json()

    const game = await prisma.game.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        maxPlayers: parseInt(maxPlayers)
      }
    })

    return NextResponse.json({ game }, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
