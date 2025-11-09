"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getEvents, getApplications } from "@/lib/firebase/events";
import { getUser } from "@/lib/firebase/users";
import { Event, Application, User } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Users, CheckCircle, Clock, Plus, ArrowRight, User as UserIcon, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, loading]);

  // Refresh data when navigating back to dashboard
  useEffect(() => {
    const handleFocus = () => {
      if (user && !loading) {
        loadData();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, loading]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      if (user.role === "organiser") {
        // Load organiser's events
        const organiserEvents = await getEvents({ organiserId: user.id });
        setEvents(organiserEvents);
        
        // Also load applications for all events to show in dashboard
        const allApplications: Application[] = [];
        for (const event of organiserEvents) {
          try {
            const eventApplications = await getApplications(event.id);
            allApplications.push(...eventApplications);
          } catch (error) {
            console.error(`Error loading applications for event ${event.id}:`, error);
          }
        }
        setApplications(allApplications);
      } else {
        const volunteerApplications = await getApplications(undefined, user.id);
        setApplications(volunteerApplications);
        // Load events for applied applications
        const eventIds = volunteerApplications.map((app) => app.eventId);
        const appliedEvents = await Promise.all(
          eventIds.map(async (id) => {
            try {
              const { getEvent } = await import("@/lib/firebase/events");
              return await getEvent(id);
            } catch {
              return null;
            }
          })
        );
        setEvents(appliedEvents.filter((e) => e !== null) as Event[]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-black mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            {user.role === "organiser"
              ? "Manage your events and view applications"
              : "Track your volunteer applications and upcoming events"}
          </p>
        </motion.div>

        {user.role === "organiser" ? (
          <OrganiserDashboard events={events} applications={applications} />
        ) : (
          <VolunteerDashboard applications={applications} events={events} />
        )}
      </div>
    </div>
  );
}

function OrganiserDashboard({ events, applications }: { events: Event[]; applications: Application[] }) {
  const [volunteerProfiles, setVolunteerProfiles] = useState<Map<string, User>>(new Map());
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const openEvents = events.filter((e) => e.status === "open");
  const pendingApplications = applications.filter((app) => app.status === "pending");

  useEffect(() => {
    const loadVolunteerProfiles = async () => {
      if (applications.length === 0) {
        setLoadingProfiles(false);
        return;
      }

      const uniqueVolunteerIds = [...new Set(applications.map((app) => app.volunteerId))];
      const profiles = new Map<string, User>();

      for (const volunteerId of uniqueVolunteerIds) {
        try {
          const volunteer = await getUser(volunteerId);
          if (volunteer) {
            profiles.set(volunteerId, volunteer);
          }
        } catch (error) {
          console.error(`Error loading volunteer ${volunteerId}:`, error);
        }
      }

      setVolunteerProfiles(profiles);
      setLoadingProfiles(false);
    };

    loadVolunteerProfiles();
  }, [applications]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Your Events</h2>
        <Link
          href="/events/create"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-black mt-2">{events.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-accent" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Events</p>
              <p className="text-3xl font-bold text-black mt-2">{openEvents.length}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-black mt-2">{applications.length}</p>
            </div>
            <Users className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Applications Section */}
      {applications.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-black mb-4">Recent Applications</h3>
          <div className="space-y-3 mb-8">
            {applications.slice(0, 5).map((app) => {
              const volunteer = volunteerProfiles.get(app.volunteerId);
              const event = events.find((e) => e.id === app.eventId);
              return (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{app.volunteerName}</p>
                          <p className="text-sm text-gray-600">{app.volunteerEmail}</p>
                        </div>
                      </div>
                      {event && (
                        <p className="text-sm text-gray-600 mt-2">
                          Applied to: <span className="font-medium">{event.title}</span>
                        </p>
                      )}
                      {volunteer && (
                        <div className="mt-2 text-sm text-gray-500">
                          {volunteer.phone && <span>Phone: {volunteer.phone}</span>}
                          {volunteer.bio && (
                            <p className="mt-1 line-clamp-1">{volunteer.bio}</p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Applied on {format(app.appliedAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.status}
                      </span>
                      <div className="flex flex-col gap-2">
                        {event && (
                          <Link
                            href={`/event/${event.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition text-center"
                          >
                            View Event
                          </Link>
                        )}
                        <Link
                          href={`/volunteer/${app.volunteerId}`}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition text-center"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Events Section */}
      <div>
        <h3 className="text-xl font-semibold text-black mb-4">Your Events</h3>
        {events.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
            <Link
              href="/events/create"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-black mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {event.date ? format(event.date, "MMM dd, yyyy") : "Date TBD"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        event.status === "open"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.appliedVolunteers.length} / {event.requiredVolunteers} applications
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VolunteerDashboard({
  applications,
  events,
}: {
  applications: Application[];
  events: Event[];
}) {
  const pendingApps = applications.filter((app) => app.status === "pending");
  const acceptedApps = applications.filter((app) => app.status === "accepted");
  const eventMap = new Map(events.map((e) => [e.id, e]));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-black mt-2">{applications.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-accent" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-black mt-2">{pendingApps.length}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accepted</p>
              <p className="text-3xl font-bold text-black mt-2">{acceptedApps.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-black">My Applications</h3>
          <Link
            href="/events"
            className="flex items-center gap-2 text-accent hover:opacity-80 transition"
          >
            Browse Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">You haven't applied to any events yet.</p>
              <Link
                href="/events"
                className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const event = eventMap.get(app.eventId);
              if (!event) return null;
              return (
                <Link key={app.id} href={`/event/${event.id}`}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-black mb-2">{event.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          Applied on {format(app.appliedAt, "MMM dd, yyyy")}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {event.location} • {format(event.date, "MMM dd, yyyy")}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}



