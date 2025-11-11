"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const getAuthErrorMessage = (err: any) => {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Incorrect email or password.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
      default:
        return "Failed to sign in. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirect);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email above, then click Forgot password");
      return;
    }
    try {
      await resetPassword(email);
      setInfo("If an account exists for that email, a reset link has been sent.");
    } catch (err: any) {
      if (err?.code === "auth/user-not-found") {
        // Do not reveal account existence
        setInfo("If an account exists for that email, a reset link has been sent.");
        return;
      }
      setError("Couldn't send reset email. Please try again.");
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
          <h2 className="text-center text-3xl font-bold text-white">Sign In to EventLink</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-accent hover:opacity-80">
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded">
              {info}
            </div>
          )}

          <div className="space-y-4">
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
                  className="appearance-none block w-full pl-10 pr-3 py-2 bg-secondary/70 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-accent hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium text-white bg-accent hover:shadow-[0_0_30px_rgba(239,68,68,0.45)] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}



