import { NextRequest, NextResponse } from "next/server";
import { db, type MemberRecord } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const GROUPS_COLLECTION = "groups";

export async function GET(req: NextRequest) {
  if (!db) {
    return NextResponse.json({ members: [] }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("group");

  if (!groupId) {
    return NextResponse.json({ members: [] }, { status: 400 });
  }

  const doc = await db.collection(GROUPS_COLLECTION).doc(groupId).get();
  if (!doc.exists) {
    return NextResponse.json({ members: [] }, { status: 200 });
  }

  const data = doc.data() as { members?: Record<string, MemberRecord> };
  if (!data.members) {
    return NextResponse.json({ members: [] }, { status: 200 });
  }

  const members = Object.keys(data.members);

  return NextResponse.json(
    { members },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    }
  );
}


