export type UserRole = "volunteer" | "organiser";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatar?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  organiserId: string;
  organiserName: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  endDate?: Date;
  requiredVolunteers: number;
  appliedVolunteers: string[];
  selectedVolunteers: string[];
  status: "open" | "closed" | "completed";
  image?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
  message?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames?: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: { [userId: string]: number };
}



