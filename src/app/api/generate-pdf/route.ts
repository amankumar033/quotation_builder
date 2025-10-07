import { NextRequest, NextResponse } from "next/server";

// Placeholder route to satisfy Next.js module validation during build.
// Keep behavior unchanged: this endpoint was not wired in the app yet.
export async function POST(_req: NextRequest) {
  return NextResponse.json({ success: false, error: "PDF generation not implemented" }, { status: 501 });
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Generate PDF endpoint is reachable" });
}