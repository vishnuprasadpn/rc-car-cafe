import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TimerStatus } from "@prisma/client"

// GET - Get all active timers (public endpoint for display)
export async function GET() {
  try {
    const timers = await prisma.timer.findMany({
      where: {
        status: {
          in: ["RUNNING", "PAUSED"]
        }
      },
      include: {
        track: true
      },
      orderBy: [
        { isCombo: "desc" }, // Combo timers first
        { createdAt: "asc" }
      ]
    })

    // Calculate remaining time for each timer
    const now = new Date()
    const timersWithRemaining = timers.map(timer => {
      let remainingSeconds = timer.remainingSeconds

      if (timer.status === "RUNNING" && timer.startTime) {
        // Calculate elapsed time since last start (startTime is reset on each resume)
        const elapsedSeconds = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000)
        remainingSeconds = Math.max(0, timer.remainingSeconds - elapsedSeconds)
      }
      // If PAUSED, remainingSeconds is already the correct value

      return {
        id: timer.id,
        customerName: timer.customerName,
        trackId: timer.trackId,
        track: timer.track,
        allocatedMinutes: timer.allocatedMinutes,
        remainingSeconds,
        remainingMinutes: Math.floor(remainingSeconds / 60),
        remainingSecondsOnly: remainingSeconds % 60,
        status: timer.status,
        isCombo: timer.isCombo,
        startTime: timer.startTime,
        createdAt: timer.createdAt
      }
    })

    return NextResponse.json({ timers: timersWithRemaining })
  } catch (error) {
    console.error("Error fetching timers:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new timer (admin/staff only)
export async function POST(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { customerName, trackId, allocatedMinutes, isCombo } = body

    if (!customerName || !allocatedMinutes) {
      return NextResponse.json(
        { message: "Customer name and allocated minutes are required" },
        { status: 400 }
      )
    }

    if (!isCombo && !trackId) {
      return NextResponse.json(
        { message: "Track ID is required for track-specific timers" },
        { status: 400 }
      )
    }

    if (isCombo && trackId) {
      return NextResponse.json(
        { message: "Combo timers should not have a track ID" },
        { status: 400 }
      )
    }

    // Validate allocated minutes
    const validMinutes = [15, 30, 45, 60, 120]
    if (!validMinutes.includes(allocatedMinutes)) {
      return NextResponse.json(
        { message: "Invalid allocated minutes. Must be 15, 30, 45, 60, or 120" },
        { status: 400 }
      )
    }

    const timer = await prisma.timer.create({
      data: {
        customerName,
        trackId: isCombo ? null : trackId,
        allocatedMinutes,
        remainingSeconds: allocatedMinutes * 60,
        status: TimerStatus.STOPPED,
        isCombo: isCombo || false,
        createdBy: session.user.id,
        createdByName: session.user.name || "Admin"
      },
      include: {
        track: true
      }
    })

    return NextResponse.json({ timer })
  } catch (error) {
    console.error("Error creating timer:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}

