import { NextResponse } from "next/server"
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

    const userId = session.user.id

    // Get active membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
      include: {
        sessions: {
          orderBy: { usedAt: 'desc' },
          include: {
            booking: {
              include: {
                game: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          }
        },
        transactions: {
          orderBy: { transactionDate: 'desc' },
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Check if membership is still valid (not expired and has sessions)
    if (membership) {
      const now = new Date()
      if (membership.expiryDate < now || membership.sessionsRemaining <= 0) {
        // Auto-update status
        const newStatus = membership.sessionsRemaining <= 0 ? "COMPLETED" : "EXPIRED"
        await prisma.membership.update({
          where: { id: membership.id },
          data: { status: newStatus },
        })
        return NextResponse.json({ membership: null })
      }
    }

    return NextResponse.json({ membership })
  } catch (error) {
    console.error("Error fetching user membership:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

