import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  // Payment webhook is disabled
  return NextResponse.json(
    { message: "Payment webhook is currently disabled." },
    { status: 503 }
  )
}
