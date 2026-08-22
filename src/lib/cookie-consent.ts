export const COOKIE_CONSENT_KEY = "kd-cookie-consent";

export type CookieConsent = "all" | "essential";

export function readCookieConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "all" || value === "essential") return value;
  } catch {
    // ignore
  }
  return null;
}

export function writeCookieConsent(value: CookieConsent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent("kd-cookie-consent", { detail: value }));
  } catch {
    // ignore
  }
}
