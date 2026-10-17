# McLeod's Spring & Chassis

Website for **McLeod's Spring & Chassis**, a family-owned heavy-truck repair shop and parts store in Barre, Vermont (since 1987): springs and suspension, brakes, alignment, frame repair and welding, hydraulic hoses, and Meyer snowplows.

**Hosting:** Vercel (no public URL is set on the repo yet).

## Tech stack

- Astro 5 static site, TypeScript, plain CSS (`src/styles/global.css`)
- Three.js "springs" section: a leaf-spring pack built from primitives that animates when in view (`src/scripts/spring-scene.ts`)
- No server code and no environment variables

## Project layout

```
src/data/business.ts     Every fact on the site — the single source of truth
src/data/reviews.json    Google reviews shown on /reviews
src/pages/               index, reviews, robots.txt
src/components/          Header, hero, review wall, springs scene, mobile call bar
raw-assets/ASSETS.md     Where each photo and asset came from
```

If a fact isn't in `business.ts`, it doesn't go on the site. Items marked `TODO(mcleods)` still need confirming with the owners.

## Local setup

Requires Node 22.

```bash
npm install
npm run dev      # http://localhost:4541
npm run build    # static output in dist/
```

## Deploying

Vercel builds with `npm run build` and serves `dist/` (`vercel.json` also sets security headers and caching). Pushes to `main` deploy to production.
