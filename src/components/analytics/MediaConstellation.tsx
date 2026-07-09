import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "oklch(0.65 0.2 250)" }, // Bright Blue
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" }, // Amber
  { label: "Games", value: 20, count: 2, color: "oklch(0.65 0.15 150)" }, // Emerald Green
  { label: "Journals", value: 10, count: 8, color: "oklch(0.65 0.18 330)" }, // Rose Pink
];

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  return (
    <PremiumGlass className="relative flex flex-col p-6 md:p-10 overflow-hidden min-h-[420px]">
      
      {/* Background Ambient Aura */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-out pointer-events-none opacity-[0.08]"
        style={{ 
          background: `radial-gradient(ellipse at 50% 0%, ${activeItem?.color || 'transparent'}, transparent 70%)`,
        }}
      />
      
      {/* Top Section: The Huge Readout */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-2 pb-8 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeItem?.label || 'default'}
            initial={{ opacity: 0, y: 15, filter: "blur(8px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: "blur(8px)", scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground/80 mb-4">
              {activeItem?.label}
            </div>
            <div className="flex items-baseline gap-4">
              <div 
                className="font-display text-8xl md:text-9xl tracking-tighter leading-none" 
                style={{ 
                  color: "white", 
                  textShadow: `0 0 60px ${activeItem?.color}, 0 4px 20px rgba(0,0,0,0.6)` 
                }}
              >
                {activeItem?.value}%
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mt-5 opacity-80">
              {activeItem?.count} entries logged
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Middle Section: The Tactical Lightbar */}
      <div className="relative z-10 w-full flex items-center h-24 my-6">
        <div className="w-full flex items-center gap-2 md:gap-3 h-full">
          {CONSTELLATION_DATA.map((item) => {
            const isHovered = hovered === item.label;
            const isDimmed = hovered !== null && !isHovered;
            
            return (
              <motion.div
                key={item.label}
                className="relative rounded-full cursor-pointer overflow-hidden origin-center"
                style={{ width: `${item.value}%` }}
                initial={{ height: 16, opacity: 0 }}
                animate={{ 
                  height: isHovered ? 64 : (hovered ? 12 : 24),
                  opacity: isDimmed ? 0.25 : 1,
                  filter: isHovered ? `drop-shadow(0 0 24px ${item.color}80)` : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
                }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Glass Inner Styling */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    background: `linear-gradient(to bottom, ${item.color} 0%, color-mix(in srgb, ${item.color} 40%, black) 100%)`,
                    boxShadow: `inset 0 2px 6px rgba(255,255,255,0.4), inset 0 -6px 12px rgba(0,0,0,0.6)`
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: The Legend Grid */}
      <div className="relative z-10 mt-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
        {CONSTELLATION_DATA.map((item) => {
          const isHovered = hovered === item.label;
          return (
            <div 
              key={item.label}
              className={`flex flex-col gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${isHovered ? 'bg-white/10 border-white/10 shadow-xl scale-105' : 'border-transparent hover:bg-white/[0.04]'}`}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-300" 
                  style={{ 
                    background: item.color, 
                    boxShadow: isHovered ? `0 0 12px ${item.color}, 0 0 24px ${item.color}` : `0 0 8px ${item.color}60`,
                    transform: isHovered ? 'scale(1.5)' : 'scale(1)'
                  }} 
                />
                <div className={`text-xs font-bold tracking-widest uppercase transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/70'}`}>
                  {item.label}
                </div>
              </div>
              <div className="flex items-end justify-between mt-1">
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.count} items</div>
                <div className="text-2xl font-display font-semibold text-foreground/90">{item.value}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </PremiumGlass>
  );
}
