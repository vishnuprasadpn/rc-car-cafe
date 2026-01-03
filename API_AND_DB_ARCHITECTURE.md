# API Calls and Database Architecture

This document explains how API calls are made and how database data is fetched in the FuryRoad RC Club application.

## Architecture Overview

The application uses:
- **Next.js App Router** for API routes (server-side)
- **Prisma ORM** for database queries
- **Native Fetch API** for client-side API calls
- **NextAuth.js** for authentication

---

## 1. Database Layer (Prisma)

### Prisma Client Setup

The Prisma client is initialized as a singleton to prevent connection pool exhaustion:

**File: `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Singleton pattern: reuse existing instance or create new one
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
```

**Key Points:**
- Uses singleton pattern to prevent multiple PrismaClient instances
- Important for serverless environments (Vercel, Railway)
- Prevents database connection pool exhaustion

### Database Schema

**File: `prisma/schema.prisma`**

The schema defines all database models. Example:

```prisma
model Timer {
  id              String      @id @default(cuid())
  customerName    String
  trackId         String?
  allocatedMinutes Int
  remainingSeconds Int
  status          TimerStatus
  // ... other fields
  
  track           Track?      @relation(fields: [trackId], references: [id])
}
```

---

## 2. API Routes (Server-Side)

### API Route Structure

API routes are located in `src/app/api/**/route.ts` and use Next.js App Router conventions.

**Example: `src/app/api/timers/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch data
export async function GET(request: NextRequest) {
  try {
    // 1. Authentication check (if needed)
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 2. Query database using Prisma
    const timers = await prisma.timer.findMany({
      where: { status: "RUNNING" },
      include: { track: true },
      orderBy: { createdAt: "asc" }
    })

    // 3. Process/transform data if needed
    const processedTimers = timers.map(timer => ({
      ...timer,
      remainingMinutes: Math.floor(timer.remainingSeconds / 60)
    }))

    // 4. Return JSON response
    return NextResponse.json({ timers: processedTimers })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create data
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { customerName, allocatedMinutes, trackId } = body

    // 3. Validate input
    if (!customerName || !allocatedMinutes) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // 4. Create in database
    const timer = await prisma.timer.create({
      data: {
        customerName,
        allocatedMinutes,
        remainingSeconds: allocatedMinutes * 60,
        trackId,
        status: "STOPPED"
      },
      include: { track: true }
    })

    // 5. Return created resource
    return NextResponse.json({ timer }, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Dynamic Routes

For routes with parameters (e.g., `/api/timers/[id]`):

**File: `src/app/api/timers/[id]/route.ts`**

```typescript
// GET - Get single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  const timer = await prisma.timer.findUnique({
    where: { id },
    include: { track: true }
  })

  if (!timer) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ timer })
}

// PATCH - Update resource
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { action } = body

  const timer = await prisma.timer.update({
    where: { id },
    data: { status: "RUNNING" }
  })

  return NextResponse.json({ timer })
}

// DELETE - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  await prisma.timer.delete({
    where: { id }
  })

  return NextResponse.json({ message: "Deleted" }, { status: 200 })
}
```

### Common Prisma Query Patterns

```typescript
// Find all with filters
const games = await prisma.game.findMany({
  where: { isActive: true },
  orderBy: { name: 'asc' }
})

// Find one
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// Create
const timer = await prisma.timer.create({
  data: { customerName: "John", allocatedMinutes: 30 }
})

// Update
const updated = await prisma.timer.update({
  where: { id },
  data: { status: "RUNNING" }
})

// Delete
await prisma.timer.delete({
  where: { id }
})

