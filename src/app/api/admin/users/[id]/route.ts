import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { AUTHORIZED_DELETE_ADMIN_EMAIL } from "@/lib/admin-auth"

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

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string }).role
    const userEmail = (session.user as { email?: string }).email
    const userId = (session.user as { id?: string }).id

    const { id } = await params
    const body = await request.json()
    const updateData = updateUserSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // If updating password, only allow if:
    // 1. User is updating their own password, OR
    // 2. Master admin (vishnuprasad1990@gmail.com) is updating any admin/staff password
    if (updateData.password) {
      const isUpdatingOwnPassword = userId === id
      const isMasterAdmin = userEmail?.toLowerCase() === "vishnuprasad1990@gmail.com"
      const isAdminOrStaff = user.role === "ADMIN" || user.role === "STAFF"

      if (!isUpdatingOwnPassword && (!isMasterAdmin || !isAdminOrStaff)) {
        return NextResponse.json(
          { message: "You can only update your own password, or master admin can update admin/staff passwords" },
          { status: 403 }
        )
      }
    }

    // For other fields, only allow if:
    // 1. User is updating their own details, OR
    // 2. Master admin is updating any admin/staff details
    const isUpdatingOwnDetails = userId === id
    const isMasterAdmin = userEmail?.toLowerCase() === "vishnuprasad1990@gmail.com"
    const isAdminOrStaff = user.role === "ADMIN" || user.role === "STAFF"

    if (!isUpdatingOwnDetails && (!isMasterAdmin || !isAdminOrStaff)) {
      return NextResponse.json(
        { message: "You can only update your own details, or master admin can update admin/staff details" },
        { status: 403 }
      )
    }

    // Build update data
    const data: {
      name?: string
      email?: string
      phone?: string | null
      password?: string
    } = {}

    if (updateData.name !== undefined) {
      data.name = updateData.name
    }
    if (updateData.email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email },
      })
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { message: "Email is already taken by another user" },
          { status: 400 }
        )
      }
      data.email = updateData.email
    }
    if (updateData.phone !== undefined) {
      data.phone = updateData.phone || null
    }
    if (updateData.password !== undefined) {
      // Hash the password
      data.password = await bcrypt.hash(updateData.password, 12)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        authMethod: true,
      },
    })

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating user:", error)
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
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as { role?: string }).role
    const userEmail = (session.user as { email?: string }).email

    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          select: { id: true },
        },
        points: {
          select: { id: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deleting the authorized admin
    if (user.email.toLowerCase() === AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { message: "Cannot delete the authorized admin account" },
        { status: 403 }
      )
    }

    // Prevent deleting users with bookings or points
    if (user.bookings.length > 0 || user.points.length > 0) {
      return NextResponse.json(
        { 
          message: `Cannot delete user: User has ${user.bookings.length} booking(s) and ${user.points.length} point(s)` 
        },
        { status: 400 }
      )
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ 
      message: "User deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
