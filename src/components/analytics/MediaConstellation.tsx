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

  const svgSize = 300;
  const center = svgSize / 2;
  const maxR = 120;
  const ringSpacing = 24;
  
  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  return (
    <PremiumGlass className="relative flex flex-col md:flex-row items-center gap-10 p-8 overflow-hidden min-h-[360px]">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none opacity-[0.15]"
        style={{ 
          background: `radial-gradient(circle at 30% 50%, ${activeItem?.color || 'transparent'}, transparent 60%)`,
          WebkitMaskImage: 'radial-gradient(closest-side at 50% 50%, black 70%, transparent 100%)',
          maskImage: 'radial-gradient(closest-side at 50% 50%, black 70%, transparent 100%)'
        }}
      />
      
      {/* Orbital Chart Section */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90 relative z-10" style={{ overflow: "visible" }}>
          
          {CONSTELLATION_DATA.map((item, i) => {
            const r = maxR - (i * ringSpacing);
            const c = 2 * Math.PI * r;
            const fillPercentage = item.value / 100;
            // Add a minimum tail length so small values still look like comets
            const dashLength = Math.max(c * 0.1, c * fillPercentage); 
            
            const isHovered = hovered === item.label || hovered === null;
            const angle = (dashLength / c) * 2 * Math.PI;
            const planetX = center + r * Math.cos(angle);
            const planetY = center + r * Math.sin(angle);

            return (
              <g key={item.label}>
                {/* Hit area for hovering the orbit */}
                <circle
                  cx={center} cy={center} r={r}
                  stroke="transparent" strokeWidth={ringSpacing} fill="none"
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                />
                
                {/* Faint orbit track */}
                <circle 
                  cx={center} cy={center} r={r} 
                  stroke="white" 
                  strokeOpacity={isHovered ? 0.1 : 0.03} 
                  strokeWidth={isHovered ? 2 : 1} 
                  fill="none" 
                  className="transition-all duration-500 pointer-events-none"
                />

                {/* Rotating Comet & Planet */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25 + (i * 12), // Outer rings rotate faster, inner slower
                    repeat: Infinity,
                    ease: "linear",
                    direction: i % 2 === 0 ? "normal" : "reverse" // Counter-rotating logic
                  }}
                  style={{ transformOrigin: "center" }}
                  className="pointer-events-none"
                >
                  <circle
                    cx={center} cy={center} r={r}
                    stroke={item.color}
                    strokeWidth={isHovered ? 6 : 3}
                    strokeDasharray={`${dashLength} ${c - dashLength}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    fill="none"
                    style={{ 
                      opacity: isHovered ? 1 : 0.15,
                      filter: isHovered ? `drop-shadow(0 0 12px ${item.color})` : 'none'
                    }}
                    className="transition-all duration-500"
                  />
                  {/* Planet head */}
                  <circle
                    cx={planetX} cy={planetY}
                    r={isHovered ? 5 : 3}
                    fill="white"
                    style={{ 
                      opacity: isHovered ? 1 : 0.4,
                      filter: isHovered ? `drop-shadow(0 0 8px white) drop-shadow(0 0 16px ${item.color})` : 'none'
                    }}
                    className="transition-all duration-500"
                  />
                </motion.g>
              </g>
            );
          })}
        </svg>

        {/* Center Readout Hologram */}
        <div className="absolute inset-0 grid place-items-center text-center pointer-events-none z-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeItem?.label || 'default'}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center justify-center w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${activeItem?.color}15 0%, transparent 70%)`
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-1 font-semibold">
                {activeItem?.label}
              </div>
              <div 
                className="font-display text-5xl tracking-tighter leading-none" 
                style={{ 
                  color: activeItem?.color, 
                  textShadow: `0 0 30px ${activeItem?.color}80, 0 0 10px ${activeItem?.color}` 
                }}
              >
                {activeItem?.value}%
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend / Info Section */}
      <div className="flex flex-col gap-4 flex-1 z-10 min-w-[200px]">
        <div>
          <p className="text-sm text-muted-foreground/90 leading-relaxed mt-2 max-w-sm">
            A beautiful breakdown of your digital universe this month. Hover over the orbital rings to explore your focus.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
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
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-150" 
                  style={{ 
                    background: item.color, 
                    boxShadow: isHovered ? `0 0 12px ${item.color}, 0 0 24px ${item.color}` : `0 0 8px ${item.color}80` 
                  }} 
                />
                <div className="flex-1">
                  <div className={`text-xs font-bold tracking-wide uppercase transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/80'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{item.count} items</div>
                </div>
                <div className="text-sm font-display text-foreground/80">{item.value}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
