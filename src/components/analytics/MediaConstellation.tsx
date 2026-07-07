import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { PremiumGlass } from "../ui/PremiumGlass";

const CONSTELLATION_DATA = [
  { label: "Movies", value: 45, count: 12, color: "var(--primary)" },
  { label: "Books", value: 25, count: 4, color: "oklch(0.65 0.18 30)" },
  { label: "Games", value: 20, count: 2, color: "oklch(0.7 0.15 250)" },
  { label: "Journals", value: 10, count: 8, color: "oklch(0.6 0.1 180)" },
];

const MEDIA_MOCK_COVERS: Record<string, string[]> = {
  Movies: [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&q=80",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&q=80",
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&q=80",
    "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=200&q=80",
    "https://images.unsplash.com/photo-1574267432553-4b4628081524?w=200&q=80",
    "https://images.unsplash.com/photo-1505686994434-e3f53857d427?w=200&q=80",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&q=80",
    "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=200&q=80",
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=200&q=80",
  ],
  Books: [
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&q=80",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&q=80",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=80",
  ],
  Games: [
    "https://images.unsplash.com/photo-1552820728-8b83bb6b7738?w=200&q=80",
    "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=200&q=80",
  ],
  Journals: [
    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&q=80",
    "https://images.unsplash.com/photo-1579017308347-e53e0d2fc5e9?w=200&q=80",
    "https://images.unsplash.com/photo-1553503136-48c227e5dc81?w=200&q=80",
    "https://images.unsplash.com/photo-1586380951230-e6703d4fdb2acd?w=200&q=80",
    "https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=200&q=80",
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86d226?w=200&q=80",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=200&q=80",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&q=80",
  ],
};

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
  const activeCovers = activeItem ? MEDIA_MOCK_COVERS[activeItem.label] : [];

  return (
    <PremiumGlass className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 overflow-hidden items-stretch">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-colors duration-700 ease-out pointer-events-none opacity-[0.08]"
        style={{ background: `radial-gradient(circle at 30% 50%, ${activeItem?.color || 'transparent'}, transparent 60%)` }}
      />
      
      {/* Left Column: Chart & Legend */}
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 relative z-10 w-full h-full">
        {/* Chart Section */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: svgSize, height: svgSize }}>
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
        <div className="flex flex-col gap-4 flex-1 z-10 w-full max-w-sm">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A beautiful breakdown of your digital universe this month. Hover over the orbital rings to explore your focus.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            {CONSTELLATION_DATA.map((item) => (
              <div 
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors cursor-pointer group ${hovered === item.label ? 'bg-white/10' : 'hover:bg-white/[0.04]'}`}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-125 shrink-0" 
                  style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} 
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-foreground/90 tracking-wide uppercase truncate">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.count} items</div>
                </div>
                <div className="text-sm font-display text-foreground/80 shrink-0">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Media Matrix Grid */}
      <div className="relative z-10 flex flex-col justify-center h-full">
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-foreground/70 tracking-[0.2em] uppercase">
              {activeItem?.label} Archive
            </h4>
            <div 
              className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full" 
              style={{ color: activeItem?.color, backgroundColor: `${activeItem?.color}20` }}
            >
              {activeItem?.count} Logged
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem?.label || 'empty'}
                initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 gap-3 content-start"
              >
                {activeCovers.map((src, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 relative group"
                  >
                    <img 
                      src={src} 
                      alt="" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PremiumGlass>
  );
}
