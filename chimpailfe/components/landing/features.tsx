import { Section } from "./section";
import { FEATURES } from "./data";

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything you need to send a batch."
      description="No drag-and-drop builder. No CRM. Just the things that matter for sending bulk email and knowing it worked."
    >
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 border border-border bg-card">
        {FEATURES.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className={
              "flex flex-col gap-3 p-6 border-border " +
              (i % 3 !== 2 ? "lg:border-r " : "") +
              (i % 2 !== 1 ? "sm:border-r lg:border-r " : "") +
              (i < FEATURES.length - 1 ? "border-b " : "")
            }
          >
            <Icon size={28} weight="bold" className="text-foreground" />
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
