import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getConstellation } from "@/lib/api/analytics";
import { PremiumGlass } from "../ui/PremiumGlass";

const AVAILABLE_CATEGORIES = [
  "Movies", "Anime", "Series", "Books", "Manga", 
  "Games", "Music", "Podcasts", "Courses", "YouTube"
];

export function MediaConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Movies", "Books", "Games", "Anime"
  ]);

  const { data: constellationData = [], isLoading } = useQuery({
    queryKey: ['analytics', 'constellation', selectedCategories],
    queryFn: () => getConstellation(selectedCategories),
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      // Prevent unselecting the very last category
      if (prev.includes(cat) && prev.length === 1) return prev;
      return prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat];
    });
  };

  // Cinematic Autoplay
  useEffect(() => {
    if (hovered !== null || constellationData.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % constellationData.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [hovered, constellationData.length]);

  const activeItem = hovered 
    ? constellationData.find(d => d.label === hovered) || constellationData[0] 
    : constellationData[activeIndex] || constellationData[0];

  return (
    <PremiumGlass className="relative flex flex-col p-6 md:p-10 overflow-hidden min-h-[460px]">
      
      {/* Option A: Glassmorphic Filter Chips */}
      <div className="relative z-20 w-full overflow-x-auto pb-4 mb-2 flex items-center gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mr-2 shrink-0">Filter:</div>
        {AVAILABLE_CATEGORIES.map(cat => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-[20px] text-xs font-semibold tracking-wide transition-all duration-300 border ${
                isSelected 
                  ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md' 
                  : 'bg-transparent border-white/5 text-muted-foreground/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isSelected ? '✓ ' : ''}{cat}
            </button>
          )
        })}
      </div>

      {isLoading || constellationData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
          Syncing with backend...
        </div>
      ) : (
        <>
          {/* Background Ambient Aura - MASKED to prevent artifacts at the top edge */}
          <div 
            className="absolute inset-0 transition-colors duration-1000 ease-out pointer-events-none opacity-[0.12]"
            style={{ 
              background: `radial-gradient(circle at 50% 30%, ${activeItem?.color || 'transparent'}, transparent 70%)`,
              maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)'
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
                
                <div 
                  className="font-display text-[7rem] md:text-9xl tracking-tighter leading-none bg-clip-text text-transparent pb-2 transition-all duration-1000" 
                  style={{ 
                    backgroundImage: `linear-gradient(to bottom, white 20%, ${activeItem?.color} 100%)`,
                    filter: `drop-shadow(0 0 60px ${activeItem?.color}80) drop-shadow(0 4px 10px rgba(0,0,0,0.5))` 
                  }}
                >
                  {activeItem?.value}%
                </div>
                
                <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mt-4 opacity-80 flex items-center gap-3">
                  <span className="w-8 h-px bg-white/20" />
                  {activeItem?.count} entries logged
                  <span className="w-8 h-px bg-white/20" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Middle Section: The Tactical Lightbar */}
          <div className="relative z-10 w-full flex flex-col items-center my-6">
            <div className="w-full flex items-end gap-2 md:gap-3 h-20">
              {constellationData.map((item) => {
                const isHovered = hovered === item.label;
                const isAutoActive = hovered === null && activeItem?.label === item.label;
                const isActive = isHovered || isAutoActive;
                const isDimmed = !isActive;
                
                return (
                  <motion.div
                    key={item.label}
                    className="relative rounded-full cursor-pointer overflow-hidden origin-bottom"
                    style={{ width: `${item.value}%` }}
                    initial={{ height: 16, opacity: 0 }}
                    animate={{ 
                      height: isActive ? 56 : 20,
                      opacity: isDimmed ? 0.3 : 1,
                      filter: isActive ? `drop-shadow(0 0 24px ${item.color}80)` : 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
                    }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
                    onMouseEnter={() => setHovered(item.label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* 3D Glass Cylinder Styling */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ 
                        background: `linear-gradient(180deg, color-mix(in srgb, ${item.color} 70%, white) 0%, ${item.color} 40%, color-mix(in srgb, ${item.color} 40%, black) 100%)`,
                        boxShadow: `inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.8)`
                      }}
                    />
                    
                    {/* Premium Diagonal Glass Shine overlay */}
                    <div 
                      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
                      style={{
                        background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.5) 30%, transparent 40%)'
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            {/* Precision Tick Marks */}
            <div className="w-full flex justify-between px-1 mt-3 opacity-30">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-px ${i % 5 === 0 ? 'h-2 bg-white' : 'h-1 bg-white/50'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: The Legend Grid */}
          <div className="relative z-10 mt-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full pt-4">
            <AnimatePresence mode="popLayout">
              {constellationData.map((item) => {
                const isHovered = hovered === item.label;
                const isAutoActive = hovered === null && activeItem?.label === item.label;
                const isActive = isHovered || isAutoActive;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={item.label}
                    className={`flex flex-col gap-3 p-4 rounded-2xl transition-all duration-500 cursor-pointer border ${isActive ? 'bg-white/10 border-white/10 shadow-xl scale-[1.02]' : 'border-transparent hover:bg-white/[0.04]'}`}
                    onMouseEnter={() => setHovered(item.label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2.5 h-2.5 rounded-full transition-transform duration-500" 
                        style={{ 
                          background: item.color, 
                          boxShadow: isActive ? `0 0 16px ${item.color}, 0 0 24px ${item.color}` : `0 0 8px ${item.color}60`,
                          transform: isActive ? 'scale(1.5)' : 'scale(1)'
                        }} 
                      />
                      <div className={`text-[11px] font-bold tracking-widest uppercase transition-colors duration-500 ${isActive ? 'text-foreground' : 'text-foreground/70'}`}>
                        {item.label}
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.count} items</div>
                      <div className="text-2xl font-display font-semibold text-foreground/90">{item.value}%</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </PremiumGlass>
  );
}
