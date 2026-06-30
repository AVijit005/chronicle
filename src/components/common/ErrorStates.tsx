// Premium error variants — wrap PremiumErrorState.
import { PremiumErrorState } from "@/components/common/PremiumErrorState";
import { PremiumButton } from "@/components/ui/PremiumButton";

export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => (
  <PremiumErrorState
    title="No connection"
    description="We can't reach your library right now. Check your network and try again."
    action={onRetry ? <PremiumButton onClick={onRetry}>Retry</PremiumButton> : undefined}
  />
);
export const OfflineError = () => (
  <PremiumErrorState
    title="You're offline"
    description="Chronicle works best online — your last memories are still here."
  />
);
export const PermissionError = () => (
  <PremiumErrorState
    title="Permission needed"
    description="This area is private. Sign in to see your full memory."
  />
);
export const NotFoundError = () => (
  <PremiumErrorState
    title="Not found"
    description="That story has drifted off the map. The path may have changed."
  />
);
export const EmptySearchError = ({ term }: { term?: string }) => (
  <PremiumErrorState
    title={term ? `Nothing for "${term}"` : "Nothing yet"}
    description="Try a different phrase, or look for a creator, mood or genre."
  />
);
export const UnexpectedError = ({ onRetry }: { onRetry?: () => void }) => (
  <PremiumErrorState
    title="Something quiet broke"
    description="Reload to keep going. Your memories are safe."
    action={onRetry ? <PremiumButton onClick={onRetry}>Reload</PremiumButton> : undefined}
  />
);
