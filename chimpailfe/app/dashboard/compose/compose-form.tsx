"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { EmailTemplate, Recipient } from "@/lib/templates";
import type { ParsedRow } from "@/lib/csv";
import { isValidEmail } from "@/lib/csv";
import { sendBulk } from "@/lib/api";
import { RecipientsCsv } from "./recipients-csv";
import { RecipientsPaste } from "./recipients-paste";
import { RecipientsManual } from "./recipients-manual";
import { RecipientsTable } from "./recipients-table";
import { TemplatePreview } from "./template-preview";
import { recordJob } from "../history/history-storage";

export function ComposeForm({ templates }: { templates: EmailTemplate[] }) {
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [subject, setSubject] = useState(templates[0]?.subject ?? "");
  const [subjectDirty, setSubjectDirty] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [duplicates, setDuplicates] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const validRecipients: Recipient[] = useMemo(
    () =>
      rows.filter((r) => r.valid).map((r) => ({ name: r.name, email: r.email })),
    [rows],
  );

  function handleTemplateChange(id: string | null) {
    if (!id) return;
    setTemplateId(id);
    const next = templates.find((t) => t.id === id);
    if (next && !subjectDirty) setSubject(next.subject);
  }

  function mergeRows(incoming: ParsedRow[], incomingDuplicates: number) {
    const byEmail = new Map<string, ParsedRow>();
    for (const r of rows) byEmail.set(r.email.toLowerCase(), r);
    let dupCount = 0;
    for (const r of incoming) {
      const key = r.email.toLowerCase();
      if (key && byEmail.has(key)) {
        dupCount++;
        continue;
      }
      if (key) byEmail.set(key, r);
    }
    setRows(Array.from(byEmail.values()));
    setDuplicates(duplicates + incomingDuplicates + dupCount);
  }

  function addManual(row: ParsedRow) {
    mergeRows([row], 0);
  }

  function removeAt(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function clearAll() {
    setRows([]);
    setDuplicates(0);
  }

  const canSend =
    !!template &&
    subject.trim().length > 0 &&
    validRecipients.length > 0 &&
    !sending;

  async function doSend() {
    if (!template) return;
    setSending(true);
    try {
      const res = await sendBulk({
        templateId: template.id,
        subject: subject.trim(),
        recipients: validRecipients,
      });
      recordJob({
        jobId: res.jobId,
        timestamp: Date.now(),
        templateId: template.id,
        templateName: template.name,
        subject: subject.trim(),
        total: validRecipients.length,
        sent: res.sent,
        failed: res.failed,
        failures: res.failures,
      });
      if (res.failed === 0) {
        toast.success(`Sent ${res.sent} email${res.sent === 1 ? "" : "s"}`);
      } else {
        toast.warning(`Sent ${res.sent}, failed ${res.failed}`);
      }
      setConfirmOpen(false);
      clearAll();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  const previewRecipient =
    rows.find((r) => r.valid && isValidEmail(r.email)) ?? undefined;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Compose</CardTitle>
          <CardDescription>Choose a template and recipients.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label>Template</Label>
            <Select value={templateId} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} — <span className="text-muted-foreground">{t.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setSubjectDirty(true);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              {rows.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            <Tabs defaultValue="csv">
              <TabsList>
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="paste">Paste</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
              </TabsList>
              <TabsContent value="csv" className="pt-3">
                <RecipientsCsv onParsed={mergeRows} />
              </TabsContent>
              <TabsContent value="paste" className="pt-3">
                <RecipientsPaste onParsed={mergeRows} />
              </TabsContent>
              <TabsContent value="manual" className="pt-3">
                <RecipientsManual onAdd={addManual} />
              </TabsContent>
            </Tabs>
            <div className="pt-2">
              <RecipientsTable
                rows={rows}
                onRemove={removeAt}
                duplicates={duplicates}
              />
            </div>
          </div>

          <Button
            className="self-start"
            disabled={!canSend}
            onClick={() => setConfirmOpen(true)}
            title={
              canSend
                ? undefined
                : validRecipients.length === 0
                  ? "Add at least one valid recipient"
                  : subject.trim().length === 0
                    ? "Subject is required"
                    : undefined
            }
          >
            <Send className="h-4 w-4" />
            Send to {validRecipients.length} recipient
            {validRecipients.length === 1 ? "" : "s"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How the email will look (rendered with sample or first valid recipient).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {template ? (
            <TemplatePreview template={template} recipient={previewRecipient} />
          ) : (
            <p className="text-sm text-muted-foreground">Select a template to preview.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {template?.name}?</DialogTitle>
            <DialogDescription>
              {validRecipients.length} recipient
              {validRecipients.length === 1 ? "" : "s"} will receive this email.
              {rows.length - validRecipients.length > 0 && (
                <>
                  {" "}
                  {rows.length - validRecipients.length} invalid row
                  {rows.length - validRecipients.length === 1 ? "" : "s"} will be skipped.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={doSend} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Confirm send
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
