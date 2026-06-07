import Link from "next/link";
import { ArrowRight, PaperPlaneTilt, Terminal } from "@phosphor-icons/react/dist/ssr";
import { Button, buttonVariants } from "@/components/ui/button";

export function Hero({ isAuthed }: { isAuthed: boolean }) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <span className="self-start text-xs uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
            Bulk email · Go workers · Brutalist UI
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
            Send a thousand emails before your coffee gets cold.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            ChimpMail pairs a Go worker pool with a no-nonsense web UI. Drop a CSV,
            pick a template, hit send. That&apos;s the whole flow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={isAuthed ? "/dashboard" : "/login"}
              className={buttonVariants({ size: "lg" })}
            >
              <PaperPlaneTilt size={18} weight="bold" />
              {isAuthed ? "Go to dashboard" : "Get started"}
              <ArrowRight size={18} weight="bold" />
            </Link>
            <a
              href="#how"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Terminal size={18} weight="bold" />
              How it works
            </a>
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative border border-border bg-card shadow-md">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/40">
        <span className="h-3 w-3 bg-destructive" />
        <span className="h-3 w-3 bg-primary" />
        <span className="h-3 w-3 bg-secondary" />
        <span className="ml-2 text-xs text-muted-foreground">chimpmail · compose</span>
      </div>
      <div className="p-5 text-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Template</span>
          <span className="bg-primary text-primary-foreground px-2 py-0.5 text-xs">Welcome</span>
        </div>
        <div className="border border-border bg-background px-3 py-2">
          <span className="text-xs text-muted-foreground">Subject</span>
          <div className="font-medium">Welcome to ChimpMail</div>
        </div>
        <div className="border border-border bg-background">
          <div className="grid grid-cols-[1fr_auto] border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Recipient</span>
            <span>Status</span>
          </div>
          {[
            ["Alice Example", "alice@example.com", "ok"],
            ["Bob Example", "bob@example.com", "ok"],
            ["Carol Example", "carol@example.com", "ok"],
            ["foo@bad", "foo@bad", "invalid"],
          ].map(([name, email, status]) => (
            <div
              key={email}
              className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 text-xs border-t border-border first:border-t-0"
            >
              <span className="truncate">
                <span className="font-medium">{name}</span>
                <span className="text-muted-foreground"> · {email}</span>
              </span>
              <span
                className={
                  status === "ok"
                    ? "text-foreground"
                    : "bg-destructive text-destructive-foreground px-1.5"
                }
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <Button size="sm" className="self-end">
          <PaperPlaneTilt size={14} weight="bold" />
          Send to 3 recipients
        </Button>
      </div>
    </div>
  );
}
