"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { getChats, getMessages, sendMessage, subscribeToMessages, markMessagesAsRead, subscribeToChats } from "@/lib/firebase/messages";
import { Chat, Message } from "@/lib/types";
import { motion } from "framer-motion";
import { Send, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

function MessagesPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsub = subscribeToChats(user.id, (list) => {
      setChats(list);
      const chatParam = searchParams.get("chat");
      if (chatParam) {
        setSelectedChat(chatParam);
      } else if (list.length > 0 && !selectedChat) {
        setSelectedChat(list[0].id);
      }
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [user]);

  useEffect(() => {
    if (selectedChat && user) {
      const unsubscribe = loadMessages();
      markMessagesAsRead(selectedChat, user.id);
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [selectedChat, user]);

  // retained for potential manual refresh usage (not used now)
  const loadChats = async () => {};

  const loadMessages = (): (() => void) | undefined => {
    if (!selectedChat || !user) return;
    const unsubscribe = subscribeToMessages(selectedChat, (msgs) => {
      setMessages(msgs);
      if (user) {
        markMessagesAsRead(selectedChat, user.id);
      }
    });
    return unsubscribe;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChat || !messageContent.trim()) return;

    const chat = chats.find((c) => c.id === selectedChat);
    if (!chat) return;

    const receiverId = chat.participants.find((p) => p !== user.id);
    if (!receiverId) return;

    // Get receiver name from chat participants
    const receiverIndex = chat.participants.indexOf(receiverId);
    const receiverName = (chat as any).participantNames?.[receiverIndex] || "User";

    try {
      await sendMessage(user.id, receiverId, user.name, receiverName, messageContent);
      setMessageContent("");
    } catch (error: any) {
      alert(error.message || "Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view messages</h2>
        </div>
      </div>
    );
  }

 const currentChat = chats.find((c) => c.id === selectedChat) ?? null;

const otherParticipantId = currentChat?.participants?.find(
  (p) => p !== user.id
);

let otherParticipantName = "User";

if (currentChat && otherParticipantId) {
  const idx = currentChat.participants.indexOf(otherParticipantId);
  otherParticipantName =
    currentChat.participantNames?.[idx] ?? "User";
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No messages yet</p>
              </div>
            ) : (
              chats.map((chat) => {
                const otherId = chat.participants.find((p) => p !== user.id);
                const otherName = otherId
                  ? (chat as any).participantNames?.[chat.participants.indexOf(otherId)] || "User"
                  : "User";
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedChat === chat.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black truncate">{otherName}</p>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage || "No messages"}</p>
                      </div>
                      {(chat.unreadCount?.[user.id] ?? 0) > 0 && (
                        <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                          {chat.unreadCount?.[user.id] ?? 0}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">{otherParticipantName}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? "bg-accent text-white"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user.id ? "text-white/70" : "text-gray-500"
                        }`}
                      >
                        {format(message.timestamp, "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}

