import { motion } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "oklch(0.65 0.2 250)" }, // Bright Blue
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" }, // Amber
  { label: "Games", value: 20, count: 2, color: "oklch(0.65 0.15 150)" }, // Emerald Green
  { label: "Journals", value: 10, count: 8, color: "oklch(0.65 0.18 330)" }, // Rose Pink
];

// Map data to physical star coordinates and sizes
const STARS = [
  { ...CONSTELLATION_DATA[0], cx: 140, cy: 110, r: 38 }, // Movies
  { ...CONSTELLATION_DATA[1], cx: 280, cy: 70, r: 28 }, // Books
  { ...CONSTELLATION_DATA[2], cx: 240, cy: 240, r: 24 }, // Games
  { ...CONSTELLATION_DATA[3], cx: 70, cy: 230, r: 16 }, // Journals
];

// Define the connections between stars (lines)
const CONNECTIONS = [
  [0, 1], // Movies to Books
  [0, 2], // Movies to Games
  [0, 3], // Movies to Journals
  [1, 2], // Books to Games
  [2, 3], // Games to Journals
];

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);

  const activeItem = hovered ? CONSTELLATION_DATA.find(d => d.label === hovered) : CONSTELLATION_DATA[0];

  return (
    <PremiumGlass className="relative flex flex-col md:flex-row items-center justify-between gap-12 p-8 md:p-12 overflow-hidden min-h-[440px]">
      
      {/* Deep Space Ambient Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-out pointer-events-none opacity-[0.15]"
        style={{ 
          background: `radial-gradient(circle at 40% 50%, ${activeItem?.color || 'transparent'} 0%, transparent 60%)`,
        }}
      />
      
      {/* Star Map Section */}
      <div className="relative flex items-center justify-center shrink-0 w-full md:w-auto z-10">
        
        {/* The Constellation Canvas */}
        <motion.svg 
          width="360" height="320" viewBox="0 0 360 320" 
          className="relative z-10 overflow-visible"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Distant background stars (deterministic positions) */}
          {[...Array(30)].map((_, i) => {
            const seed = (i * 997) % 1000;
            const x = (seed / 1000) * 360;
            const y = ((seed * 73) % 1000 / 1000) * 320;
            return (
              <circle
                key={`bg-${i}`}
                cx={x} cy={y}
                r={seed % 3 === 0 ? 1.5 : 0.8}
                fill="white"
                opacity={(seed % 100) / 200 + 0.1}
                className="animate-pulse"
                style={{ animationDelay: `${(seed % 5)}s`, animationDuration: `${3 + (seed % 4)}s` }}
              />
            );
          })}

          {/* Glowing Laser Connections */}
          {CONNECTIONS.map(([i, j], idx) => {
            const s1 = STARS[i];
            const s2 = STARS[j];
            const isConnected = hovered === s1.label || hovered === s2.label;
            const isDimmed = hovered !== null && !isConnected;
            
            // If connected to hovered, color line with hovered star's color
            const lineColor = isConnected ? (hovered === s1.label ? s1.color : s2.color) : "white";

            return (
              <motion.line
                key={`line-${idx}`}
                x1={s1.cx} y1={s1.cy} 
                x2={s2.cx} y2={s2.cy}
                stroke={lineColor}
                strokeWidth={isConnected ? 3 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isDimmed ? 0.05 : isConnected ? 0.8 : 0.2 }}
                transition={{ pathLength: { duration: 1.5, delay: idx * 0.15 }, opacity: { duration: 0.5 } }}
                style={{ filter: isConnected ? `drop-shadow(0 0 10px ${lineColor})` : 'none' }}
                className="transition-colors duration-500"
              />
            );
          })}

          {/* The Data Stars */}
          {STARS.map((star, i) => {
            const isHovered = hovered === star.label;
            const isDimmed = hovered !== null && !isHovered;
            
            return (
              <motion.g 
                key={star.label}
                onMouseEnter={() => setHovered(star.label)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: isDimmed ? 0.2 : 1 }}
                transition={{ scale: { type: "spring", bounce: 0.5, delay: 0.5 + i * 0.1 }, opacity: { duration: 0.4 } }}
              >
                {/* Hit Area */}
                <circle cx={star.cx} cy={star.cy} r={star.r + 20} fill="transparent" />
                
                {/* Outer Glow Core */}
                <circle 
                  cx={star.cx} cy={star.cy} 
                  r={isHovered ? star.r + 6 : star.r} 
                  fill={star.color} 
                  style={{ filter: `drop-shadow(0 0 ${isHovered ? 40 : 20}px ${star.color})` }}
                  className="transition-all duration-500"
                />
                
                {/* Inner White Hot Core */}
                <circle 
                  cx={star.cx} cy={star.cy} 
                  r={star.r * (isHovered ? 0.5 : 0.35)} 
                  fill="white" 
                  opacity={0.9} 
                  className="transition-all duration-500"
                />
                
                {/* Floating Label */}
                <text
                  x={star.cx} y={star.cy + star.r + 24}
                  textAnchor="middle"
                  fill="white"
                  className={`font-bold text-[10px] tracking-[0.2em] uppercase pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                >
                  {star.label}
                </text>
                
                {/* Floating Value */}
                <text
                  x={star.cx} y={star.cy + star.r + 40}
                  textAnchor="middle"
                  fill="white"
                  className={`font-display text-sm pointer-events-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-50'}`}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                >
                  {star.value}%
                </text>
              </motion.g>
            );
          })}
        </motion.svg>
      </div>

      {/* Legend / Control Panel Section */}
      <div className="flex flex-col gap-6 flex-1 z-10 w-full max-w-sm">
        <div>
          <h3 className="font-display text-3xl mb-2 text-foreground/90 tracking-tight">Digital Cosmos</h3>
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            Your media consumption mapped as a physical constellation. Hover over the stars to reveal your focus.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 mt-4">
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
                      transform: isHovered ? 'scale(1.4)' : 'scale(1)'
                    }} 
                  />
                  <div className={`text-xs font-bold tracking-widest uppercase transition-colors ${isHovered ? 'text-foreground' : 'text-foreground/80'}`}>
                    {item.label}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{item.count} items</div>
                  <div className="text-xl font-display font-semibold w-12 text-right text-foreground/90">{item.value}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PremiumGlass>
  );
}
