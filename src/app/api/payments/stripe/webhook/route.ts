import { NextResponse } from "next/server"

export async function POST() {
  // Payment webhook is disabled
  return NextResponse.json(
    { message: "Payment webhook is currently disabled." },
    { status: 503 }
  )
}
