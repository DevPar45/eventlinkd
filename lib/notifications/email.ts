// Lightweight EmailJS wrapper. Safe to no-op when envs are missing.

export type EmailPayload = Record<string, any>;

function getEnv(name: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return (process as any).env?.[name];
}

function hasEmailJsEnv() {
  return !!(
    getEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID") &&
    getEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY")
  );
}

async function send(templateIdEnv: string, payload: EmailPayload) {
  if (!hasEmailJsEnv()) return { ok: false, skipped: true };
  const serviceId = getEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID")!;
  const publicKey = getEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY")!;
  const templateId = getEnv(templateIdEnv);
  if (!templateId) return { ok: false, skipped: true };

  const emailjs = await import("@emailjs/browser");
  await emailjs.send(serviceId, templateId, payload, { publicKey });
  return { ok: true };
}

function appUrl() {
  return getEnv("NEXT_PUBLIC_APP_URL") || (typeof window !== "undefined" ? window.location.origin : "");
}

export async function sendOnApply(args: {
  volunteerName: string;
  volunteerEmail: string;
  eventTitle: string;
  eventId: string;
  organiserEmail?: string;
}) {
  const base = appUrl();
  const payload = {
    volunteer_name: args.volunteerName,
    volunteer_email: args.volunteerEmail,
    event_title: args.eventTitle,
    event_link: `${base}/event/${args.eventId}`,
    organiser_email: args.organiserEmail || "",
    logo_url: `${base}/branding/logo.png`,
  };
  try {
    await send("NEXT_PUBLIC_EMAILJS_TEMPLATE_APPLY", payload);
  } catch {}
}

export async function sendOnApproval(args: {
  volunteerName: string;
  eventTitle: string;
  eventId: string;
  organiserName?: string;
}) {
  const base = appUrl();
  const payload = {
    volunteer_name: args.volunteerName,
    event_title: args.eventTitle,
    event_link: `${base}/event/${args.eventId}`,
    organiser_name: args.organiserName || "",
    logo_url: `${base}/branding/logo.png`,
  };
  try {
    await send("NEXT_PUBLIC_EMAILJS_TEMPLATE_APPROVAL", payload);
  } catch {}
}

export async function sendOnCertificate(args: {
  volunteerName: string;
  eventTitle: string;
  certificateUrl: string;
  verificationCode: string;
}) {
  const base = appUrl();
  const payload = {
    volunteer_name: args.volunteerName,
    event_title: args.eventTitle,
    certificate_url: args.certificateUrl,
    verify_url: `${base}/verify/${args.verificationCode}`,
    logo_url: `${base}/branding/logo.png`,
  };
  try {
    await send("NEXT_PUBLIC_EMAILJS_TEMPLATE_CERTIFICATE", payload);
  } catch {}
}
