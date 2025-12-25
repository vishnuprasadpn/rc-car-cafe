import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            game: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        points: {
          orderBy: {
            createdAt: "desc",
          },
        },
        memberships: {
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
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user detail:", error)
    return NextResponse.json(
      { error: "Failed to fetch user detail" },
      { status: 500 }
    )
  }
}
