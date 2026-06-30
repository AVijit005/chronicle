import { motion } from "motion/react";
import { Sunrise, Quote as QuoteIcon, History, Sparkle, Heart } from "lucide-react";
import { TODAY } from "@/lib/memory";
import {
  getOnThisDay,
  getForgottenFavorites,
  getLongTimeNoSee,
  getComfortRewatches,
  getOldJournalEntries,
  getRandomTreasure,
  getAnniversaryMemories,
} from "@/lib/resurfacing";
import { cascade } from "@/lib/motion";
import type { MediaItem } from "@/lib/mock";

interface RitualCard {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: typeof Sunrise;
  media?: MediaItem;
  to?: string;
}

// Deterministic — same day = same ritual on server and client.
function dayOfYear(d: Date) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  return Math.floor((d.getTime() - start) / 86_400_000);
}

function buildRitual(): RitualCard[] {
  const seed = dayOfYear(TODAY);
  const cards: RitualCard[] = [];

  const pick = <T,>(arr: T[], offset = 0): T | undefined =>
    arr.length ? arr[(seed + offset) % arr.length] : undefined;

  const onDay = pick(getOnThisDay());
  if (onDay) {
    const y = new Date(onDay.memory.finishedAt!).getUTCFullYear();
    cards.push({
      key: "on-this-day",
      eyebrow: "On this day",
      title: onDay.media.title,
      body: `You finished this on this same date in ${y}. A small anniversary, quietly noted.`,
      icon: History,
      media: onDay.media,
      to: `/app/media/${onDay.media.id}`,
    });
  }

  const forgotten = pick(getForgottenFavorites(), 1);
  if (forgotten) {
    cards.push({
      key: "forgotten",
      eyebrow: "A favorite you've drifted from",
      title: forgotten.media.title,
      body: "You rated this near the top of your life. It's been a long time. Maybe a re-read of the feeling.",
      icon: Heart,
      media: forgotten.media,
      to: `/app/media/${forgotten.media.id}`,
    });
  }

  const journal = pick(getOldJournalEntries(), 2);
  if (journal) {
    cards.push({
      key: "journal",
      eyebrow: "A page worth re-reading",
      title: `What you wrote about ${journal.media.title}`,
      body: "An old journal entry. The person who wrote it was a slightly different you.",
      icon: QuoteIcon,
      media: journal.media,
      to: `/app/journal`,
    });
  }

  const comfort = pick(getComfortRewatches(), 3);
  if (comfort) {
    cards.push({
      key: "comfort",
      eyebrow: "A comfort story",
      title: comfort.media.title,
      body: "Something you've returned to before. The kind of story that meets you where you are.",
      icon: Sparkle,
      media: comfort.media,
      to: `/app/media/${comfort.media.id}`,
    });
  }

  if (cards.length < 4) {
    const t = getRandomTreasure(seed + 5);
    if (t) {
      cards.push({
        key: "treasure",
        eyebrow: "From the archive",
        title: t.media.title,
        body: "Pulled from a corner of your library you haven't visited lately.",
        icon: Sunrise,
        media: t.media,
        to: `/app/media/${t.media.id}`,
      });
    }
  }

  // Anniversary backup
  if (cards.length < 4) {
    const a = pick(getAnniversaryMemories(), 6);
    if (a) {
      cards.push({
        key: "anniversary",
        eyebrow: "This month, another year",
        title: a.media.title,
        body: "An echo from the same season of a past year.",
        icon: History,
        media: a.media,
        to: `/app/media/${a.media.id}`,
      });
    }
  }

  // Last-resort fallback
  if (cards.length < 4) {
    const l = pick(getLongTimeNoSee(), 7);
    if (l) {
      cards.push({
        key: "long",
        eyebrow: "Long time, no story",
        title: l.media.title,
        body: "You haven't opened this corner of your library in a while.",
        icon: Sunrise,
        media: l.media,
      });
    }
  }

  return cards.slice(0, 4);
}

export function DailyRitual({ className }: { className?: string }) {
  const cards = buildRitual();
  if (!cards.length) return null;
  const dateLabel = TODAY.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section
      aria-label="Today's ritual"
      className={`relative overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-14 ${className ?? ""}`}
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, oklch(0.72 0.18 255 / 0.10), transparent 55%), radial-gradient(100% 70% at 100% 100%, oklch(0.65 0.22 295 / 0.10), transparent 60%), oklch(0.16 0.012 270 / 0.6)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.04)",
      }}
    >
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary/85">
            Today's ritual
          </div>
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
            What your library is whispering today
          </h2>
          <p className="mt-2 max-w-xl text-sm text-foreground/65">
            A small daily resurfacing — pulled from your own memory, not from a feed.
          </p>
        </div>
        <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:block">
          {dateLabel}
        </div>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => {
          const Inner = (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={cascade(i)}
              className="group glass-subtle relative flex h-full gap-4 overflow-hidden rounded-2xl p-4 ring-1 ring-white/5 transition hover:ring-white/15"
            >
              {c.media && (
                <img
                  src={c.media.poster}
                  alt=""
                  className="h-28 w-20 flex-none rounded-xl object-cover ring-1 ring-white/10"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary/80">
                  <c.icon className="h-3 w-3" />
                  {c.eyebrow}
                </div>
                <div className="mt-1.5 truncate font-display text-lg tracking-tight">{c.title}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/70">{c.body}</p>
              </div>
            </motion.article>
          );
          return (
            <li key={c.key}>
              {c.to ? (
                <a href={c.to} className="block h-full">
                  {Inner}
                </a>
              ) : (
                Inner
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
