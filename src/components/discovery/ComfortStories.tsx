import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { PosterCard } from "@/components/ui/PosterCard";
import type { MediaItem } from "@/lib/types";

interface Props {
  items?: MediaItem[];
}

export function ComfortStories({ items = [] }: Props) {
  // Use mock items if none provided
  const displayItems = items.length > 0 ? items : [
    { id: "cs1", mediaId: "cs1", _mediaId: "cs1", title: "Spirited Away", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop", mediaType: "movie", rewatchCount: 5, accent: "oklch(0.65 0.22 295)" },
    { id: "cs2", mediaId: "cs2", _mediaId: "cs2", title: "The Office", poster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop", mediaType: "tv", rewatchCount: 8, accent: "oklch(0.78 0.16 50)" },
    { id: "cs3", mediaId: "cs3", _mediaId: "cs3", title: "Stardew Valley", poster: "https://images.unsplash.com/photo-1595089334571-0010996f2648?q=80&w=600&auto=format&fit=crop", mediaType: "game", rewatchCount: 12, accent: "oklch(0.70 0.18 160)" },
    { id: "cs4", mediaId: "cs4", _mediaId: "cs4", title: "Harry Potter", poster: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?q=80&w=600&auto=format&fit=crop", mediaType: "book", rewatchCount: 3, accent: "oklch(0.72 0.18 25)" },
  ] as any[];

  if (displayItems.length === 0) return null;

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl tracking-tight">
            <Heart size={20} className="text-[oklch(0.78_0.16_50)]" />
            Comfort Stories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Media you keep coming back to when you need a warm hug.
          </p>
        </div>
      </div>

      <div className="relative -mx-6 overflow-x-auto pb-4 pt-2 hide-scrollbar">
        <div className="flex w-max gap-4 px-6">
          {displayItems.map((item, i) => (
            <motion.div
              key={item._mediaId || item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="w-[140px] sm:w-[160px] md:w-[180px]"
            >
              <PosterCard item={item} />
              <div className="mt-2 text-center text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{item.rewatchCount}</span> revisits
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


