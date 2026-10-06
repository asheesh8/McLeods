# McLeod's asset provenance

Everything on the site is either a real McLeod's photo or a Higgsfield
generation. Nothing is stock.

## Real (McLeod's Facebook page, scraped 2026-10-06)
`src/assets/photos/*`, from `raw-assets/facebook/photos/` (235 photos; captions in
`captions.json`, post text in `posts.txt`). These eight were upscaled to about 2.9K
with Higgsfield (bytedance upscaler, content unchanged): wrecker-bay, crane-truck,
frame-weld, welder-bench, plow-night-shop, flatbed-frame, peterbilt-front, spring-bench.

## Generated (Higgsfield, GPT Image 2.5)
`src/assets/gen/*` and `src/assets/decor/*`; originals in `raw-assets/higgsfield/`.

- **hero-dusk.jpg**: made from their real cover photo of 32 Blackwell St, regraded
  to a snowy blue hour, with a dump truck added in the yard. The building, lettering and
  doors are theirs. **Tell the Baileys it is an artistic version of their shop.**
- leaf-spring, welding, plow-night, hydraulic, log-truck, under-chassis, u-bolts,
  siding: illustrative art, not their jobs. Used for mood and services only, never
  captioned as their work.
- decor/*: transparent cutouts (bolts, nuts, springs, U-bolt, chain, gear, die-cast
  model trucks) scattered behind sections.

## Brand
- `src/assets/brand/logo-full.png`: a clean, transparent re-render of their current
  Facebook logo (same truck, gear, ring, wordmark).
- `src/assets/brand/badge.png`: the same badge without text, for the header and
  favicons (`public/favicon*`, `apple-touch-icon.png`, `icon-512.png`).
- `public/og.jpg`: share card composed from hero-dusk plus the logo.
