# शिवानी संग रितेश — wedding invitation

A mobile-first, fully static wedding invitation in Hindi, built with Next.js 16,
Tailwind CSS 4, Motion and Lenis.

**What a guest sees:** carved wooden doors with a gold seal that swing open when
tapped → the entrance of Shri Ram Janmabhoomi Mandir, Ayodhya, under a sunrise
sky; scrolling walks through its archway → the invitation and family names → a
gold scratch card that reveals the date → a live countdown → event cards (Haldi,
Mehndi & Sangeet, Wedding) with directions and "save the date" → an RSVP that
opens WhatsApp → the closing blessing, the sender's name and a share button.

The two photographs are pre-cropped, colour-graded WebP files in
`public/images/` (see [Photo credits](#photo-credits)); the small ornaments and
icons are SVG in `src/components/art/`.

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

## Smooth scrolling

The scroll-linked effects only animate `transform` and `opacity`, which the
browser runs on the GPU. Avoid adding `backdrop-filter`, `filter: blur()` or
`mix-blend-mode` to anything that moves or sits behind moving content; those
force a repaint on every frame and make phones stutter. Mouse wheels and
trackpads are smoothed by Lenis (`src/lib/smooth-scroll.ts`); touch scrolling is
left native.

## Photo credits

- **Ram Mandir entrance:** [photo by Aliva Sahoo](https://commons.wikimedia.org/wiki/File:Ram_Mandir_temple_(93827).jpg),
  [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), via
  Wikimedia Commons. Cropped, sky replaced with a sunrise gradient, a direction
  signboard removed and colour-graded. The edited versions in
  `public/images/temple-*.webp` are shared under the same CC BY-SA 3.0 licence.
- **Carved door:** [photo by Darshan Patel](https://unsplash.com/photos/a-large-wooden-door-with-intricate-carvings-on-it-oA4l0UWK4Vc)
  on Unsplash ([Unsplash License](https://unsplash.com/license)). Cropped to
  one leaf, which is mirrored for the other.

The credit line is also shown in small print at the bottom of the page; keep it
there if you change the photos' source.
