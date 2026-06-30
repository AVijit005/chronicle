import { User, Users, Heart, Globe, GraduationCap, Home } from "lucide-react";
import { MemoryChip } from "./MemoryChip";
import type { Companion } from "@/lib/memory";
import { cn } from "@/lib/utils";

interface Props {
  companion: Companion;
  className?: string;
}

const icons: Record<Companion, React.ReactNode> = {
  Alone: <User className="h-3 w-3" />,
  Friends: <Users className="h-3 w-3" />,
  Family: <Home className="h-3 w-3" />,
  Partner: <Heart className="h-3 w-3" />,
  "Online Community": <Globe className="h-3 w-3" />,
  Classmates: <GraduationCap className="h-3 w-3" />,
};

export function MemoryCompanion({ companion, className }: Props) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <MemoryChip variant="companion" label={companion} icon={icons[companion]} />
    </div>
  );
}
