# Pek Kio

A responsive, pastel neighbourhood guide for Pek Kio, Singapore. Built with Next.js App Router and TypeScript.

## Run locally

Use Node.js 24 LTS.

    npm ci
    npm run dev

## Verify

    npm run typecheck
    npm run build

## Features

- 25 researched listings: 14 food spots and 11 things to do, including two linked itineraries. Search, youth/adult filters and food/activity type filters keep browsing compact.
- Place detail subviews cover what to try, practical visit tips, budget guidance and sourced review summaries. Google Maps visitor review links are provided; no invented star ratings or live opening claims. Nearby Farrer Park / Little India stops are labelled.
- Favourites and resident checklist stored locally on the visitor's device. No account or personal data collection.
- Google News RSS fetched server-side, revalidated hourly, sorted by publication date. On timeout, invalid data or upstream failure, a clearly labelled dated editorial fallback is displayed.
- Responsive layout, keyboard-operable native modal, labelled controls, skip link and reduced-motion support.
- A viewport-sized tabbed interface with paginated cards, keyboard tab navigation and deep links. Main content fits common desktop and phone sizes; short viewports and zoom retain an accessible internal overflow area.
- Credited photographs of hawker food, cafés, Pek Kio Market, Pek Kio CC, the park and nearby activities, rendered with Next.js image optimisation. See `lib/photos.ts` and the in-app Photo credits dialog for source and licence details. Remote photos have an explicit unavailable state if an upstream host fails.

## Content maintenance

Edit `lib/places.ts` to maintain places, source URLs, audience tags and tips. Editorial details were researched 5 September 2026. Prices and opening hours are intentionally not presented as live information. Listings link to organisers for current bookings, eligibility and availability. This is an independent guide, not an official government website.

News is sourced through Google News RSS; feed availability and index coverage are not guaranteed. `lib/news.ts` contains the fetch and fallback logic. The feed is refreshed on requests through Next.js incremental static regeneration, not a background scheduler. Headlines link to publishers; no full articles are republished.

## Deployment

Deploy the repository to Vercel using the Next.js preset. No environment variables or database are required. Production build: `npm run build`. Framework output is automatically detected.

Review summaries are paraphrases, with publisher links and dates when available. Older reviews are identified; prices, menus and opening status should be checked with the venue. Photo context notes distinguish food/venue images from general location or brand images. Suggested durations and itineraries are editorial planning estimates. Preserve existing place IDs when updating content so saved lists continue to work.

## Kampung Quest (hackathon experience)

The AI Quest tab uses a quantized MiniLM semantic embedding model through Transformers.js in a Web Worker. No server inference, API key or AI Gateway billing is required. The model is loaded only when the visitor selects **Make my AI trail**. It ranks 23 individual places; explicit rules apply time, spending and shelter constraints. A clearly labelled instant curated mode is available without model download.

The latest trail and self-marked passport are persisted on-device. Share links include a validated list of up to three known place IDs; prompts and passport data are not included. The illustrated stop sequence is not a map and transfer allowances are estimates. Read `HACKATHON.md` for the demo script, architecture and honest limitations. The model card is linked inside the AI explanation dialog.

The AI library has pinned transitive overrides for patched `sharp` and `adm-zip` versions. Run `npm audit` after dependency updates. Source content remains in `lib/places.ts`; the worker receives a compact corpus from `lib/quest.ts`.
