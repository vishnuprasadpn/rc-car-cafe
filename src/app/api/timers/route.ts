import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TimerStatus } from "@prisma/client"

// GET - Get all active timers (public endpoint for display)
// Query param ?all=true returns all timers including STOPPED (admin/staff only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'
    
    // If requesting all timers, check authentication
    if (showAll) {
      // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
      const session = await getServerSession(authOptions) as Session | null
      const userRole = session?.user ? (session.user as { role?: string }).role : null
      if (!session || !session.user || (userRole !== "STAFF" && userRole !== "ADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      }
    }

    let timers
    try {
      timers = await prisma.timer.findMany({
        where: {}, // Get all timers regardless of status
        include: {
          track: true
        },
        orderBy: [
          { isCombo: "desc" }, // Combo timers first
          { createdAt: "asc" }
        ]
      })
    } catch (dbError) {
      console.error("Error fetching timers from database:", dbError)
      return NextResponse.json(
        { message: "Failed to fetch timers from database" },
        { status: 500 }
      )
    }

    // Calculate remaining time from state transitions only (no DB writes)
    const now = new Date()
    const timersWithRemaining = timers.map((timer) => {
      try {
        let remainingSeconds = 0
        let status = timer.status

        // Calculate remaining time based on state transitions
        if (timer.status === TimerStatus.COMPLETED) {
          remainingSeconds = 0
        } else if (timer.status === TimerStatus.RUNNING && timer.startTime) {
          // Calculate elapsed time since start
          const elapsedSeconds = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000)
          // remainingSeconds was set when timer started/resumed - use it as base
          remainingSeconds = Math.max(0, timer.remainingSeconds - elapsedSeconds)
          
          // If expired, mark as completed (but don't write to DB - let client handle it)
          if (remainingSeconds <= 0) {
            status = TimerStatus.COMPLETED
            remainingSeconds = 0
          }
        } else if (timer.status === TimerStatus.PAUSED) {
          // For PAUSED timers, remainingSeconds was set when paused
          remainingSeconds = timer.remainingSeconds
        } else {
          // For STOPPED timers, use allocated time
          remainingSeconds = timer.allocatedMinutes * 60
        }

        return {
          id: timer.id,
          customerName: timer.customerName,
          trackId: timer.trackId,
          track: timer.track,
          allocatedMinutes: timer.allocatedMinutes,
          remainingSeconds,
          remainingMinutes: Math.floor(remainingSeconds / 60),
          remainingSecondsOnly: remainingSeconds % 60,
          status,
          isCombo: timer.isCombo,
          startTime: timer.startTime,
          pausedAt: timer.pausedAt,
          createdAt: timer.createdAt
        }
      } catch (timerError) {
        // If processing fails, return safe default
        console.error(`Error processing timer ${timer.id}:`, timerError)
        return {
          id: timer.id,
          customerName: timer.customerName || "Unknown",
          trackId: timer.trackId,
          track: timer.track,
          allocatedMinutes: timer.allocatedMinutes || 0,
          remainingSeconds: 0,
          remainingMinutes: 0,
          remainingSecondsOnly: 0,
          status: timer.status || TimerStatus.STOPPED,
          isCombo: timer.isCombo || false,
          startTime: timer.startTime,
          pausedAt: timer.pausedAt,
          createdAt: timer.createdAt
        }
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

