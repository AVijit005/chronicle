import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { CALENDAR_INSIGHTS } from "@/lib/analytics-mock";
import { toast } from "sonner";

export function CalendarInsights() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CALENDAR_INSIGHTS.map((line, i) => (
          <PremiumGlass
            key={i}
            interactive
            variant="subtle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-start gap-4 p-5 cursor-pointer press-scale relative z-10"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06]">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-foreground/90">{line}</p>
          </PremiumGlass>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <PremiumButton variant="secondary" size="sm" onClick={() => toast.info("Export coming soon.")}>
          Export year as image
        </PremiumButton>
      </div>
    </>
  );
}
