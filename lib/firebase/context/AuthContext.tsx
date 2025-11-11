"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const authInstance = auth!;
    const database = db!;

    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(database, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: userDoc.id,
            ...userData,
            createdAt: userData.createdAt?.toDate(),
            updatedAt: userData.updatedAt?.toDate(),
          } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole, phone?: string) => {
    if (!auth || !db) throw new Error("Firebase is not configured. Please set environment variables.");
    const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    const userData: Omit<User, "id"> = {
      email,
      name,
      role,
      phone: phone || undefined,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db!, "users", userCredential.user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setUser({ id: userCredential.user.uid, ...userData });
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please set environment variables.");
    const authInstance = auth;
    await signInWithEmailAndPassword(authInstance, email, password);
  };

  const logout = async () => {
    if (!auth) return;
    const authInstance = auth;
    await signOut(authInstance);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!firebaseUser || !db) return;
    await setDoc(
      doc(db!, "users", firebaseUser.uid),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase is not configured. Please set environment variables.");
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signUp, signIn, logout, updateUser, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

