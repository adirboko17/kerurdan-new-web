"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readCookieConsent, type CookieConsent } from "@/lib/cookie-consent";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const gtagId = gaId || adsId;

export function TrackingScripts() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(readCookieConsent());
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<CookieConsent>).detail;
      if (next === "all" || next === "essential") setConsent(next);
    };
    window.addEventListener("kd-cookie-consent", onChange);
    return () => window.removeEventListener("kd-cookie-consent", onChange);
  }, []);

  if (consent !== "all") return null;

  return (
    <>
      {gtagId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="kd-gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gaId ? `gtag('config','${gaId}');` : ""}${adsId && adsId !== gaId ? `gtag('config','${adsId}');` : ""}`}
          </Script>
        </>
      ) : null}
      {pixelId ? (
        <Script id="kd-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
