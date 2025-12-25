import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { MembershipStatus } from "@prisma/client"

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

    const membership = await prisma.membership.findUnique({
      where: { id },
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
      }
    })

    if (!membership) {
      return NextResponse.json({ message: "Membership not found" }, { status: 404 })
    }

    return NextResponse.json({ membership })
  } catch (error) {
    console.error("Error fetching membership:", error)
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

    // Check if membership exists
    const existing = await prisma.membership.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: "Membership not found" }, { status: 404 })
    }

    // Auto-update status based on expiry or sessions
    const now = new Date()
    let status = existing.status
    if (status === "ACTIVE") {
      if (existing.expiryDate < now || existing.sessionsRemaining <= 0) {
        status = existing.sessionsRemaining <= 0 ? "COMPLETED" : "EXPIRED"
      }
    }

    const updateData: { status?: MembershipStatus; startDate?: Date; expiryDate?: Date } = {}
    if (body.status) updateData.status = body.status as MembershipStatus
    if (body.startDate) {
      updateData.startDate = new Date(body.startDate)
      // Recalculate expiry date
      const expiryDate = new Date(body.startDate)
      expiryDate.setMonth(expiryDate.getMonth() + 1)
      updateData.expiryDate = expiryDate
    }

    // Use calculated status if not explicitly provided
    if (!body.status && status !== existing.status) {
      updateData.status = status as MembershipStatus
    }

    const membership = await prisma.membership.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ membership })
  } catch (error) {
    console.error("Error updating membership:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
