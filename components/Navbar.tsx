"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Calendar, MessageSquare, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-accent">EventLink</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-accent hover:opacity-80 transition">
            EventLink
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-gray-700 hover:text-accent transition"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link
                  href="/events"
                  className="flex items-center gap-2 text-gray-700 hover:text-accent transition"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Events</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center gap-2 text-gray-700 hover:text-accent transition"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-accent transition"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-accent transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-4 py-2 text-gray-700 hover:text-accent transition"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}



