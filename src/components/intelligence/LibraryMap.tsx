import { motion } from "motion/react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { Map } from "lucide-react";

export function LibraryMap(props: any) {
  const tags = [
    { name: "Sci-Fi", count: 42, color: "var(--primary)" },
    { name: "Cyberpunk", count: 18, color: "oklch(0.65 0.22 295)" },
    { name: "Fantasy", count: 35, color: "oklch(0.78 0.16 50)" },
    { name: "Drama", count: 28, color: "oklch(0.72 0.16 160)" },
    { name: "Action", count: 15, color: "oklch(0.7 0.18 25)" },
    { name: "Thriller", count: 22, color: "oklch(0.5 0.1 200)" },
    { name: "Comedy", count: 12, color: "oklch(0.8 0.15 80)" },
    { name: "Romance", count: 8, color: "oklch(0.6 0.2 10)" },
  ];

  return (
    <PremiumGlass className="p-6 h-[400px] flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[oklch(0.72_0.18_255)]">
          <Map size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl tracking-tight">Library Topography</h3>
          <p className="text-xs text-muted-foreground">The landscape of your media diet</p>
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-wrap content-center justify-center gap-3 p-4">
        {tags.map((tag, i) => {
          // Calculate font size based on count, ranging from text-xs to text-3xl
          const size = Math.max(0.75, Math.min(2.5, tag.count / 15));
          
          return (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
              className="flex items-center justify-center px-4 py-2 rounded-full cursor-pointer border border-white/5 bg-white/5 backdrop-blur-sm"
              style={{
                color: tag.color,
                fontSize: `${size}rem`,
                boxShadow: `0 4px 12px color-mix(in oklch, ${tag.color} 20%, transparent)`
              }}
            >
              <span className="font-display font-medium tracking-tight drop-shadow-md">
                {tag.name}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
    </PremiumGlass>
  );
}
