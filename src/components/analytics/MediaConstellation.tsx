import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "var(--primary)" },
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" }, // Amber
  { label: "Games", value: 20, count: 2, color: "oklch(0.65 0.15 150)" }, // Emerald Green
  { label: "Journals", value: 10, count: 8, color: "oklch(0.65 0.18 330)" }, // Rose Pink
];

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  
  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  return (
    <PremiumGlass className="relative flex flex-col md:flex-row items-center gap-12 p-8 md:p-12 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none opacity-[0.08]"
        style={{ 
          background: `radial-gradient(circle at 30% 50%, ${activeItem?.color || 'transparent'}, transparent 60%)`,
          WebkitMaskImage: 'radial-gradient(closest-side at 50% 50%, black 70%, transparent 100%)',
          maskImage: 'radial-gradient(closest-side at 50% 50%, black 70%, transparent 100%)'
        }}
      />
      
      {/* Neon Glass Tubes Section */}
      <div className="relative flex items-end justify-center gap-4 sm:gap-6 h-[280px] shrink-0 w-full md:w-auto z-10">
        {CONSTELLATION_DATA.map((item, i) => {
          const isHovered = hovered === item.label || hovered === null;
          const isSpecificallyHovered = hovered === item.label;
          return (
            <div 
              key={item.label}
              className={`relative w-12 sm:w-16 h-full rounded-full border bg-black/40 overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] cursor-pointer transition-all duration-300 ${isSpecificallyHovered ? 'border-white/30 scale-[1.02]' : 'border-white/5'}`}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              style={{ opacity: isHovered ? 1 : 0.3 }}
            >
              {/* Glass glare effect (front curve reflection) */}
              <div className="absolute inset-x-2 top-2 bottom-2 rounded-full bg-gradient-to-r from-white/15 via-transparent to-transparent pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-1 w-[2px] rounded-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-20" />

              {/* Inner Neon Liquid Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${item.value}%` }}
                transition={{ duration: 1.5, delay: i * 0.1, type: "spring", bounce: 0.35 }}
                className="absolute bottom-0 left-0 right-0 w-full z-10"
                style={{
                   background: `linear-gradient(to top, ${item.color}20, ${item.color})`,
                   boxShadow: isSpecificallyHovered ? `0 -10px 40px ${item.color}` : `0 -4px 20px ${item.color}60`
                }}
              >
                {/* Liquid surface tension / specular highlight */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/90 to-transparent rounded-t-[100%] opacity-90" />
                <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full bg-white shadow-[0_0_10px_white]" />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Readout & Legend Section */}
      <div className="flex flex-col gap-6 flex-1 z-10 min-w-[240px]">
        
        {/* Huge Holographic Readout */}
        <div className="flex items-end h-28">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeItem?.label || 'default'}
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col"
            >
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-2 font-bold">
                {activeItem?.label}
              </div>
              <div className="flex items-baseline gap-3">
                <div 
                  className="font-display text-7xl tracking-tighter leading-none drop-shadow-xl" 
                  style={{ color: activeItem?.color, textShadow: `0 0 40px ${activeItem?.color}80, 0 0 15px ${activeItem?.color}` }}
                >
                  {activeItem?.value}%
                </div>
                <div className="text-sm text-muted-foreground font-semibold tracking-wide uppercase opacity-80">
                  {activeItem?.count} Entries
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent my-2" />
        
        {/* Tactile Legend */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {CONSTELLATION_DATA.map((item) => {
            const isHovered = hovered === item.label;
            return (
              <div 
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer group border ${isHovered ? 'bg-white/10 border-white/10 scale-105' : 'border-transparent hover:bg-white/[0.04]'}`}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125" 
                  style={{ 
                    background: item.color, 
                    boxShadow: isHovered ? `0 0 16px ${item.color}, 0 0 32px ${item.color}` : `0 0 10px ${item.color}60` 
                  }} 
                />
                <div className="flex-1">
                  <div className={`text-xs font-bold tracking-wide uppercase transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/80'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{item.count} items</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
