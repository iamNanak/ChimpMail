import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default async function Home() {
  const store = await cookies();
  const isAuthed = store.has(SESSION_COOKIE);

  return (
    <div className="flex flex-1 flex-col">
      <LandingNav isAuthed={isAuthed} />
      <main className="flex-1">
        <Hero isAuthed={isAuthed} />
        <Features />
        <HowItWorks />
        <CTA isAuthed={isAuthed} />
      </main>
      <Footer />
    </div>
  );
}
