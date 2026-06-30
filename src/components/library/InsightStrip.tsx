import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { smartInsights } from "@/lib/library";

export function InsightStrip() {
  const items = smartInsights().slice(0, 4);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="glass-subtle flex items-start gap-3 rounded-2xl px-4 py-3"
        >
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/80" />
          <p className="text-[12px] leading-snug text-muted-foreground">{text}</p>
        </motion.div>
      ))}
    </div>
  );
}
