import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Noto_Serif_Devanagari,
  Rozha_One,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import { invite } from "@/content/invite";
import "lenis/dist/lenis.css";
import "./globals.css";

const rozha = Rozha_One({
  variable: "--font-rozha",
  weight: "400",
  subsets: ["devanagari", "latin"],
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["devanagari", "latin"],
});

const notoDeva = Noto_Serif_Devanagari({
  variable: "--font-noto-deva",
  weight: ["400", "500", "600"],
  subsets: ["devanagari", "latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

/**
 * Link previews (WhatsApp, iMessage…) need an absolute image URL.
 * Set NEXT_PUBLIC_SITE_URL to the live address when deploying; on Vercel the
 * production URL is picked up automatically.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: invite.meta.title,
  description: invite.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: invite.meta.title,
    description: invite.meta.description,
    type: "website",
    locale: "hi_IN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: invite.meta.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: invite.meta.title,
    description: invite.meta.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#5e1a14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${rozha.variable} ${tiro.variable} ${notoDeva.variable} ${bodoni.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
