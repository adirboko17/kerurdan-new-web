import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_Hebrew } from "next/font/google";
import { SiteLoader } from "@/components/layout/SiteLoader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { TrackingScripts } from "@/components/legal/TrackingScripts";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./home.css";
import "./pages.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e4ecf0" },
    { media: "(prefers-color-scheme: dark)", color: "#e4ecf0" },
  ],
};

const hebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-hebrew",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | קירור מסחרי ותעשייתי`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  other: {
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    locale: "he_IL",
    type: "website",
    siteName: SITE.name,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${hebrew.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className={hebrew.className} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("kd-intro")==="1")document.documentElement.classList.add("intro-done")}catch(e){}`,
          }}
        />
        <SiteLoader />
        {children}
        <TrackingScripts />
        <WhatsAppFloat />
        <CookieBanner />
      </body>
    </html>
  );
}
