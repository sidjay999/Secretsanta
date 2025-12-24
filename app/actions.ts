"use server";

import { db, type MemberRecord } from "@/lib/firebaseAdmin";
import { randomUUID } from "crypto";

if (!process.env.ADMIN_SETUP_KEY) {
  console.warn(
    "[actions] ADMIN_SETUP_KEY is not set. Group creation endpoint will reject requests until configured."
  );
}

const GROUPS_COLLECTION = "groups";

export async function getGroups(): Promise<string[]> {
  if (!db) return [];
  const snapshot = await db.collection(GROUPS_COLLECTION).get();
  return snapshot.docs.map((doc) => doc.id);
}

export async function getUnrevealedMembers(groupId: string): Promise<string[]> {
  // Now simply returns all members for the group; repeated reveals are allowed.
  if (!db) return [];
  const doc = await db.collection(GROUPS_COLLECTION).doc(groupId).get();
  if (!doc.exists) return [];

  const data = doc.data() as { members?: Record<string, MemberRecord> };
  if (!data?.members) return [];

  return Object.keys(data.members);
}

export async function revealAssignment(params: {
  groupId: string;
  name: string;
  code: string;
}): Promise<
  | { ok: true; assignedTo: string }
  | { ok: false; message: string }
> {
  if (!db) return { ok: false, message: "Service is not configured." };

  const { groupId, name, code } = params;

  const docRef = db.collection(GROUPS_COLLECTION).doc(groupId);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return { ok: false, message: "Group not found." };
  }

  const data = snapshot.data() as { members?: Record<string, MemberRecord> };
  if (!data.members || !data.members[name]) {
    return { ok: false, message: "Member not found." };
  }

  const member = data.members[name];
  if (member.code !== code) {
    return { ok: false, message: "Invalid code." };
  }

  if (!member.assignedTo) {
    return { ok: false, message: "Assignment not ready yet." };
  }

  // Optionally mark as revealed the first time; returning assignment every time.
  if (!member.revealed) {
    await docRef.update({
      [`members.${name}.revealed`]: true
    });
  }

  return { ok: true, assignedTo: member.assignedTo };
}

// ADMIN: Create group and generate deranged Secret Santa assignments
export async function adminCreateGroup(params: {
  adminKey: string;
  groupId: string;
  memberNames: string[];
}): Promise<
  | { ok: true; groupId: string; memberCodes: Array<{ name: string; code: string; assignedTo: string }> }
  | { ok: false; message: string }
> {
  if (!db) return { ok: false, message: "Service is not configured." };

  const { adminKey, groupId, memberNames } = params;

  if (adminKey !== process.env.ADMIN_SETUP_KEY) {
    return { ok: false, message: "Not authorized." };
  }

  const cleaned = memberNames
    .map((n) => n.trim())
    .filter(Boolean);

  const uniqueNames = Array.from(new Set(cleaned));

  if (uniqueNames.length < 2) {
    return {
      ok: false,
      message: "At least 2 unique participants are required for Secret Santa."
    };
  }

  const names = uniqueNames;

  // Generate assignments once using a derangement (no one gets themselves)
  const assignments = generateSecretSantaAssignments(names);

  const membersMap: Record<string, MemberRecord> = {};
  const memberCodes: Array<{ name: string; code: string; assignedTo: string }> = [];

  names.forEach((name) => {
    const code = generateCode(name);
    membersMap[name] = {
      code,
      assignedTo: assignments[name],
      revealed: false
    };
    memberCodes.push({ name, code, assignedTo: assignments[name] });
  });

  await db.collection(GROUPS_COLLECTION).doc(groupId).set(
    {
      members: membersMap,
      createdAt: new Date().toISOString()
    },
    { merge: false }
  );

  return { ok: true, groupId, memberCodes };
}

// Form-oriented server action for admin UI
export async function adminCreateGroupAction(formData: FormData) {
  "use server";

  const adminKey = formData.get("adminKey")?.toString() ?? "";
  const groupId = formData.get("groupId")?.toString() ?? "";
  const membersRaw = formData.get("members")?.toString() ?? "";

  // Expect just names, one per line (codes will be auto-generated)
  const memberNames = membersRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return adminCreateGroup({ adminKey, groupId, memberNames });
}

// Generate a unique code for a member (format: 2-letter prefix + 5 random alphanumeric)
function generateCode(name: string): string {
  const prefix = name
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, "X");
  
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluding confusing chars
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${prefix}${randomPart}`;
}

// Derangement-based Secret Santa assignments (no one gets themselves)
function generateSecretSantaAssignments(names: string[]): Record<string, string> {
  if (names.length < 2) {
    throw new Error("At least 2 participants required");
  }

  let shuffled = [...names];
  let isValid = false;

  while (!isValid) {
    // Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Check no one gets themselves
    isValid = !shuffled.some((name, index) => name === names[index]);
  }

  const assignments: Record<string, string> = {};
  names.forEach((name, index) => {
    assignments[name] = shuffled[index];
  });

  return assignments;
}

