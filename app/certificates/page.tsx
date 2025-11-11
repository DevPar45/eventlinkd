"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { getCertificatesForUser } from "@/lib/firebase/certificates";
import { Certificate } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const list = await getCertificatesForUser(user.id);
        setCerts(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-2">Please sign in to view your certificates.</p>
          <Link href="/login" className="text-accent">Sign in</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Certificates</h1>
          <p className="text-gray-600">Download and share your verified certificates</p>
        </motion.div>

        {certs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No certificates yet. Participate in an event to earn one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={c.url} alt={`${c.eventTitle} certificate`} className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black">{c.eventTitle}</h3>
                  <p className="text-sm text-gray-600">Issued to {c.volunteerName}</p>
                  <div className="mt-3 flex gap-3">
                    <a href={c.url} target="_blank" className="px-4 py-2 bg-accent text-white rounded">View</a>
                    <Link href={`/verify/${c.verificationCode}`} className="px-4 py-2 border rounded">Verify</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
