import { addDoc, collection, doc, getDocs, getDoc, query, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import { Event, User, Certificate } from "@/lib/types";
import { getUser } from "./users";
import { updateEvent, getEvent } from "./events";
import { sendOnCertificate } from "@/lib/notifications/email";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured. Please set environment variables.");
  return db;
}

function requireStorage() {
  if (!storage) throw new Error("Firebase Storage is not configured.");
  return storage;
}

function generateVerificationCode(): string {
  // 10-char base36 code
  return Math.random().toString(36).slice(2, 12).toUpperCase();
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function createCertificateImage(volunteerName: string, eventTitle: string, verifyUrl: string): Promise<string> {
  // Draw to canvas (client or server with OffscreenCanvas not available; assume browser usage in organiser flow)
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1131; // ~A4 ratio landscape
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Background: try template image, else gradient
  try {
    const template = await loadImage("/templates/certificate.png");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
  } catch {
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, "#0f172a");
    grd.addColorStop(1, "#1f2937");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 72px Poppins, Inter, sans-serif";
  ctx.fillText("Certificate of Participation", canvas.width / 2, 240);

  // Subtitle
  ctx.font = "28px Inter, sans-serif";
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText("This certificate is proudly presented to", canvas.width / 2, 340);

  // Name
  ctx.font = "bold 64px Poppins, Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(volunteerName, canvas.width / 2, 430);

  // Event line
  ctx.font = "28px Inter, sans-serif";
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(`for volunteering at "${eventTitle}"`, canvas.width / 2, 500);

  // QR code using Google Chart API (no extra deps)
  const qrSize = 260;
  const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}x${qrSize}&chl=${encodeURIComponent(verifyUrl)}`;
  try {
    const qr = await loadImage(qrUrl);
    const pad = 80;
    ctx.drawImage(qr, canvas.width - qrSize - pad, canvas.height - qrSize - pad, qrSize, qrSize);
    ctx.font = "18px Inter, sans-serif";
    ctx.fillStyle = "#e5e7eb";
    ctx.textAlign = "right";
    ctx.fillText("Scan to verify", canvas.width - pad, canvas.height - qrSize - pad + 24);
  } catch {}

  // Footer note
  ctx.textAlign = "left";
  ctx.font = "20px Inter, sans-serif";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("Issued by EventLink", 80, canvas.height - 100);

  return canvas.toDataURL("image/png");
}

export async function generateAndIssueCertificate(event: Event, volunteer: User): Promise<Certificate> {
  const verificationCode = generateVerificationCode();
  const verifyUrl = `${window.location.origin}/verify/${verificationCode}`;

  // Create image data URL
  const dataUrl = await createCertificateImage(volunteer.name, event.title, verifyUrl);

  // Upload to storage
  const storageRef = ref(requireStorage(), `certificates/${event.id}_${volunteer.id}.png`);
  await uploadString(storageRef, dataUrl, "data_url");
  const url = await getDownloadURL(storageRef);

  // Store certificate doc
  const docRef = await addDoc(collection(requireDb(), "certificates"), {
    eventId: event.id,
    eventTitle: event.title,
    organiserId: event.organiserId,
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    issuedAt: serverTimestamp(),
    url,
    verificationCode,
    verificationPublic: true,
  });

  // Notify volunteer (best-effort)
  try {
    await sendOnCertificate({
      volunteerName: volunteer.name,
      eventTitle: event.title,
      certificateUrl: url,
      verificationCode,
    });
  } catch {}

  return {
    id: docRef.id,
    eventId: event.id,
    eventTitle: event.title,
    organiserId: event.organiserId,
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    issuedAt: new Date(),
    url,
    verificationCode,
  };
}

export async function issueCertificatesForEvent(eventId: string): Promise<number> {
  const event = await getEvent(eventId);
  if (!event) throw new Error("Event not found");

  // Fetch volunteers
  const volunteerIds = event.selectedVolunteers || [];
  const results = await Promise.all(
    volunteerIds.map(async (vid) => {
      const u = await getUser(vid);
      if (!u) return null;
      try {
        await generateAndIssueCertificate(event, u);
        return true;
      } catch {
        return null;
      }
    })
  );

  // Mark event as completed and flag certificateIssued
  await updateEvent(eventId, { status: "completed", certificateIssued: true });

  return results.filter(Boolean).length;
}

export async function getCertificatesForUser(userId: string): Promise<Certificate[]> {
  if (!db) return [];
  const q = query(collection(db, "certificates"), where("volunteerId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      eventId: data.eventId,
      eventTitle: data.eventTitle,
      organiserId: data.organiserId,
      volunteerId: data.volunteerId,
      volunteerName: data.volunteerName,
      issuedAt: data.issuedAt?.toDate?.() ?? new Date(),
      url: data.url,
      verificationCode: data.verificationCode,
    } as Certificate;
  });
}

export async function verifyCertificateByCode(code: string): Promise<Certificate | null> {
  if (!db) return null;
  const q = query(collection(db, "certificates"), where("verificationCode", "==", code));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as any;
  return {
    id: d.id,
    eventId: data.eventId,
    eventTitle: data.eventTitle,
    organiserId: data.organiserId,
    volunteerId: data.volunteerId,
    volunteerName: data.volunteerName,
    issuedAt: data.issuedAt?.toDate?.() ?? new Date(),
    url: data.url,
    verificationCode: data.verificationCode,
  } as Certificate;
}

export async function completeEventAndIssueCertificates(eventId: string): Promise<{ issued: number }>{
  const issued = await issueCertificatesForEvent(eventId);
  return { issued };
}
