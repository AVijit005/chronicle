import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";

export function PageSkeleton() {
  return (
    <div className="pt-2 space-y-8">
      <ShimmerSkeleton className="h-[520px] rounded-b-[40px]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ShimmerSkeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <ShimmerSkeleton className="h-24 rounded-3xl" />
      <ShimmerSkeleton className="h-64 rounded-3xl" />
    </div>
  );
}
