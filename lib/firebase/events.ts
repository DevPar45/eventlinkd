import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Event, Application } from "@/lib/types";
import { sendOnApply, sendOnApproval } from "@/lib/notifications/email";

function requireDb() {
  if (!db) {
    throw new Error("Firebase is not configured. Please set environment variables.");
  }
  return db;
}

export async function createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<string> {
  // Remove undefined values to avoid Firestore errors
  const cleanEventData: any = {
    organiserId: eventData.organiserId,
    organiserName: eventData.organiserName,
    title: eventData.title,
    description: eventData.description,
    category: eventData.category,
    location: eventData.location,
    date: Timestamp.fromDate(eventData.date),
    requiredVolunteers: eventData.requiredVolunteers,
    appliedVolunteers: eventData.appliedVolunteers,
    selectedVolunteers: eventData.selectedVolunteers,
    status: eventData.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Only add optional fields if they have values
  if (eventData.endDate) {
    cleanEventData.endDate = Timestamp.fromDate(eventData.endDate);
  }
  
  if (eventData.image) {
    cleanEventData.image = eventData.image;
  }
  
  if (eventData.requirements && eventData.requirements.length > 0) {
    cleanEventData.requirements = eventData.requirements;
  }

  const docRef = await addDoc(collection(requireDb(), "events"), cleanEventData);
  return docRef.id;
}

export async function getEvent(eventId: string): Promise<Event | null> {
  if (!db) return null;
  const docSnap = await getDoc(doc(db, "events", eventId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data() as Record<string, any>;
  return {
    id: docSnap.id,
    ...data,
    date: data.date?.toDate(),
    endDate: data.endDate?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Event;
}

export async function getEvents(filters?: {
  organiserId?: string;
  status?: string;
  category?: string;
}): Promise<Event[]> {
  try {
    if (!db) return [];
    let q: any;
    
    // Build query based on filters
    if (filters?.organiserId) {
      // If filtering by organiserId, we can't always use orderBy with where
      // Try with orderBy first, fall back to without if it fails
      q = query(
        collection(db, "events"),
        where("organiserId", "==", filters.organiserId)
      );
    } else {
      q = query(collection(db, "events"));
    }

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status));
    }
    if (filters?.category) {
      q = query(q, where("category", "==", filters.category));
    }

    const querySnapshot = await getDocs(q);
    let events = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>;
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Event;
    });

    // Sort by date descending (client-side if orderBy didn't work)
    events.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return b.date.getTime() - a.date.getTime();
    });

    return events;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    // If query fails (e.g., missing index), try a simpler query
    try {
      if (!db) return [];
      const querySnapshot = await getDocs(collection(db, "events"));
      let events = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, any>;
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Event;
      });

      // Apply filters client-side
      if (filters?.organiserId) {
        events = events.filter((e) => e.organiserId === filters.organiserId);
      }
      if (filters?.status) {
        events = events.filter((e) => e.status === filters.status);
      }
      if (filters?.category) {
        events = events.filter((e) => e.category === filters.category);
      }

      // Sort by date
      events.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return b.date.getTime() - a.date.getTime();
      });

      return events;
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      return [];
    }
  }
}

export async function updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
  // Remove undefined values to avoid Firestore errors
  const updateData: any = {
    updatedAt: serverTimestamp(),
  };
  
  // Only include defined fields
  if (updates.organiserId !== undefined) updateData.organiserId = updates.organiserId;
  if (updates.organiserName !== undefined) updateData.organiserName = updates.organiserName;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.requiredVolunteers !== undefined) updateData.requiredVolunteers = updates.requiredVolunteers;
  if (updates.appliedVolunteers !== undefined) updateData.appliedVolunteers = updates.appliedVolunteers;
  if (updates.selectedVolunteers !== undefined) updateData.selectedVolunteers = updates.selectedVolunteers;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.image !== undefined && updates.image !== null) updateData.image = updates.image;
  if (updates.requirements !== undefined) updateData.requirements = updates.requirements;
  
  if (updates.date) {
    updateData.date = Timestamp.fromDate(updates.date);
  }
  if (updates.endDate) {
    updateData.endDate = Timestamp.fromDate(updates.endDate);
  }
  
  await updateDoc(doc(requireDb(), "events", eventId), updateData);
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "events", eventId));
}

export async function applyToEvent(
  eventId: string,
  volunteerId: string,
  volunteerName: string,
  volunteerEmail: string,
  message?: string
): Promise<string> {
  // Check if already applied
  const event = await getEvent(eventId);
  if (event?.appliedVolunteers?.includes(volunteerId)) {
    throw new Error("You have already applied to this event");
  }

  // Create application (only include message if it exists)
  const applicationData: any = {
    eventId,
    volunteerId,
    volunteerName,
    volunteerEmail,
    status: "pending",
    appliedAt: serverTimestamp(),
  };
  
  if (message && message.trim()) {
    applicationData.message = message.trim();
  }
  
  const appRef = await addDoc(collection(requireDb(), "applications"), applicationData);

  // Update event
  await updateDoc(doc(requireDb(), "events", eventId), {
    appliedVolunteers: [...(event?.appliedVolunteers || []), volunteerId],
    updatedAt: serverTimestamp(),
  });

  // Notify (best-effort)
  try {
    await sendOnApply({
      volunteerName,
      volunteerEmail,
      eventTitle: event?.title || "Event",
      eventId,
    });
  } catch {}

  return appRef.id;
}

export async function getApplications(eventId?: string, volunteerId?: string): Promise<Application[]> {
  // Build query without orderBy to avoid required composite indexes
  if (!db) return [];
  let q: any = query(collection(db, "applications"));

  if (eventId) {
    q = query(q, where("eventId", "==", eventId));
  }
  if (volunteerId) {
    q = query(q, where("volunteerId", "==", volunteerId));
  }

  const querySnapshot = await getDocs(q);
  const apps = querySnapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, any>;
    return {
      id: doc.id,
      ...data,
      appliedAt: data.appliedAt?.toDate?.() ?? null,
    } as Application;
  });

  // Sort client-side by appliedAt desc if available
  apps.sort((a: any, b: any) => {
    const ta = a.appliedAt ? a.appliedAt.getTime?.() ?? 0 : 0;
    const tb = b.appliedAt ? b.appliedAt.getTime?.() ?? 0 : 0;
    return tb - ta;
  });

  return apps as Application[];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected",
  eventId: string
): Promise<void> {
  await updateDoc(doc(requireDb(), "applications", applicationId), {
    status,
  });

  // Update event selected volunteers
  const event = await getEvent(eventId);
  const app = await getDoc(doc(requireDb(), "applications", applicationId));
  const volunteerId = app.data()?.volunteerId;
  const volunteerName = app.data()?.volunteerName;
  const volunteerEmail = app.data()?.volunteerEmail;

  if (status === "accepted" && volunteerId) {
    await updateDoc(doc(requireDb(), "events", eventId), {
      selectedVolunteers: [...(event?.selectedVolunteers || []), volunteerId],
      updatedAt: serverTimestamp(),
    });

    // Notify volunteer of approval
    try {
      await sendOnApproval({
        volunteerName: volunteerName || "",
        volunteerEmail: volunteerEmail || "",
        eventTitle: event?.title || "Event",
        eventId,
        organiserName: event?.organiserName || "",
      });
    } catch {}
  }
}



