"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/context/AuthContext";
import { getEvent, applyToEvent, getApplications, updateApplicationStatus } from "@/lib/firebase/events";
import { completeEventAndIssueCertificates } from "@/lib/firebase/certificates";
import { getOrCreateChat } from "@/lib/firebase/messages";
import { Event, Application } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  UserCheck,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId, user]);

  const loadEvent = async () => {
    try {
      const eventData = await getEvent(eventId);
      setEvent(eventData);
      if (user) {
        const userApplications = await getApplications(eventId, user.id);
        if (userApplications.length > 0) {
          setHasApplied(true);
          setApplicationStatus(userApplications[0].status);
        }
        if (user.role === "organiser" && user.id === eventData?.organiserId) {
          const eventApplications = await getApplications(eventId);
          setApplications(eventApplications);
        }
      }
    } catch (error) {
      console.error("Error loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAndIssue = async () => {
    if (!event || !isOrganiser) return;
    setIssuing(true);
    try {
      const res = await completeEventAndIssueCertificates(event.id);
      setErrorMsg(null);
      setStatusMsg(`Event marked completed. Certificates issued: ${res.issued}`);
      await loadEvent();
    } catch (e: any) {
      setStatusMsg(null);
      setErrorMsg(e?.message || "Failed to issue certificates");
    } finally {
      setIssuing(false);
    }
  };

  const handleApply = async () => {
    if (!user || !event) return;
    if (user.role === "organiser") {
      alert("Organisers cannot apply to events");
      return;
    }

    setApplying(true);
    try {
      await applyToEvent(eventId, user.id, user.name, user.email);
      setHasApplied(true);
      setApplicationStatus("pending");
      setErrorMsg(null);
      setStatusMsg("Application submitted successfully!");
      loadEvent();
    } catch (error: any) {
      setStatusMsg(null);
      setErrorMsg(error.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleApplicationStatus = async (applicationId: string, status: "accepted" | "rejected") => {
    if (!user || !event) return;
    try {
      await updateApplicationStatus(applicationId, status, eventId);
      setErrorMsg(null);
      setStatusMsg(`Application ${status} successfully!`);
      loadEvent();
    } catch (error: any) {
      setStatusMsg(null);
      setErrorMsg(error.message || "Failed to update application");
    }
  };

  const handleMessage = async (volunteerId: string, volunteerName: string) => {
    if (!user) return;
    try {
      const chatId = await getOrCreateChat(user.id, volunteerId, user.name, volunteerName);
      router.push(`/messages?chat=${chatId}`);
    } catch (error: any) {
      alert(error.message || "Failed to start chat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link href="/events" className="text-accent hover:opacity-80">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isOrganiser = user?.role === "organiser" && user?.id === event.organiserId;
  const canApply = user && user.role === "volunteer" && !hasApplied && event.status === "open";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {event.image && (
            <div className="h-64 md:h-96 bg-gray-200 overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{event.title}</h1>
                <p className="text-gray-600">Organised by {event.organiserName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm ${
                  event.status === "open"
                    ? "bg-green-100 text-green-800"
                    : event.status === "closed"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {event.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-accent" />
                <span>{format(event.date, "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-accent" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5 text-accent" />
                <span>
                  {event.appliedVolunteers.length} / {event.requiredVolunteers} volunteers
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-accent" />
                <span>{event.category}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-2xl font-semibold text-black mb-4">About this event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {event.requirements && event.requirements.length > 0 && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-xl font-semibold text-black mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {event.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              {statusMsg && (
                <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">{statusMsg}</div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{errorMsg}</div>
              )}
              {isOrganiser ? (
                <div>
                  <h3 className="text-xl font-semibold text-black mb-4">Applications</h3>
                  {applications.length === 0 ? (
                    <p className="text-gray-600">No applications yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <Link
                              href={`/volunteer/${app.volunteerId}`}
                              className="font-semibold text-black hover:text-accent transition"
                            >
                              {app.volunteerName}
                            </Link>
                            <p className="text-sm text-gray-600">{app.volunteerEmail}</p>
                            <p className="text-xs text-gray-500 mt-1">
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
                            {app.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApplicationStatus(app.id, "accepted")}
                                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                  title="Accept"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleApplicationStatus(app.id, "rejected")}
                                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleMessage(app.volunteerId, app.volunteerName)}
                              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              title="Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleCompleteAndIssue}
                      disabled={issuing || event.status === "completed"}
                      className="px-4 py-2 bg-accent text-white rounded disabled:opacity-50"
                    >
                      {event.status === "completed" ? "Certificates Issued" : (issuing ? "Issuing Certificates..." : "Mark Completed & Issue Certificates")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {hasApplied ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      {applicationStatus === "accepted" ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : applicationStatus === "rejected" ? (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-semibold text-black">
                          Application {applicationStatus}
                        </p>
                        <p className="text-sm text-gray-600">
                          Your application is currently {applicationStatus}. Check back for updates.
                        </p>
                      </div>
                    </div>
                  ) : canApply ? (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {applying ? "Applying..." : "Apply to this event"}
                    </button>
                  ) : !user ? (
                    <Link
                      href="/login"
                      className="block w-full text-center px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition"
                    >
                      Sign in to apply
                    </Link>
                  ) : (
                    <p className="text-gray-600">Applications are closed for this event.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

