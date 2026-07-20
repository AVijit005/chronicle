import { motion } from "motion/react";
import { MEDIA } from "@/lib/types";

export function CrossPlatform() {
  const desktop = { id: "interstellar", title: "Interstellar", creator: "Christopher Nolan", kind: "movie", progress: 68, backdrop: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" };
  const tablet = { id: "elden-ring", title: "Elden Ring", creator: "FromSoftware", kind: "game", progress: 75, backdrop: "https://images.igdb.com/igdb/image/upload/t_1080p/ar16b.jpg", poster: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.png" };
  const mobile = { id: "one-piece", title: "One Piece", creator: "Eiichiro Oda", kind: "anime", progress: 42, backdrop: "https://image.tmdb.org/t/p/w1280/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg", poster: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/fcNd3l6aK3vN73LzGIf9Yd4rPum.jpg" };

  return (
    <div className="relative grid grid-cols-12 items-center gap-6">
      {/* Desktop */}
      <motion.div
        className="col-span-12 md:col-span-8"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-strong overflow-hidden rounded-[28px] p-2 ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
            <img src={desktop.backdrop ?? undefined} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                Desktop · Library
              </div>
              <div className="font-display text-2xl text-white">{desktop.title}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tablet */}
      <motion.div
        className="col-span-7 md:col-span-3 md:-ml-12"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 10, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-strong overflow-hidden rounded-[24px] p-1.5 ring-1 ring-white/10">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[18px]">
            <img src={tablet.poster} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-[9px] uppercase tracking-[0.22em] text-white/70">Tablet</div>
              <div className="font-display text-sm text-white">{tablet.title}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile */}
      <motion.div
        className="col-span-5 md:col-span-2"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 9, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass-strong overflow-hidden rounded-[22px] p-1 ring-1 ring-white/10">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[18px]">
            <img src={mobile.poster} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-[9px] uppercase tracking-[0.22em] text-white/70">Mobile</div>
              <div className="font-display text-xs text-white">{mobile.title}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
