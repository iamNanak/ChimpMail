import Link from "next/link";
import { EnvelopeSimple, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { buttonVariants } from "@/components/ui/button";

export function LandingNav({ isAuthed }: { isAuthed: boolean }) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-30">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <EnvelopeSimple size={22} weight="bold" />
          <span>ChimpMail</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-primary-foreground hover:bg-primary px-2 py-1">Features</a>
          <a href="#how" className="hover:text-primary-foreground hover:bg-primary px-2 py-1">How it works</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary-foreground hover:bg-primary px-2 py-1">GitHub</a>
        </nav>
        <Link
          href={isAuthed ? "/dashboard" : "/login"}
          className={buttonVariants({ size: "sm" })}
        >
          {isAuthed ? "Open dashboard" : "Sign in"}
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </header>
  );
}
