import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memberships = await prisma.membership.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        sessions: {
          orderBy: {
            usedDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate active membership
    const now = new Date()
    const activeMembership = memberships.find(
      (m) =>
        m.status === "ACTIVE" &&
        m.usedSessions < m.totalSessions &&
        m.expiryDate > now
    )

    return NextResponse.json({
      memberships,
      activeMembership,
      remainingSessions: activeMembership
        ? activeMembership.totalSessions - activeMembership.usedSessions
        : 0,
    })
  } catch (error) {
    console.error("Error fetching user memberships:", error)
    return NextResponse.json(
      { error: "Failed to fetch memberships" },
      { status: 500 }
    )
  }
}

