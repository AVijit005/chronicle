type PageViewPayload = {
  path: string;
  title: string;
  referrer: string;
  timestamp: string;
};

export function trackPageView(path: string, title?: string): void {
  const payload: PageViewPayload = {
    path,
    title: title ?? document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  };

  // Beacon API for non-blocking delivery
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/pageview', JSON.stringify(payload));
  } else {
    // Fallback: fire and forget fetch
    fetch('/api/analytics/pageview', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackEvent(category: string, action: string, label?: string, value?: number): void {
  const payload = { category, action, label, value, timestamp: new Date().toISOString(), path: window.location.pathname };

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/event', JSON.stringify(payload));
  } else {
    fetch('/api/analytics/event', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  }
}
