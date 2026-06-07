import type { Recipient } from "./templates";

export type ParsedRow = {
  name: string;
  email: string;
  valid: boolean;
  reason?: string;
};

export type ParseResult = {
  rows: ParsedRow[];
  duplicates: number;
  parseErrors: { line: number; reason: string }[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_RE.test(s.trim());
}

export function parseCsv(text: string): ParseResult {
  const parseErrors: { line: number; reason: string }[] = [];
  const lines = splitLines(text);
  if (lines.length === 0) {
    return { rows: [], duplicates: 0, parseErrors: [{ line: 0, reason: "File is empty" }] };
  }

  const header = parseCsvLine(lines[0]);
  const nameIdx = header.findIndex((h) => h.trim().toLowerCase() === "name");
  const emailIdx = header.findIndex((h) => h.trim().toLowerCase() === "email");
  if (emailIdx === -1) {
    return {
      rows: [],
      duplicates: 0,
      parseErrors: [{ line: 1, reason: "Header must include an 'Email' column" }],
    };
  }

  const collected: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (raw.trim() === "") continue;
    let cells: string[];
    try {
      cells = parseCsvLine(raw);
    } catch (e) {
      parseErrors.push({ line: i + 1, reason: (e as Error).message });
      continue;
    }
    const email = (cells[emailIdx] ?? "").trim();
    const name = nameIdx >= 0 ? (cells[nameIdx] ?? "").trim() : "";
    const valid = isValidEmail(email);
    collected.push({
      name: name || email,
      email,
      valid,
      reason: valid ? undefined : "Invalid email",
    });
  }

  return dedupe(collected, parseErrors);
}

export function parsePastedText(text: string): ParseResult {
  const parseErrors: { line: number; reason: string }[] = [];
  const collected: ParsedRow[] = [];
  const lines = splitLines(text);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (raw === "") continue;
    // Accept "Name, email" or just "email"
    const commaIdx = raw.lastIndexOf(",");
    let name = "";
    let email = raw;
    if (commaIdx >= 0) {
      name = raw.slice(0, commaIdx).trim();
      email = raw.slice(commaIdx + 1).trim();
    }
    const valid = isValidEmail(email);
    collected.push({
      name: name || email,
      email,
      valid,
      reason: valid ? undefined : "Invalid email",
    });
  }
  return dedupe(collected, parseErrors);
}

function dedupe(
  rows: ParsedRow[],
  parseErrors: { line: number; reason: string }[],
): ParseResult {
  const seen = new Set<string>();
  const out: ParsedRow[] = [];
  let duplicates = 0;
  for (const r of rows) {
    const key = r.email.toLowerCase();
    if (key && seen.has(key)) {
      duplicates++;
      continue;
    }
    if (key) seen.add(key);
    out.push(r);
  }
  return { rows: out, duplicates, parseErrors };
}

export function validRecipients(rows: ParsedRow[]): Recipient[] {
  return rows.filter((r) => r.valid).map((r) => ({ name: r.name, email: r.email }));
}

function splitLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        if (cur.length > 0) throw new Error("Unexpected quote inside unquoted field");
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  if (inQuotes) throw new Error("Unterminated quoted field");
  out.push(cur);
  return out;
}
