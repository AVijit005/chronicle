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

  // Math for the flawless Tactile Pill Ring
  const svgSize = 340;
  const baseStroke = 28;
  const hoverStroke = 40;
  const pad = 24;
  const r = (svgSize - hoverStroke) / 2 - pad;
  const c = 2 * Math.PI * r;
  const visualGap = 20; // Exact pixel gap between capsules

  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];
  let currentOffset = 0;

  return (
    <PremiumGlass className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16 p-8 md:p-12 overflow-hidden min-h-[420px]">
      
      {/* Soft Ambient Aura */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none opacity-[0.06]"
        style={{ 
          background: `radial-gradient(circle at 30% 50%, ${activeItem?.color || 'transparent'}, transparent 70%)`,
        }}
      />
      
      {/* Chart Section */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: svgSize, height: svgSize }}>
        
        {/* Background Track (Glass depth) */}
        <div className="absolute inset-4 rounded-full border border-white/5 bg-black/10 shadow-[inset_0_4px_24px_rgba(0,0,0,0.5)] pointer-events-none" />

        <svg width={svgSize} height={svgSize} className="-rotate-90 relative z-10" style={{ overflow: "visible" }}>
          
          {CONSTELLATION_DATA.map((item, i) => {
            const fraction = item.value / 100;
            const segmentLength = c * fraction;
            
            // Calculate dash so that the visible capsule (dash + stroke) leaves exactly `visualGap` space
            // Because linecaps add stroke/2 on both sides, visible length = dash + stroke.
            let dash = segmentLength - visualGap - baseStroke;
            dash = Math.max(0, dash); // Prevent negative dashes for tiny values
            
            const isHovered = hovered === item.label;
            const isDimmed = hovered !== null && !isHovered;
            
            // The starting offset for this segment
            const startOffset = currentOffset;
            currentOffset += segmentLength;

            return (
              <motion.circle
                key={item.label}
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={r}
                stroke={item.color}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                initial={{ strokeDashoffset: c, strokeWidth: baseStroke }}
                animate={{ 
                  strokeDashoffset: -startOffset,
                  strokeWidth: isHovered ? hoverStroke : baseStroke,
                }}
                transition={{ 
                  strokeDashoffset: { duration: 1.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
                  strokeWidth: { duration: 0.4, type: "spring", bounce: 0.4 }
                }}
                style={{ 
                  opacity: isDimmed ? 0.15 : 1, 
                  filter: isHovered ? `drop-shadow(0 0 24px ${item.color}80) drop-shadow(0 0 8px ${item.color})` : `drop-shadow(0 4px 8px rgba(0,0,0,0.4))`
                }}
                className="cursor-pointer transition-opacity duration-300 origin-center"
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {/* Ultra-Premium Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeItem?.label || 'default'}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/80 font-bold mb-1">
                {activeItem?.label}
              </div>
              <div 
                className="font-display text-6xl tracking-tighter leading-none mb-1" 
                style={{ 
                  color: "white", 
                  textShadow: `0 0 40px ${activeItem?.color}, 0 2px 10px rgba(0,0,0,0.5)` 
                }}
              >
                {activeItem?.value}%
              </div>
              <div className="text-xs text-muted-foreground font-medium tracking-wide">
                {activeItem?.count} entries logged
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend / Info Section */}
      <div className="flex flex-col gap-6 flex-1 z-10 w-full max-w-sm">
        <div>
          <h3 className="font-display text-2xl mb-1 text-foreground/90 tracking-tight">Your Universe</h3>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            A precise breakdown of your media consumption. Hover over the capsules to focus.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
          {CONSTELLATION_DATA.map((item) => {
            const isHovered = hovered === item.label;
            return (
              <div 
                key={item.label}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${isHovered ? 'bg-white/10 border-white/10 shadow-lg scale-[1.02]' : 'border-transparent hover:bg-white/[0.04]'}`}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3.5 h-3.5 rounded-full transition-transform duration-300" 
                    style={{ 
                      background: item.color, 
                      boxShadow: isHovered ? `0 0 16px ${item.color}, 0 0 32px ${item.color}` : `0 0 8px ${item.color}60`,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                    }} 
                  />
                  <div className={`text-sm font-bold tracking-wider uppercase transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/80'}`}>
                    {item.label}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-muted-foreground font-medium">{item.count} items</div>
                  <div className="text-lg font-display font-semibold w-10 text-right text-foreground/90">{item.value}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
