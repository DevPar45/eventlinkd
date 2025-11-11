import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "./config";
import { Message, Chat } from "@/lib/types";

function requireDb() {
  if (!db) {
    throw new Error("Firebase is not configured. Please set environment variables.");
  }
  return db;
}

export async function sendMessage(
  senderId: string,
  receiverId: string,
  senderName: string,
  receiverName: string,
  content: string
): Promise<string> {
  // Get or create chat
  const chatId = await getOrCreateChat(senderId, receiverId, senderName, receiverName);

  // Send message
  const messageRef = await addDoc(collection(requireDb(), "messages"), {
    chatId,
    senderId,
    receiverId,
    senderName,
    receiverName,
    content,
    timestamp: serverTimestamp(),
    read: false,
  });

  // Update chat last message
  await updateDoc(doc(requireDb(), "chats", chatId), {
    lastMessage: content,
    lastMessageTime: serverTimestamp(),
    [`unreadCount.${receiverId}`]: increment(1),
  } as any);

  return messageRef.id;
}

export async function getOrCreateChat(
  userId1: string,
  userId2: string,
  userName1: string,
  userName2: string
): Promise<string> {
  // Check if chat exists
  if (!db) throw new Error("Firebase is not configured. Please set environment variables.");
  const chatsQuery = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId1)
  );
  const chatsSnapshot = await getDocs(chatsQuery);

  for (const chatDoc of chatsSnapshot.docs) {
    const chatData = chatDoc.data();
    if (chatData.participants.includes(userId2)) {
      return chatDoc.id;
    }
  }

  // Create new chat
  const chatRef = await addDoc(collection(requireDb(), "chats"), {
    participants: [userId1, userId2],
    participantNames: [userName1, userName2],
    unreadCount: {
      [userId1]: 0,
      [userId2]: 0,
    },
    createdAt: serverTimestamp(),
  });

  return chatRef.id;
}

export async function getChats(userId: string): Promise<Chat[]> {
  if (!db) return [];
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );

  const querySnapshot = await getDocs(q);
  const chats = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      lastMessageTime: data.lastMessageTime?.toDate(),
    } as Chat;
  });
  
  // Sort by lastMessageTime (most recent first)
  return chats.sort((a, b) => {
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });
}

export async function getMessages(chatId: string): Promise<Message[]> {
  if (!db) return [];
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Message;
  });
}

export function subscribeToMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): () => void {
  if (!db) return () => {};
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate(),
      } as Message;
    });
    callback(messages);
  });
}

export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  if (!db) return;
  const q = query(
    collection(db, "messages"),
    where("chatId", "==", chatId),
    where("receiverId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);
  const batch = snapshot.docs.map((doc) => updateDoc(doc.ref, { read: true }));
  await Promise.all(batch);

  // Reset unread counter for this chat for the user
  await updateDoc(doc(requireDb(), "chats", chatId), {
    [`unreadCount.${userId}`]: 0,
  } as any);
}

export function subscribeToChats(
  userId: string,
  callback: (chats: Chat[]) => void
): () => void {
  if (!db) return () => {};
  const q = query(collection(db, "chats"), where("participants", "array-contains", userId));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        ...data,
        lastMessageTime: data.lastMessageTime?.toDate?.(),
      } as Chat;
    });
    // sort client-side by lastMessageTime desc
    list.sort((a: any, b: any) => {
      const ta = a.lastMessageTime?.getTime?.() ?? 0;
      const tb = b.lastMessageTime?.getTime?.() ?? 0;
      return tb - ta;
    });
    callback(list);
  });
}
