// Product Analytics Wrapper
// Switch to PostHog or Plausible in production by implementing these methods.

export const analytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Track: ${eventName}`, properties);
    }
    // TODO: window.plausible(eventName, { props: properties })
    // TODO: posthog.capture(eventName, properties)
  },
  
  page: (path: string) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] PageView: ${path}`);
    }
    // TODO: posthog.capture('$pageview')
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }
    // TODO: posthog.identify(userId, traits)
  }
};
