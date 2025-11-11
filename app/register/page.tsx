"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight, Users, Building2 } from "lucide-react";
import { UserRole } from "@/lib/types";

function RegisterPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("volunteer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "volunteer" || roleParam === "organiser") {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name, role, phone || undefined);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 glass p-8 rounded-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Create Your Account</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent hover:opacity-80">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                  role === "volunteer"
                    ? "border-accent bg-accent/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="font-medium text-gray-200">Volunteer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("organiser")}
                className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                  role === "organiser"
                    ? "border-accent bg-accent/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Building2 className="w-6 h-6" />
                <span className="font-medium text-gray-200">Organiser</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 bg-secondary/70 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 bg-secondary/70 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 bg-secondary/70 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="appearance-none block w-full pl-10 pr-3 py-2 bg-secondary/70 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-accent hover:shadow-[0_0_30px_rgba(239,68,68,0.45)] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