// Include relations
const timer = await prisma.timer.findUnique({
  where: { id },
  include: { track: true }  // Include related Track
})
```

---

## 3. Frontend API Calls (Client-Side)

### Basic Fetch Pattern

**File: `src/app/dashboard/page.tsx`**

```typescript
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchData()
    }
  }, [status])

  const fetchData = async () => {
    try {
      // 1. Make API call
      const response = await fetch("/api/bookings")
      
      // 2. Check if response is OK
      if (response.ok) {
        // 3. Parse JSON
        const data = await response.json()
        // 4. Update state
        setBookings(data.bookings || [])
      } else {
        // Handle error
        const errorData = await response.json()
        console.error("Error:", errorData.message)
      }
    } catch (error) {
      console.error("Network error:", error)
    } finally {
      setLoading(false)
    }
  }

  return <div>{/* Render data */}</div>
}
```

### POST Request Pattern

**File: `src/app/admin/timer/page.tsx`**

```typescript
const handleCreateTimer = async (e: React.FormEvent) => {
  e.preventDefault()
  setSubmitting(true)
  setError("")

  try {
    // 1. Make POST request with body
    const response = await fetch("/api/timers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: formData.customerName,
        trackId: formData.trackId,
        allocatedMinutes: parseInt(formData.allocatedMinutes),
        isCombo: formData.isCombo
      })
    })

    // 2. Parse response
    const data = await response.json()

    // 3. Handle success/error
    if (response.ok) {
      // Success - refresh data
      await fetchTimers()
      // Reset form
      setFormData({ customerName: "", trackId: "", allocatedMinutes: "", isCombo: false })
      setIsFormOpen(false)
    } else {
      // Error
      setError(data.message || "Failed to create timer")
    }
  } catch (err) {
    setError("Network error. Please try again.")
  } finally {
    setSubmitting(false)
  }
}
```

### PATCH Request Pattern

```typescript
const handleTimerAction = async (timerId: string, action: string) => {
  try {
    const response = await fetch(`/api/timers/${timerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action })  // e.g., { action: "start" }
    })

    if (response.ok) {
      await fetchTimers()  // Refresh data
    } else {
      const errorData = await response.json()
      setError(errorData.message)
    }
  } catch (err) {
    setError("Network error")
  }
}
```

### DELETE Request Pattern

```typescript
const handleDelete = async (timerId: string) => {
  if (!confirm("Are you sure?")) return

  try {
    const response = await fetch(`/api/timers/${timerId}`, {
      method: "DELETE"
    })

    if (response.ok) {
      await fetchTimers()  // Refresh data
    } else {
      const errorData = await response.json()
      setError(errorData.message)
    }
  } catch (err) {
    setError("Network error")
  }
}
```

### Multiple Parallel Requests

```typescript
const fetchDashboardData = async () => {
  try {
    // Fetch multiple endpoints in parallel
    const [bookingsRes, pointsRes] = await Promise.all([
      fetch("/api/bookings"),
      fetch("/api/points")
    ])

    if (bookingsRes.ok) {
      const bookingsData = await bookingsRes.json()
      setBookings(bookingsData.bookings || [])
    }

    if (pointsRes.ok) {
      const pointsData = await pointsRes.json()
      setPoints(pointsData)
    }
  } catch (error) {
    console.error("Error:", error)
  }
}
```

### Polling Pattern (Real-time Updates)

**File: `src/app/timer-display/page.tsx`**

```typescript
useEffect(() => {
  if (status === "authenticated") {
    // Initial fetch
    fetchTimers()

    // Poll every 2 seconds for updates
    const interval = setInterval(() => {
      fetchTimers()
    }, 2000)

    return () => clearInterval(interval)
  }
}, [status])
```

---

## 4. Authentication in API Routes

### Server-Side Session Check

```typescript
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Get session
  const session = await getServerSession(authOptions)
  
  // Check authentication
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Check role
  const userRole = (session.user as { role?: string }).role
  if (userRole !== "ADMIN" && userRole !== "STAFF") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  // Proceed with authorized request
  // ...
}
```

### Client-Side Session Check

```typescript
"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  // Render protected content
  return <div>Protected Content</div>
}
```

---

## 5. Error Handling Patterns

### API Route Error Handling

```typescript
export async function GET(request: NextRequest) {
  try {
    // Database query
    const data = await prisma.timer.findMany()
    return NextResponse.json({ data })
  } catch (error) {
    // Log error
    console.error("Error fetching timers:", error)
    
    // Return user-friendly error
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Client-Side Error Handling

```typescript
const fetchData = async () => {
  try {
    const response = await fetch("/api/timers")
    
    if (!response.ok) {
      const errorData = await response.json()
      setError(errorData.message || "Failed to fetch data")
      return
    }

    const data = await response.json()
    setTimers(data.timers)
  } catch (error) {
    // Network error or JSON parse error
    setError("Network error. Please try again.")
    console.error("Error:", error)
  }
}
```

---

## 6. Query Parameters

### Reading Query Params in API Routes

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const showAll = searchParams.get('all') === 'true'
  const status = searchParams.get('status')

  const timers = await prisma.timer.findMany({
    where: showAll ? {} : { status: "RUNNING" }
  })

  return NextResponse.json({ timers })
}
```

### Using Query Params in Frontend

```typescript
// Fetch with query params
const response = await fetch("/api/timers?all=true&status=RUNNING")
```

---

## Summary

1. **Database Layer**: Prisma ORM with singleton pattern
2. **API Routes**: Next.js App Router (`/api/**/route.ts`)
3. **Frontend Calls**: Native `fetch()` API
4. **Authentication**: NextAuth.js with server-side session checks
5. **Error Handling**: Try-catch blocks with user-friendly messages
6. **Real-time Updates**: Polling with `setInterval`

This architecture provides:
- ✅ Type-safe database queries (Prisma)
- ✅ Server-side authentication
- ✅ RESTful API structure
- ✅ Error resilience
- ✅ Real-time data updates

