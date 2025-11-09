"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getUser } from "@/lib/firebase/users";
import { User } from "@/lib/types";
import { motion } from "framer-motion";
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, Shield, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getOrCreateChat } from "@/lib/firebase/messages";

export default function VolunteerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const volunteerId = params.id as string;
  const [volunteer, setVolunteer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (volunteerId) {
      loadVolunteer();
    }
  }, [volunteerId]);

  const loadVolunteer = async () => {
    try {
      const volunteerData = await getUser(volunteerId);
      setVolunteer(volunteerData);
    } catch (error) {
      console.error("Error loading volunteer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!currentUser || !volunteer) return;
    try {
      const chatId = await getOrCreateChat(currentUser.id, volunteer.id, currentUser.name, volunteer.name);
      router.push(`/messages?chat=${chatId}`);
    } catch (error: any) {
      alert(error.message || "Failed to start chat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading volunteer profile...</div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Volunteer not found</h2>
          <Link href="/dashboard" className="text-accent hover:opacity-80">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-red-600 h-32 relative">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                {volunteer.avatar ? (
                  <img
                    src={volunteer.avatar}
                    alt={volunteer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            {/* Profile Info */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">{volunteer.name}</h1>
                <p className="text-gray-600 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {volunteer.email}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Volunteer
                  </span>
                  {volunteer.verified && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
              {currentUser && currentUser.role === "organiser" && (
                <button
                  onClick={handleMessage}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {volunteer.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <p className="text-gray-900">{volunteer.phone}</p>
                </div>
              )}

              {volunteer.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <p className="text-gray-900 whitespace-pre-line">{volunteer.bio}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <p className="text-gray-600">
                  {volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

