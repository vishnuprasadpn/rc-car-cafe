import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TimerStatus } from "@prisma/client"

// GET - Get a specific timer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const timer = await prisma.timer.findUnique({
      where: { id },
      include: {
        track: true
      }
    })

    if (!timer) {
      return NextResponse.json({ message: "Timer not found" }, { status: 404 })
    }

    // Calculate remaining time from state transitions (no DB writes)
    const now = new Date()
    let remainingSeconds = 0
    let status = timer.status

    if (timer.status === TimerStatus.COMPLETED) {
      remainingSeconds = 0
    } else if (timer.status === TimerStatus.RUNNING && timer.startTime) {
      // Calculate elapsed time since start
      const elapsedSeconds = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000)
      remainingSeconds = Math.max(0, timer.remainingSeconds - elapsedSeconds)
      
      // If expired, mark as completed (but don't write to DB)
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

    return NextResponse.json({
      ...timer,
      remainingSeconds,
      remainingMinutes: Math.floor(remainingSeconds / 60),
      remainingSecondsOnly: remainingSeconds % 60,
      status
    })
  } catch (error) {
    console.error("Error fetching timer:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update timer (start, pause, reset, add time)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, minutes } = body

    const timer = await prisma.timer.findUnique({
      where: { id }
    })

    if (!timer) {
      return NextResponse.json({ message: "Timer not found" }, { status: 404 })
    }

    const now = new Date()
    let updateData: {
      status?: TimerStatus
      startTime?: Date | null
      pausedAt?: Date | null
      remainingSeconds?: number
      allocatedMinutes?: number
    } = {}

    switch (action) {
      case "start":
        if (timer.status === "RUNNING") {
          return NextResponse.json(
            { message: "Timer is already running" },
            { status: 400 }
          )
        }

        // When starting, ensure remainingSeconds is up to date
        // If resuming from pause, remainingSeconds should already be correct
        // If starting from stopped, remainingSeconds should be the allocated time
        let startRemaining = timer.remainingSeconds
        if (timer.status === TimerStatus.STOPPED) {
          // If starting from stopped, reset to allocated time
          startRemaining = timer.allocatedMinutes * 60
        }

        // Reset startTime to now with accurate remainingSeconds
        updateData = {
          status: TimerStatus.RUNNING,
          startTime: now, // Fresh start time
          pausedAt: null,
          remainingSeconds: startRemaining // Ensure accurate remaining time
        }
        break

      case "pause":
        if (timer.status !== "RUNNING") {
          return NextResponse.json(
            { message: "Timer is not running" },
            { status: 400 }
          )
        }

        if (!timer.startTime) {
          return NextResponse.json(
            { message: "Timer start time is missing" },
            { status: 400 }
          )
        }

        // Calculate elapsed time since start and store remaining time
        // This is the ONLY time we write remainingSeconds (state transition)
        const elapsedSeconds = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000)
        const currentRemaining = Math.max(0, timer.remainingSeconds - elapsedSeconds)
        
        updateData = {
          status: TimerStatus.PAUSED,
          pausedAt: now,
          remainingSeconds: currentRemaining,
          startTime: null // Clear startTime when paused
        }
        break

      case "reset":
        updateData = {
          status: TimerStatus.STOPPED,
          startTime: null,
          pausedAt: null,
          remainingSeconds: timer.allocatedMinutes * 60
        }
        break

      case "add_time":
        if (!minutes || (minutes !== 5 && minutes !== 10)) {
          return NextResponse.json(
            { message: "Invalid minutes. Must be 5 or 10" },
            { status: 400 }
          )
        }

        // Calculate current remaining time from state
        let remaining = timer.remainingSeconds
        if (timer.status === TimerStatus.RUNNING && timer.startTime) {
          // Calculate elapsed since start
          const elapsed = Math.floor((now.getTime() - timer.startTime.getTime()) / 1000)
          remaining = Math.max(0, timer.remainingSeconds - elapsed)
          // Update startTime to now to account for added time
          updateData = {
            remainingSeconds: remaining + (minutes * 60),
            allocatedMinutes: timer.allocatedMinutes + minutes,
            startTime: now // Reset start time to account for added time
          }
        } else {
          // If PAUSED or STOPPED, just add to remaining
          updateData = {
            remainingSeconds: remaining + (minutes * 60),
            allocatedMinutes: timer.allocatedMinutes + minutes
          }
        }
        break

      case "stop":
        updateData = {
          status: TimerStatus.COMPLETED
        }
        break

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        )
    }

    const updatedTimer = await prisma.timer.update({
      where: { id },
      data: updateData,
      include: {
        track: true
      }
    })

    return NextResponse.json({ timer: updatedTimer })
  } catch (error) {
    console.error("Error updating timer:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a timer (permanently removes from database)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    // Check if timer exists before attempting to delete
    const timer = await prisma.timer.findUnique({
      where: { id }
    })

    if (!timer) {
      return NextResponse.json({ message: "Timer not found" }, { status: 404 })
    }

    // Permanently delete the timer from database
    await prisma.timer.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Timer deleted successfully" })
  } catch (error: unknown) {
    console.error("Error deleting timer:", error)
    
    // Handle Prisma not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { message: "Timer not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

