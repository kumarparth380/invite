# शिवानी संग रितेश — wedding invitation

A mobile-first, fully static wedding invitation in Hindi, built with Next.js 16,
Tailwind CSS 4, Motion and Lenis.

**What a guest sees:** carved wooden doors with a gold seal that swing open when
tapped → the entrance of Shri Ram Janmabhoomi Mandir, Ayodhya, under a sunrise
sky; scrolling walks through its archway → the invitation and family names → a
gold scratch card that reveals the date → a live countdown → event cards (Haldi,
Mehndi & Sangeet, Wedding) with directions and "save the date" → the closing
blessing, the sender's name and a share button.

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
times, venues, Google Maps links, the sender ("प्रेषक") and the link-preview
text.

- **Exact map pins:** replace the `mapUrl` values with the "Share → Copy link"
  URL from Google Maps.

## Background music

`public/audio/music.mp3` plays when the guest taps the seal (browsers don't
allow sound before a tap) and repeats with a short crossfade, so even a
few-second clip loops without a gap. It pauses while the guest is in another
app, and the button at the bottom right pauses or resumes it. If the file is
missing, the button doesn't appear.

- To change the song, replace `public/audio/music.mp3` (or point `music.src` in
  `src/content/invite.ts` at another file).
- To loop only part of a longer song, set `music.loopStart` / `music.loopEnd`
  in seconds, or trim the file:

  ```bash
  # keep 45 seconds starting at 1:35
  avconvert -s song.mp3 -o public/audio/music.m4a -p PresetAppleM4A --start 95 --duration 45
  ```

Only use music you have the right to publish: commercial film songs on a public
site can be taken down.

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
