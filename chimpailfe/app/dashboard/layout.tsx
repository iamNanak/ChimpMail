import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { Mail } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const email = store.get(SESSION_COOKIE)?.value ?? "";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span className="font-semibold">ChimpMail</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">{email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
