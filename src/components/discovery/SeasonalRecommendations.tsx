import { motion } from "motion/react";
import { CloudSnow } from "lucide-react";
import { PremiumGlass } from "@/components/ui/PremiumGlass";
import { PosterCard } from "@/components/ui/PosterCard";

export function SeasonalRecommendations(props: any) {
  const items = props.items || [
    { id: "sr1", mediaId: "sr1", _mediaId: "sr1", title: "Fargo", poster: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=600&auto=format&fit=crop", mediaType: "movie" },
    { id: "sr2", mediaId: "sr2", _mediaId: "sr2", title: "The Shining", poster: "https://images.unsplash.com/photo-1518173663110-388274092b70?q=80&w=600&auto=format&fit=crop", mediaType: "movie" },
    { id: "sr3", mediaId: "sr3", _mediaId: "sr3", title: "Snowpiercer", poster: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=600&auto=format&fit=crop", mediaType: "movie" },
  ];

  return (
    <PremiumGlass className="relative overflow-hidden p-6 sm:p-8">
      {/* Decorative background element for "Season" */}
      <div className="pointer-events-none absolute -right-20 -top-20 opacity-10">
        <CloudSnow size={240} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-blue-400 mb-2">
            <CloudSnow size={16} />
            Winter Curations
          </div>
          <h2 className="font-display text-3xl font-medium tracking-tight mb-3">
            Cold Nights, Warm Stories
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Atmospheric thrillers and snowy epics perfect for when the temperature drops outside.
          </p>
          <button className="self-start rounded-full bg-white/10 px-5 py-2 text-sm font-medium hover:bg-white/20 transition-colors">
            See all 12 recommendations
          </button>
        </div>
        
        <div className="md:w-2/3 grid grid-cols-3 gap-4">
          {items.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <PosterCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </PremiumGlass>
  );
}
