import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const points = await prisma.point.findMany({
      where: {
        userId: (session.user as { id: string }).id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = points
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.amount, 0)

    const pending = points
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0)

    const approved = points
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      total,
      pending,
      approved,
      points
    })
  } catch (error) {
    console.error("Error fetching points:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
