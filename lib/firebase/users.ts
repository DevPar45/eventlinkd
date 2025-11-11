import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { User } from "@/lib/types";

export async function getUser(userId: string): Promise<User | null> {
  try {
    if (!db) return null;
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return null;
    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
      createdAt: userData.createdAt?.toDate(),
      updatedAt: userData.updatedAt?.toDate(),
    } as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getUsers(userIds: string[]): Promise<User[]> {
  try {
    if (!db) return [];
    const users = await Promise.all(userIds.map((id) => getUser(id)));
    return users.filter((u) => u !== null) as User[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

