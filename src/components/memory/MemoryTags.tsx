import { TAGS, type MemoryTag } from "@/lib/memoryInsights";
import { cn } from "@/lib/utils";

interface Props {
  tags?: readonly MemoryTag[];
  active?: MemoryTag | null;
  onSelect?: (tag: MemoryTag) => void;
  className?: string;
}

export function MemoryTags({ tags = TAGS, active = null, onSelect, className }: Props) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Memory tags">
      {tags.map((tag) => {
        const isActive = active === tag;
        return (
          <li key={tag}>
            <button
              type="button"
              onClick={() => onSelect?.(tag)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] tracking-tight transition",
                "bg-white/[0.03] text-foreground/75 ring-1 ring-white/10 hover:bg-white/[0.06]",
                isActive && "bg-white/[0.08] text-foreground ring-white/20",
              )}
            >
              {tag}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
