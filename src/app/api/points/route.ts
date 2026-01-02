import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
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
