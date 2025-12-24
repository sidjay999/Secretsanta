import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App | undefined;
let db: ReturnType<typeof getFirestore> | undefined;

try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.error(
        "[firebaseAdmin] Missing Firebase Admin credentials.",
        {
          hasProjectId: !!projectId,
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey
        }
      );
    } else {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      db = getFirestore(app);
      console.log("[firebaseAdmin] Firebase Admin initialized successfully");
    }
  } else {
    app = getApps()[0];
    db = getFirestore(app);
    console.log("[firebaseAdmin] Using existing Firebase Admin app");
  }
} catch (error) {
  console.error("[firebaseAdmin] Failed to initialize Firebase Admin:", error);
  app = undefined;
  db = undefined;
}

export { db };

export type MemberRecord = {
  code: string;
  assignedTo: string;
  revealed?: boolean;
};


