import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EventLink - Connecting Volunteers with India's Biggest Events",
  description: "Connect verified volunteers, event helpers, and safety staff with event organisers, brands, and venues.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-primary text-gray-200">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}



