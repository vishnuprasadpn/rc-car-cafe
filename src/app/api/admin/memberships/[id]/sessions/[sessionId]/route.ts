import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateSessionSchema = z.object({
  usedAt: z.string().transform((str) => new Date(str)).optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: membershipId, sessionId } = await params
    const body = await request.json()
    const data = updateSessionSchema.parse(body)

    // Verify the session belongs to this membership
    const membershipSession = await prisma.membershipSession.findFirst({
      where: {
        id: sessionId,
        membershipId: membershipId,
      },
    })

    if (!membershipSession) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    // Update the session
    const updatedSession = await prisma.membershipSession.update({
      where: { id: sessionId },
      data: {
        usedAt: data.usedAt,
        notes: data.notes,
      },
    })

    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error("Error updating session:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id: membershipId, sessionId } = await params

    // Verify the session belongs to this membership
    const membershipSession = await prisma.membershipSession.findFirst({
      where: {
        id: sessionId,
        membershipId: membershipId,
      },
      include: {
        membership: true,
      },
    })

    if (!membershipSession) {
      return NextResponse.json({ message: "Session not found" }, { status: 404 })
    }

    // Delete the session
    await prisma.membershipSession.delete({
      where: { id: sessionId },
    })

    // Update membership: decrement used, increment remaining
    const membership = membershipSession.membership
    const updatedMembership = await prisma.membership.update({
      where: { id: membershipId },
      data: {
        sessionsUsed: { decrement: 1 },
        sessionsRemaining: { increment: 1 },
        // If status was COMPLETED and we're adding a session back, set to ACTIVE
        status: membership.status === "COMPLETED" && membership.sessionsRemaining === 0
          ? "ACTIVE"
          : membership.status,
      },
    })

    // If session was linked to a booking, unlink it
    if (membershipSession.bookingId) {
      await prisma.booking.update({
        where: { id: membershipSession.bookingId },
        data: { membershipSessionId: null },
      })
    }

    return NextResponse.json({ 
      message: "Session deleted successfully",
      membership: updatedMembership,
    })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

