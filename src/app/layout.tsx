import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Hebrew } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./home.css";
import "./pages.css";

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
        {children}
      </body>
    </html>
  );
}
