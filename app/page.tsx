"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/firebase/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <img src="/branding/logo.png" alt="EventLink" className="h-20 md:h-24 w-auto" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Connect to events. Earn certificates.
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Join as a volunteer or organiser and get started in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    href="/register?role=volunteer"
                    className="px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:shadow-[0_0_35px_rgba(239,68,68,0.45)] transition flex items-center justify-center gap-2"
                  >
                    Join as Volunteer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/register?role=organiser"
                    className="px-8 py-4 bg-secondary text-white rounded-lg text-lg font-semibold hover:bg-black/70 transition flex items-center justify-center gap-2 border border-white/10"
                  >
                    Join as Organiser
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      {/* CTA Banner for Organisers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Organising an event? Get verified volunteers in minutes.</h2>
          <Link href="/register?role=organiser" className="inline-block mt-4 px-8 py-3 bg-accent rounded-lg font-semibold">Post an Event</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-700">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/branding/logo.png" alt="EventLink" className="h-10 w-auto" />
              <span className="text-xl font-semibold">EventLink</span>
            </div>
            <p>Your bridge between organisers and volunteers.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Contact</p>
            <p className="text-sm">Email: devharshadparmar@gmail.com</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Legal</p>
            <p className="text-sm">Privacy & Terms</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 text-center text-gray-600 text-sm">
          Built by Dev Parmar © 2025
        </div>
      </footer>
    </div>
  );
}



