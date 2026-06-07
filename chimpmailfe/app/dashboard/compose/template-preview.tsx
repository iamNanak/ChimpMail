"use client";

import { renderTemplate, type EmailTemplate, type Recipient } from "@/lib/templates";

const SAMPLE: Recipient = { name: "Jane Doe", email: "jane@example.com" };

export function TemplatePreview({
  template,
  recipient,
}: {
  template: EmailTemplate;
  recipient?: Recipient;
}) {
  const html = renderTemplate(template.html, recipient ?? SAMPLE);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Preview</span>
        <span>
          for{" "}
          <code>
            {(recipient ?? SAMPLE).name} &lt;{(recipient ?? SAMPLE).email}&gt;
          </code>
        </span>
      </div>
      <iframe
        title="email preview"
        srcDoc={html}
        sandbox=""
        className="w-full min-h-[320px] rounded-md border bg-white"
      />
    </div>
  );
}
