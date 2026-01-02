import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
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
            usedAt: "desc",
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
        m.sessionsUsed < m.sessionsTotal &&
        m.expiryDate > now
    )

    return NextResponse.json({
      memberships,
      activeMembership,
      remainingSessions: activeMembership
        ? activeMembership.sessionsTotal - activeMembership.sessionsUsed
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

