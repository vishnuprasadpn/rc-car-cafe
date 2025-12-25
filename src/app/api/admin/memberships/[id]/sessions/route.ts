import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const markSessionUsedSchema = z.object({
  bookingId: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: membershipId } = await params
    const body = await request.json()
    const data = markSessionUsedSchema.parse(body)

    // Get membership
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
    })

    if (!membership) {
      return NextResponse.json({ message: "Membership not found" }, { status: 404 })
    }

    // Check if membership is active and has remaining sessions
    if (membership.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Membership is not active" },
        { status: 400 }
      )
    }

    if (membership.sessionsRemaining <= 0) {
      return NextResponse.json(
        { message: "No remaining sessions" },
        { status: 400 }
      )
    }

    // Check if expiry date has passed
    if (membership.expiryDate < new Date()) {
      await prisma.membership.update({
        where: { id: membershipId },
        data: { status: "EXPIRED" },
      })
      return NextResponse.json(
        { message: "Membership has expired" },
        { status: 400 }
      )
    }

    // Get admin/staff info
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    })

    // Create session usage record
    const membershipSession = await prisma.membershipSession.create({
      data: {
        membershipId: membershipId,
        bookingId: data.bookingId || null,
        usedAt: new Date(),
        usedBy: session.user.id,
        usedByName: adminUser?.name || "Admin",
        notes: data.notes || null,
      },
    })

    // Update membership: increment used, decrement remaining
    const updatedMembership = await prisma.membership.update({
      where: { id: membershipId },
      data: {
        sessionsUsed: { increment: 1 },
        sessionsRemaining: { decrement: 1 },
        lastBookedDate: new Date(),
        // Auto-update status if sessions exhausted
        status: membership.sessionsRemaining === 1 ? "COMPLETED" : "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        sessions: {
          orderBy: { usedAt: 'desc' },
          take: 5,
        }
      }
    })

    // If bookingId provided, link it
    if (data.bookingId) {
      await prisma.booking.update({
        where: { id: data.bookingId },
        data: { membershipSessionId: membershipSession.id },
      })
    }

    return NextResponse.json({ 
      membership: updatedMembership,
      session: membershipSession,
    })
  } catch (error) {
    console.error("Error marking session as used:", error)
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

