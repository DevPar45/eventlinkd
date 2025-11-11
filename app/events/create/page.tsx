"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { createEvent } from "@/lib/firebase/events";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "conference",
    location: "",
    date: "",
    endDate: "",
    requiredVolunteers: "1",
    requirements: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== "organiser") {
      alert("Only organisers can create events");
      return;
    }

    setLoading(true);
    try {
      const eventData: any = {
        organiserId: user.id,
        organiserName: user.name,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: new Date(formData.date),
        requiredVolunteers: parseInt(formData.requiredVolunteers),
        appliedVolunteers: [],
        selectedVolunteers: [],
        status: "open",
      };

      // Only add optional fields if they have values
      if (formData.endDate) {
        eventData.endDate = new Date(formData.endDate);
      }
      
      if (formData.image && formData.image.trim()) {
        eventData.image = formData.image.trim();
      }
      
      if (formData.requirements && formData.requirements.trim()) {
        eventData.requirements = formData.requirements.split("\n").filter((r) => r.trim());
      }

      await createEvent(eventData);
      // Redirect to dashboard - it will refresh automatically
      router.push("/dashboard");
      router.refresh(); // Force refresh to show new event
    } catch (error: any) {
      alert(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "organiser") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only organisers can create events.</p>
          <Link href="/dashboard" className="text-accent hover:opacity-80">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold text-black mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., Tech Conference 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Describe your event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="conference">Conference</option>
                  <option value="festival">Festival</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="corporate">Corporate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Volunteers *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.requiredVolunteers}
                  onChange={(e) => setFormData({ ...formData, requiredVolunteers: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (One per line)
              </label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g.,&#10;Age 18+&#10;Previous experience preferred&#10;Available for full day"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}



