// Product Analytics Wrapper
// Switch to PostHog or Plausible in production by implementing these methods.

export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Track: ${eventName}`, properties);
      return;
    }
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(eventName, properties);
    }
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, { props: properties });
    }
  },
  
  page: (path: string) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] PageView: ${path}`);
      return;
    }
    if (typeof window !== 'undefined' && (window as any).posthog) {
      // Avoid double-firing if posthog auto-captures, but since this is manual SPA:
      (window as any).posthog.capture('$pageview', { $current_url: path });
    }
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview', { u: path });
    }
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Identify: ${userId}`, traits);
      return;
    }
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits);
    }
  }
};
