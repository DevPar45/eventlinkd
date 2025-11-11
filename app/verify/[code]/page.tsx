"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyCertificateByCode } from "@/lib/firebase/certificates";
import { Certificate } from "@/lib/types";

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = params.code as string;
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const c = await verifyCertificateByCode(code);
        setCert(c);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Verifying...</div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Certificate not found</h1>
          <p className="text-gray-600">The verification code may be invalid or revoked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <img src={cert.url} alt="Certificate" className="w-full object-cover" />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-black mb-2">Verified Certificate</h1>
          <p className="text-gray-700">Volunteer: <span className="font-medium">{cert.volunteerName}</span></p>
          <p className="text-gray-700">Event: <span className="font-medium">{cert.eventTitle}</span></p>
          <p className="text-gray-500 mt-2 text-sm">Verification Code: {cert.verificationCode}</p>
        </div>
      </div>
    </div>
  );
}
