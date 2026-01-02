import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Get all tracks (public endpoint)
export async function GET() {
  try {
    const tracks = await prisma.track.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json({ tracks })
  } catch (error) {
    console.error("Error fetching tracks:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

