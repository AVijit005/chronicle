import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Route } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";

interface Props {
  journey?: any;
  mediaId?: string;
}

export function JourneyContinuity({ journey }: Props) {
  const steps = journey?.steps || [
    { id: "1", title: "The Fellowship of the Ring", year: "2001", poster: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=300&auto=format&fit=crop" },
    { id: "2", title: "The Two Towers", year: "2002", poster: "https://images.unsplash.com/photo-1596727147705-611529ea271b?q=80&w=300&auto=format&fit=crop" },
    { id: "3", title: "The Return of the King", year: "2003", poster: "https://images.unsplash.com/photo-1542360663-8f40838b8d7a?q=80&w=300&auto=format&fit=crop" },
  ];

  return (
    <PremiumGlass className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[oklch(0.72_0.18_255)]">
          <Route size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl tracking-tight">Franchise Journey</h3>
          <p className="text-xs text-muted-foreground">Your path through Middle-earth</p>
        </div>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 bg-white/10 hidden sm:block" />

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-between relative z-10">
          {steps.map((step: any, i: number) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex-1 flex flex-row sm:flex-col items-center gap-4 group"
            >
              <div className="w-16 sm:w-full max-w-[120px] aspect-[2/3] shrink-0 overflow-hidden rounded-lg relative">
                <img src={step.poster} alt={step.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-lg pointer-events-none" />
              </div>
              <div className="flex flex-col sm:items-center sm:text-center mt-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{step.year}</span>
                <span className="text-sm font-medium leading-tight">{step.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
