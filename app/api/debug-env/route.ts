import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Only check for existence, don't expose the actual values
  return NextResponse.json({
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID || "NOT SET",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "NOT SET",
    privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
  });
}

