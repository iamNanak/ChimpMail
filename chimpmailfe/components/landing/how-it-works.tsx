import { Section } from "./section";
import { STEPS } from "./data";

export function HowItWorks() {
  return (
    <Section
      id="how"
      eyebrow="How it works"
      title="Three steps. That's the whole product."
    >
      <ol className="grid gap-6 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            className="flex flex-col gap-3 border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Icon size={28} weight="bold" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Step {i + 1}
              </span>
            </div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
