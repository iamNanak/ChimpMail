import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <EnvelopeSimple size={18} weight="bold" />
          <span className="font-bold">ChimpMail</span>
          <span className="text-muted-foreground">
            · Bulk email, built on Go.
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm hover:bg-primary hover:text-primary-foreground px-2 py-1"
        >
          <GithubLogo size={18} weight="bold" />
          View source
        </a>
      </div>
    </footer>
  );
}
