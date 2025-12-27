import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const membershipStatus = searchParams.get('membershipStatus')

    const whereClause: {
      role?: 'ADMIN' | 'STAFF' | 'CUSTOMER'
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
      }>
    } = {}

    if (role === 'ADMIN') {
      // If explicitly requesting ADMIN users, show them
      whereClause.role = 'ADMIN'
    } else if (role === 'STAFF') {
      // If explicitly requesting STAFF users, show them
      whereClause.role = 'STAFF'
    } else {
      // Exclude ADMIN and STAFF users by default (only show CUSTOMER)
      whereClause.role = 'CUSTOMER'
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        authMethod: true,
        memberships: {
          where: {
            status: "ACTIVE"
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            status: true,
            planType: true,
            startDate: true,
            expiryDate: true,
            sessionsRemaining: true,
          }
        },
        _count: {
          select: {
            bookings: true,
            points: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by membership status if provided
    let filteredUsers = users
    if (membershipStatus === "ACTIVE") {
      filteredUsers = users.filter(user => user.memberships.length > 0)
    } else if (membershipStatus === "NONE") {
      filteredUsers = users.filter(user => user.memberships.length === 0)
    }

    // Format the response to include counts and membership
    const formattedUsers = filteredUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      authMethod: user.authMethod,
      bookingsCount: user._count.bookings,
      pointsCount: user._count.points,
      membership: user.memberships[0] || null
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "STAFF"]),
})

export async function POST(request: NextRequest) {
  try {
    // @ts-expect-error - getServerSession accepts authOptions but types don't match NextAuth v4
    const session = await getServerSession(authOptions) as Session | null
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userEmail = (session.user as { email?: string }).email
    const isMasterAdmin = userEmail?.toLowerCase() === "vishnuprasad1990@gmail.com"

    if (!isMasterAdmin) {
      return NextResponse.json(
        { message: "Only the master admin can create new admins" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, phone, password, role } = createAdminSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin/staff user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role: role as "ADMIN" | "STAFF",
        authMethod: "email",
      },
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

    return NextResponse.json(
      { message: `${role} created successfully`, user: newUser },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating admin:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

