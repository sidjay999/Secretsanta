import { NextRequest, NextResponse } from "next/server";
import { db, type MemberRecord } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const GROUPS_COLLECTION = "groups";

export async function POST(req: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { ok: false, message: "Service is not configured." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);

  const groupId = body?.groupId?.toString() ?? "";
  const name = body?.name?.toString() ?? "";
  const code = body?.code?.toString() ?? "";

  if (!groupId || !name || !code) {
    return NextResponse.json(
      { ok: false, message: "Missing fields." },
      { status: 400 }
    );
  }

  const docRef = db.collection(GROUPS_COLLECTION).doc(groupId);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return NextResponse.json(
      { ok: false, message: "Group not found." },
      { status: 404 }
    );
  }

  const data = snapshot.data() as { members?: Record<string, MemberRecord> };
  if (!data.members || !data.members[name]) {
    return NextResponse.json(
      { ok: false, message: "Member not found." },
      { status: 404 }
    );
  }

  const member = data.members[name];
  if (member.code !== code) {
    return NextResponse.json(
      { ok: false, message: "Invalid code." },
      { status: 401 }
    );
  }

  if (!member.assignedTo) {
    return NextResponse.json(
      { ok: false, message: "Assignment not ready yet." },
      { status: 409 }
    );
  }

  // Optionally record first reveal, but always return the assignment.
  if (!member.revealed) {
    await docRef.update({
      [`members.${name}.revealed`]: true
    });
  }

  return NextResponse.json({ ok: true, assignedTo: member.assignedTo });
}


