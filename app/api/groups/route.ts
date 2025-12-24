import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

const GROUPS_COLLECTION = "groups";

export async function GET() {
  if (!db) {
    return NextResponse.json({ groups: [] }, { status: 200 });
  }

  const snapshot = await db.collection(GROUPS_COLLECTION).get();
  const groups = snapshot.docs.map((doc) => doc.id);
  return NextResponse.json({ groups });
}


