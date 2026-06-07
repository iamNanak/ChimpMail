import type { Icon } from "@phosphor-icons/react";
import {
  Lightning,
  Stack,
  UploadSimple,
  ChartLineUp,
  ShieldCheck,
  Code,
  ListChecks,
  PaperPlaneTilt,
  ChatCircleDots,
} from "@phosphor-icons/react/dist/ssr";

export type Feature = {
  icon: Icon;
  title: string;
  body: string;
};

export const FEATURES: Feature[] = [
  {
    icon: Lightning,
    title: "Concurrent workers",
    body: "Go worker pool fans recipients out across goroutines. Add workers, send faster.",
  },
  {
    icon: Stack,
    title: "Templates built-in",
    body: "Welcome, Newsletter, Announcement — all variable-interpolated HTML, ready to use.",
  },
  {
    icon: UploadSimple,
    title: "CSV / paste / manual",
    body: "Three ways to load recipients. Invalid rows flagged, duplicates removed automatically.",
  },
  {
    icon: ChartLineUp,
    title: "Job history",
    body: "Every send is logged with sent / failed counts and the failure reasons.",
  },
  {
    icon: ShieldCheck,
    title: "Validated at the edge",
    body: "Emails are checked before send. Subject required. Zero-recipient sends are blocked.",
  },
  {
    icon: Code,
    title: "Swap to your SMTP",
    body: "Frontend talks to a clean JSON contract. Point it at any backend — Mailpit, SES, your own.",
  },
];

export type Step = {
  icon: Icon;
  title: string;
  body: string;
};

export const STEPS: Step[] = [
  {
    icon: ListChecks,
    title: "Load recipients",
    body: "Drop in a Name,Email CSV, paste a list, or add them one by one.",
  },
  {
    icon: ChatCircleDots,
    title: "Pick a template",
    body: "Choose a template, tweak the subject, preview against a real recipient.",
  },
  {
    icon: PaperPlaneTilt,
    title: "Send the batch",
    body: "Confirm, watch the workers do their thing, review the job in history.",
  },
];
