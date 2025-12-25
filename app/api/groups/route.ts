import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const GROUPS_COLLECTION = "groups";

export async function GET() {
  if (!db) {
    return NextResponse.json({ groups: [] }, { status: 200 });
  }

  const snapshot = await db.collection(GROUPS_COLLECTION).get();
  const groups = snapshot.docs.map((doc) => doc.id);
  return NextResponse.json(
    { groups },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    }
  );
}


