import { getTemplate } from "@/lib/templates";

// MOCK ENDPOINT — when the Go service grows an HTTP server, replace this with
// a fetch to that service. Contract: see plan / lib/api.ts.
export async function POST(request: Request) {
  let body: {
    templateId?: unknown;
    subject?: unknown;
    recipients?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const templateId = typeof body.templateId === "string" ? body.templateId : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const recipientsRaw = Array.isArray(body.recipients) ? body.recipients : [];

  if (!getTemplate(templateId)) {
    return Response.json({ error: "Unknown templateId" }, { status: 400 });
  }
  if (!subject) {
    return Response.json({ error: "Subject is required" }, { status: 400 });
  }
  const recipients = recipientsRaw
    .map((r) => {
      if (r && typeof r === "object") {
        const obj = r as { name?: unknown; email?: unknown };
        if (typeof obj.email === "string" && obj.email) {
          return {
            name: typeof obj.name === "string" ? obj.name : "",
            email: obj.email,
          };
        }
      }
      return null;
    })
    .filter((r): r is { name: string; email: string } => r !== null);

  if (recipients.length === 0) {
    return Response.json({ error: "At least one recipient is required" }, { status: 400 });
  }

  // Simulate latency
  await new Promise((res) => setTimeout(res, 600));

  // Simulate ~3% failure rate
  const failures: { email: string; reason: string }[] = [];
  for (const r of recipients) {
    if (Math.random() < 0.03) {
      failures.push({ email: r.email, reason: "SMTP transient error (simulated)" });
    }
  }
  const sent = recipients.length - failures.length;
  return Response.json({
    jobId: `mock_${Date.now()}`,
    sent,
    failed: failures.length,
    failures,
  });
}
