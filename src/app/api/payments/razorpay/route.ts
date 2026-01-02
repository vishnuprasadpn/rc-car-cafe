import { NextResponse } from "next/server"

export async function POST() {
  // Payment functionality is disabled
  return NextResponse.json(
    { message: "Payment is currently disabled. Please check back later." },
    { status: 503 }
  )
}
