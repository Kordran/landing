type Gtag = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number>
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

/** Privacy-conscious events. Never pass form text or other submission content. */
export function track(
  event: string,
  params?: Record<string, string | number>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", event, params);
}
