import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  // Payment verification is disabled
  return NextResponse.json(
    { message: "Payment verification is currently disabled. Please check back later." },
    { status: 503 }
  )
}
