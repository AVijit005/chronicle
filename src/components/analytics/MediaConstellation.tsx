import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "var(--primary)" },
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" },
  { label: "Games", value: 20, count: 2, color: "oklch(0.7 0.15 250)" },
  { label: "Journals", value: 10, count: 8, color: "oklch(0.6 0.1 180)" },
];

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);

  const size = 260;
  const stroke = 12;
  const pad = 24;
  const svgSize = size + pad * 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  
  let currentOffset = 0;
  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  return (
    <PremiumGlass className="relative flex flex-col md:flex-row items-center gap-10 p-8 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none opacity-[0.08]"
        style={{ background: `radial-gradient(circle at 30% 50%, ${activeItem?.color || 'transparent'}, transparent 60%)` }}
      />
      
      {/* Chart Section */}
      <div className="relative flex items-center justify-center" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90 relative z-10" style={{ overflow: "visible" }}>
          {/* Track background */}
          <circle cx={svgSize / 2} cy={svgSize / 2} r={r} stroke="oklch(1 0 0 / 0.04)" strokeWidth={stroke} fill="none" />
          
          {CONSTELLATION_DATA.map((item, i) => {
            const fraction = item.value / 100;
            const segment = c * fraction;
            // Gap between segments
            const gap = 6;
            const dash = Math.max(0, segment - gap);
            const isHovered = hovered === item.label || hovered === null;
            
            const circle = (
              <motion.circle
                key={item.label}
                cx={svgSize / 2}
                cy={svgSize / 2}
                r={r}
                stroke={item.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-currentOffset}
                initial={{ strokeDashoffset: c }}
                whileInView={{ strokeDashoffset: -currentOffset }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ 
                  opacity: isHovered ? 1 : 0.25, 
                  filter: hovered === item.label ? `drop-shadow(0 0 12px ${item.color})` : 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
            currentOffset += segment;
            return circle;
          })}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 grid place-items-center text-center pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeItem?.label || 'default'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                {activeItem?.label}
              </div>
              <div className="font-display text-5xl tracking-tight leading-none" style={{ color: activeItem?.color, textShadow: `0 0 24px ${activeItem?.color}80` }}>
                {activeItem?.value}%
              </div>
              <div className="text-[11px] text-muted-foreground mt-2 font-medium tracking-wide uppercase">
                {activeItem?.count} Entries
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend / Info Section */}
      <div className="flex flex-col gap-4 flex-1 z-10">
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-sm">
            A beautiful breakdown of your digital universe this month. Hover over the orbital rings to explore your focus.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {CONSTELLATION_DATA.map((item) => (
            <div 
              key={item.label}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer group ${hovered === item.label ? 'bg-white/10' : 'hover:bg-white/[0.04]'}`}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-125" 
                style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} 
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground/90 tracking-wide uppercase">{item.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{item.count} items</div>
              </div>
              <div className="text-sm font-display text-foreground/80">{item.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
