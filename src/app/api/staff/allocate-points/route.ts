import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null

    if (!session || !session.user || (session.user as { role?: string }).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, points, reason, allocatedBy } = await request.json()

    if (!userId || !points || !reason || !allocatedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (points < 1 || points > 1000) {
      return NextResponse.json({ error: "Points must be between 1 and 1000" }, { status: 400 })
    }

    // Verify the user exists and is a customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    })

    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json({ error: "Invalid customer" }, { status: 400 })
    }

    // Create the point allocation
    const pointAllocation = await prisma.point.create({
      data: {
        userId: userId,
        amount: points,
        reason: reason,
        status: "APPROVED", // Staff allocations are auto-approved
        approvedBy: (session.user as { id: string }).id,
        approvedAt: new Date()
      }
    })

    // Create staff action record
    await prisma.staffAction.create({
      data: {
        staffId: allocatedBy,
        action: "POINTS_ALLOCATED",
        description: `Allocated ${points} points to customer for: ${reason}`,
        metadata: {
          customerId: userId,
          points: points,
          reason: reason
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      pointAllocation,
      message: "Points allocated successfully" 
    })
  } catch (error) {
    console.error("Error allocating points:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
