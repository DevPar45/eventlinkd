"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, Award, MessageSquare, Shield, Zap } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6">
              Connecting Volunteers with
              <span className="text-accent block mt-2">India's Biggest Events</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join EventLink to discover amazing volunteer opportunities, connect with event organisers,
              and build your experience portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    href="/register?role=volunteer"
                    className="px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    Join as Volunteer
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/register?role=organiser"
                    className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
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

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose EventLink?</h2>
            <p className="text-xl text-gray-600">Everything you need to connect and grow</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Verified Volunteers",
                description: "Connect with verified and experienced volunteers for your events",
              },
              {
                icon: Calendar,
                title: "Event Management",
                description: "Easily post, manage, and track your events in one place",
              },
              {
                icon: Award,
                title: "Certificates",
                description: "Earn and download certificates for your volunteer work",
              },
              {
                icon: MessageSquare,
                title: "Direct Messaging",
                description: "Communicate directly with organisers and volunteers",
              },
              {
                icon: Shield,
                title: "Verified Profiles",
                description: "Build trust with verified volunteer and organiser profiles",
              },
              {
                icon: Zap,
                title: "Quick Applications",
                description: "Apply to events with just one click and get instant updates",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
              >
                <feature.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of volunteers and organisers already using EventLink
            </p>
            {!user && (
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-accent text-white rounded-lg text-lg font-semibold hover:opacity-90 transition"
              >
                Sign Up Now
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 EventLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}



