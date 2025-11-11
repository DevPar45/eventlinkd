"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { getEvents } from "@/lib/firebase/events";
import { Event } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, categoryFilter, statusFilter]);

  const loadEvents = async () => {
    try {
      const allEvents = await getEvents({ status: "open" });
      setEvents(allEvents);
      setFilteredEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const categories = ["all", "conference", "festival", "sports", "cultural", "corporate", "other"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
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
          <h1 className="text-4xl font-bold text-black mb-2">Browse Events</h1>
          <p className="text-gray-600">Find volunteer opportunities that match your interests</p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  {event.image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-black">{event.title}</h3>
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(event.date, "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.appliedVolunteers.length} / {event.requiredVolunteers} volunteers
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



