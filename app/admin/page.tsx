"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Users, Calendar, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    // TODO: Add admin role check
    // if (user && user.role !== "admin") {
    //   router.push("/dashboard");
    // }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, events, and platform analytics</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-black mt-2">-</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-black mt-2">-</p>
              </div>
              <Calendar className="w-10 h-10 text-accent" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-black mt-2">-</p>
              </div>
              <MessageSquare className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Growth Rate</p>
                <p className="text-3xl font-bold text-black mt-2">-</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-black mb-4">Admin Features (Coming Soon)</h2>
          <div className="space-y-4 text-gray-600">
            <p>• User verification and management</p>
            <p>• Event moderation and approval</p>
            <p>• Analytics and reporting</p>
            <p>• Platform settings and configuration</p>
            <p>• Content moderation tools</p>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Note: Admin functionality will be implemented in Phase 2. For now, this page serves as a placeholder.
          </p>
        </div>
      </div>
    </div>
  );
}



