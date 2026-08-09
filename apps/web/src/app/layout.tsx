import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

/** Design C — Signal Compact: single geometric sans for speed */
const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-ui" });

export const metadata: Metadata = {
  title: "Armonia Thassos",
  description: "Care-ops PWA Armonia Thassos — Betreuung, Plan und Vorrat",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Armonia", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f7f8f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={outfit.variable} data-theme="signal">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--ink)] antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
