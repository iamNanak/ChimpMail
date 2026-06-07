import type { EmailTemplate, Recipient } from "./templates";

export type SendResponse = {
  jobId: string;
  sent: number;
  failed: number;
  failures: { email: string; reason: string }[];
};

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(body?.error ?? "Login failed");
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchTemplates(): Promise<EmailTemplate[]> {
  const res = await fetch("/api/templates");
  if (!res.ok) throw new Error("Failed to load templates");
  return res.json();
}

export async function sendBulk(payload: {
  templateId: string;
  subject: string;
  recipients: Recipient[];
}): Promise<SendResponse> {
  const res = await fetch("/api/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await safeJson(res);
    throw new Error(body?.error ?? `Send failed (${res.status})`);
  }
  return res.json();
}

async function safeJson(res: Response): Promise<{ error?: string } | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
