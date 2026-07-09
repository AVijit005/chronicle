import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "oklch(0.65 0.2 250)" }, // Bright Blue
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" }, // Amber
  { label: "Games", value: 20, count: 2, color: "oklch(0.65 0.15 150)" }, // Emerald Green
  { label: "Journals", value: 10, count: 8, color: "oklch(0.65 0.18 330)" }, // Rose Pink
];

// Mathematically perfect cubic bezier sine waves
const generateWave = (w: number, A: number, y: number, height: number) => {
  let d = `M 0 ${height} L 0 ${y} `;
  // 4 full waves to ensure a flawless CSS translation loop
  for(let i=0; i<4; i++) {
    const s = i * w;
    d += `C ${s + w/8} ${y - A}, ${s + 3*w/8} ${y - A}, ${s + w/2} ${y} `;
    d += `C ${s + 5*w/8} ${y + A}, ${s + 7*w/8} ${y + A}, ${s + w} ${y} `;
  }
  d += `L ${w*4} ${height} Z`;
  return d;
};

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  
  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  // Sort descending by value so taller waves render in the back (first)
  const sortedData = [...CONSTELLATION_DATA].sort((a, b) => b.value - a.value);

  return (
    <PremiumGlass className="relative flex flex-col p-8 md:p-10 overflow-hidden min-h-[380px]">
      
      {/* Dynamic Background Aura */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-out pointer-events-none opacity-[0.1]"
        style={{ 
          background: `radial-gradient(circle at 20% 80%, ${activeItem?.color || 'transparent'}, transparent 70%)`,
        }}
      />
      
      {/* Background Liquid Data Waves */}
      <div className="absolute inset-x-0 bottom-0 h-[240px] w-full z-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 240">
          <defs>
            {sortedData.map((item, index) => (
              <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1" key={`grad-${item.label}`}>
                <stop offset="0%" stopColor={item.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {sortedData.map((item, index) => {
            const isHovered = hovered === item.label;
            const isDimmed = hovered !== null && !isHovered;

            // Wave physics based on data
            const w = 500 + (index * 120); 
            const A = (item.value / 100) * 80 + 10;
            const y = 200 - (item.value / 100) * 120; // Base height

            const d = generateWave(w, A, y, 240);

            return (
              <motion.path
                key={item.label}
                d={d}
                fill={`url(#gradient-${index})`}
                stroke={item.color}
                strokeWidth={isHovered ? "4" : "2"}
                animate={{ x: [0, -w] }}
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 15 + (index * 6) // Smooth flowing animation
                }}
                style={{
                  opacity: isDimmed ? 0.05 : isHovered ? 1 : 0.8,
                  filter: isHovered ? `drop-shadow(0 -4px 16px ${item.color})` : 'none'
                }}
                className="transition-all duration-700 cursor-pointer pointer-events-auto"
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Content Layer (Z-10) */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10 h-full w-full pointer-events-none">
        
        {/* Left Side: Dynamic Readout */}
        <div className="flex flex-col w-full md:w-1/2 h-full pointer-events-auto mt-2">
          <div>
            <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-sm mb-6">
              A beautifully fluid breakdown of your media consumption. Hover over the liquid data waves to explore your focus.
            </p>
          </div>

          <div className="mt-auto pt-10 md:pt-20">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeItem?.label || 'default'}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col"
              >
                <div className="text-[12px] uppercase tracking-[0.3em] text-muted-foreground/80 mb-2 font-bold">
                  {activeItem?.label}
                </div>
                <div className="flex items-baseline gap-3">
                  <div 
                    className="font-display text-8xl tracking-tighter leading-none" 
                    style={{ 
                      color: activeItem?.color, 
                      textShadow: `0 0 40px ${activeItem?.color}80, 0 0 10px ${activeItem?.color}` 
                    }}
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
        </div>

        {/* Right Side: The Legend Grid */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-[320px] pointer-events-auto self-end md:self-start mt-12 md:mt-0">
          {CONSTELLATION_DATA.map((item) => {
            const isHovered = hovered === item.label;
            return (
              <div 
                key={item.label}
                className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group border ${isHovered ? 'bg-white/10 border-white/10 scale-105 shadow-xl' : 'border-transparent hover:bg-white/[0.04]'}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
