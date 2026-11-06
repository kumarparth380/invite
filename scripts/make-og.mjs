// Renders /og-card to public/og.jpg (the link-preview image).
// Usage: start `npm run dev` in another terminal, then `npm run og`.
// Uses your installed Google Chrome; set OG_URL to point at another server.
import { chromium } from "playwright-core";

const url = process.env.OG_URL ?? "http://localhost:3000/og-card";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: "public/og.jpg",
  type: "jpeg",
  quality: 86,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log("Wrote public/og.jpg");
