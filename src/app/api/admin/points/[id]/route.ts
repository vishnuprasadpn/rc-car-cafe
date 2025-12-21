import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAuthorizedDeleteAdmin } from "@/lib/admin-auth"
import { z } from "zod"

const updatePointSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  amount: z.number().int().positive().optional(),
  reason: z.string().min(1).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updateData = updatePointSchema.parse(body)

    // Build update data object
    const data: {
      amount?: number
      reason?: string
      status?: "PENDING" | "APPROVED" | "REJECTED"
      approvedBy?: string
      approvedAt?: Date
    } = {}

    if (updateData.amount !== undefined) {
      data.amount = updateData.amount
    }
    if (updateData.reason !== undefined) {
      data.reason = updateData.reason
    }
    if (updateData.status !== undefined) {
      data.status = updateData.status
      // Set approvedBy and approvedAt if status is being changed to APPROVED
      if (updateData.status === "APPROVED") {
        data.approvedBy = (session.user as { id: string }).id
        data.approvedAt = new Date()
      } else {
        // Clear approval fields if status is changed away from APPROVED
        data.approvedBy = null
        data.approvedAt = null
      }
    }

    const point = await prisma.point.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ point })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating point:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    // Only authorized admin can delete points
    if (!isAuthorizedDeleteAdmin(session)) {
      return NextResponse.json(
        { message: "Unauthorized: Only the authorized admin can delete points" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if point exists
    const point = await prisma.point.findUnique({
      where: { id }
    })

    if (!point) {
      return NextResponse.json({ message: "Point not found" }, { status: 404 })
    }

    // Delete the point
    await prisma.point.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Point deleted successfully" })
  } catch (error) {
    console.error("Error deleting point:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
