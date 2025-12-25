import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createMembershipSchema = z.object({
  userId: z.string().min(1),
  planType: z.enum(["RC_TRACK", "PS5_GAMER_DUO"]),
  startDate: z.string().transform((str) => new Date(str)),
  sessionsTotal: z.number().int().positive().default(16),
  paymentMethod: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    const whereClause: { status?: string; userId?: string } = {}
    if (status) whereClause.status = status
    if (userId) whereClause.userId = userId

    const memberships = await prisma.membership.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          }
        },
        sessions: {
          orderBy: { usedAt: 'desc' },
          take: 1, // Get last used session
        },
        transactions: {
          orderBy: { transactionDate: 'desc' },
        },
        _count: {
          select: {
            sessions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ memberships })
  } catch (error) {
    console.error("Error fetching memberships:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createMembershipSchema.parse(body)

    // Calculate expiry date (start date + 1 month)
    const expiryDate = new Date(data.startDate)
    expiryDate.setMonth(expiryDate.getMonth() + 1)

    const membership = await prisma.membership.create({
      data: {
        userId: data.userId,
        planType: data.planType,
        startDate: data.startDate,
        expiryDate: expiryDate,
        sessionsTotal: data.sessionsTotal,
        sessionsRemaining: data.sessionsTotal,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Create transaction record
    const amount = data.planType === "RC_TRACK" ? 6999 : 3499
    await prisma.membershipTransaction.create({
      data: {
        membershipId: membership.id,
        amount: amount,
        status: "COMPLETED",
        paymentMethod: data.paymentMethod || null,
        transactionDate: new Date(),
      }
    })

    return NextResponse.json({ membership }, { status: 201 })
  } catch (error) {
    console.error("Error creating membership:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
