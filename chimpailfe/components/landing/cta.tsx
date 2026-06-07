import Link from "next/link";
import { ArrowRight, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { buttonVariants } from "@/components/ui/button";

export function CTA({ isAuthed }: { isAuthed: boolean }) {
  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-xl">
            Ready to send your first batch?
          </h2>
          <p className="text-sm opacity-80 max-w-md">
            Sign in with any email — the auth is a stub until we wire the real one.
          </p>
        </div>
        <Link
          href={isAuthed ? "/dashboard" : "/login"}
          className={buttonVariants({ size: "lg", variant: "secondary" })}
        >
          <PaperPlaneTilt size={18} weight="bold" />
          {isAuthed ? "Open dashboard" : "Sign in"}
          <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
