import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAuthorizedDeleteAdmin } from "@/lib/admin-auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    // Only authorized admin can delete users
    if (!isAuthorizedDeleteAdmin(session)) {
      return NextResponse.json(
        { message: "Unauthorized: Only the authorized admin can delete users" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true,
            points: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deleting the authorized admin
    if (user.email.toLowerCase() === "vishnuprasad1990@gmail.com") {
      return NextResponse.json(
        { message: "Cannot delete the authorized admin account" },
        { status: 400 }
      )
    }

    // Check if user has bookings or points
    if (user._count.bookings > 0 || user._count.points > 0) {
      return NextResponse.json(
        { 
          message: `Cannot delete user with existing data. User has ${user._count.bookings} bookings and ${user._count.points} points.` 
        },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

