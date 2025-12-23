import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format").optional(),
  role: z.enum(["CUSTOMER", "STAFF", "ADMIN"]).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    // Only admins can edit users
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updateData = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent editing the authorized admin's email or role
    if (existingUser.email.toLowerCase() === "vishnuprasad1990@gmail.com") {
      if (updateData.email && updateData.email.toLowerCase() !== existingUser.email.toLowerCase()) {
        return NextResponse.json(
          { message: "Cannot change email of the authorized admin account" },
          { status: 400 }
        )
      }
      if (updateData.role && updateData.role !== "ADMIN") {
        return NextResponse.json(
          { message: "Cannot change role of the authorized admin account" },
          { status: 400 }
        )
      }
    }

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email.toLowerCase() !== existingUser.email.toLowerCase()) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: updateData.email.toLowerCase() }
      })
      if (emailTaken) {
        return NextResponse.json(
          { message: "Email is already taken by another user" },
          { status: 400 }
        )
      }
    }

    // Build update data object
    const data: {
      name?: string
      email?: string
      phone?: string | null
      role?: "CUSTOMER" | "STAFF" | "ADMIN"
    } = {}

    if (updateData.name !== undefined) {
      data.name = updateData.name
    }
    if (updateData.email !== undefined) {
      data.email = updateData.email.toLowerCase()
    }
    if (updateData.phone !== undefined) {
      data.phone = updateData.phone || null
    }
    if (updateData.role !== undefined) {
      data.role = updateData.role
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ user })
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
    
    // Only admins can delete users
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can delete users" },
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

