import { motion } from "motion/react";
import { SceneSection } from "./SceneSection";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { CountUp } from "@/components/analytics/AnalyticsKit";

const TESTIMONIALS = [
  { quote: "It replaced Letterboxd, Goodreads, and Backloggd for me. It's so quiet and beautiful.", author: "Alex", role: "Designer" },
  { quote: "Finally, a place to log what I play and read without it feeling like a competition.", author: "Sam", role: "Software Engineer" },
  { quote: "The timeline feature makes me actually want to reflect on the media I consume.", author: "Taylor", role: "Writer" },
];

export function TestimonialSection() {
  return (
    <SceneSection eyebrow="Stories" title="Join the quiet corner of the internet.">
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <PremiumGlass className="flex h-full flex-col p-8">
                <div className="flex-1 font-display text-2xl text-foreground">"{t.quote}"</div>
                <div className="mt-8 text-sm text-muted-foreground">
                  <span className="text-foreground">{t.author}</span> · {t.role}
                </div>
              </PremiumGlass>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Currently tracking</div>
          <div className="mt-2 font-display text-5xl">
            <CountUp to={12400} /> <span className="text-2xl text-muted-foreground">stories</span>
          </div>
          {/* Note: In a full production setup, 12400 would be fetched via React Query from an API */}
        </motion.div>
      </div>
    </SceneSection>
  );
}
