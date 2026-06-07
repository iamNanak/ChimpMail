export type JobRecord = {
  jobId: string;
  timestamp: number;
  templateId: string;
  templateName: string;
  subject: string;
  total: number;
  sent: number;
  failed: number;
  failures: { email: string; reason: string }[];
};

const KEY = "chimpmail_history";
const EVENT = "chimpmail_history_change";

export function loadHistory(): JobRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JobRecord[]) : [];
  } catch {
    return [];
  }
}

export function recordJob(job: JobRecord): void {
  if (typeof window === "undefined") return;
  const existing = loadHistory();
  const next = [job, ...existing].slice(0, 50);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeHistory(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

let cachedSnapshot: JobRecord[] | null = null;
let cachedRaw: string | null = null;

export function getHistorySnapshot(): JobRecord[] {
  if (typeof window === "undefined") {
    if (cachedSnapshot === null) cachedSnapshot = [];
    return cachedSnapshot;
  }
  const raw = window.localStorage.getItem(KEY);
  if (raw === cachedRaw && cachedSnapshot !== null) return cachedSnapshot;
  cachedRaw = raw;
  cachedSnapshot = loadHistory();
  return cachedSnapshot;
}

export function getServerSnapshot(): JobRecord[] {
  return [];
}
