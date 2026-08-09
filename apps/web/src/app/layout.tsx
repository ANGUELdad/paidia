import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-ui" });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Armonia Thassos",
  description: "Care-ops PWA Armonia Thassos — Betreuung, Plan und Vorrat",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Armonia", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#1a2822",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--ink)] antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
