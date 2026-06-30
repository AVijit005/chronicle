import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SceneSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  align = "left",
  className,
}: Props) {
  return (
    <section id={id} className={`relative px-6 py-28 md:px-10 md:py-36 ${className ?? ""}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || intro) && (
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
          >
            {eyebrow && (
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/90">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                {title}
              </h2>
            )}
            {intro && <p className="mt-5 text-base text-muted-foreground md:text-lg">{intro}</p>}
          </motion.div>
        )}

        <div className="mt-14">{children}</div>
      </div>

      {/* soft bleed to next */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(180deg, transparent, oklch(0.14 0.012 270 / 0.6))" }}
      />
    </section>
  );
}
