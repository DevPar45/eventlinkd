"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Phone, Edit2, Save, X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user, loading]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser(formData);
      setEditing(false);
    } catch (error: any) {
      alert(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
    setEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-red-600 h-32 relative">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            {/* Profile Info */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.role === "organiser"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role === "organiser" ? "Organiser" : "Volunteer"}
                  </span>
                  {user.verified && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+91 1234567890"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {editing ? (
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-line">
                    {user.bio || "No bio provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-gray-600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



