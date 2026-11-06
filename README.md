# शिवानी संग रितेश — wedding invitation

A mobile-first, fully static wedding invitation in Hindi, built with Next.js 16,
Tailwind CSS 4 and Motion.

**What a guest sees:** closed temple doors with a gold seal that open when
tapped → a temple at sunrise that zooms into its glowing doorway as you scroll →
the invitation and family names → a gold scratch card that reveals the date →
a live countdown → event cards (Haldi, Mehndi & Sangeet, Wedding) with
directions and "save the date" → an RSVP that opens WhatsApp → the closing
blessing, the sender's name and a share button.

All artwork is hand-drawn SVG in `src/components/art/`, so there are no image
files to manage.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to out/
```

## Change the wording, dates or links

Everything lives in **`src/content/invite.ts`**: names, parents, event dates and
times, venues, Google Maps links, the RSVP WhatsApp number, the RSVP deadline,
the sender ("प्रेषक") and the link-preview text.

- **RSVP number:** set `rsvp.whatsappNumber` (country code, digits only, such as
  `919876543210`). While it is empty, the RSVP opens WhatsApp and lets the guest
  choose who to send it to.
- **Exact map pins:** replace the `mapUrl` values with the "Share → Copy link"
  URL from Google Maps.

## Deploy

`out/` is plain HTML, CSS and JS, so any static host works.

- **Vercel:** import the repo. The site address is detected automatically for
  the link preview.
- **Netlify, Cloudflare Pages, GitHub Pages or anything else:** build command
  `npm run build`, publish directory `out`. Set the environment variable
  `NEXT_PUBLIC_SITE_URL=https://your-domain` so WhatsApp can load the preview
  image.

## Link preview image

`public/og.jpg` is the picture WhatsApp shows when the link is shared. It is a
screenshot of the `/og-card` page. After changing names or dates, regenerate it.
This uses your installed Google Chrome:

```bash
npm run dev          # in one terminal
npm run og           # in another; rewrites public/og.jpg
```
