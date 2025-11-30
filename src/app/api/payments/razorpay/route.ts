import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  // Payment functionality is disabled
  return NextResponse.json(
    { message: "Payment is currently disabled. Please check back later." },
    { status: 503 }
  )
}
