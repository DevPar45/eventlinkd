import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// IMPORTANT: Read env vars via direct literals so Next.js can inline them in the client bundle
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "";
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const hasEssential = !!(API_KEY && AUTH_DOMAIN && PROJECT_ID && APP_ID);

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

if (hasEssential) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  _auth = getAuth(app);
  _db = getFirestore(app);
  // storage and messaging are optional during init
  try {
    _storage = getStorage(app);
  } catch (e) {
    _storage = null;
  }
} else {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    const missingKeys = [
      !API_KEY && "NEXT_PUBLIC_FIREBASE_API_KEY",
      !AUTH_DOMAIN && "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      !PROJECT_ID && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      !APP_ID && "NEXT_PUBLIC_FIREBASE_APP_ID",
    ].filter(Boolean);
    console.error(
      "Firebase env vars missing. App will run without Firebase until configured. Missing:",
      missingKeys
    );
  }
}

export const auth: Auth | null = _auth;
export const db: Firestore | null = _db;
export const storage: FirebaseStorage | null = _storage;

export default app;



