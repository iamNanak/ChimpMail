import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start";
  return (
    <section
      id={id}
      className={cn("border-b border-border", className)}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        {(eyebrow || title || description) && (
          <div className={cn("flex flex-col gap-3 mb-10", alignCls)}>
            {eyebrow && (
              <span className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-2xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base text-muted-foreground max-w-xl">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
