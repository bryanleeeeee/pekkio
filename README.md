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

## Blender miniature

The **3D Pek Kio** tab sits immediately beside AI Quest. It contains an interactive GLB model, camera presets, a rendered picture and an editable Blender scene download. The model is a photo-inspired artistic interpretation of Pek Kio Community Centre, with simplified school/street context, not a surveyed model or navigation map.

Created with Blender 5.2.1 LTS. Rebuild with `blender --background --python scripts/build_pekkio.py -- /absolute/output/path`. This writes a `.blend`, `.glb`, and transparent `.png`. Convert the PNG to the web poster with sharp. Source reference: [onePA Pek Kio CC](https://www.onepa.gov.sg/cc/pek-kio-cc). The school/CC relationship is documented by [Farrer Park Primary School](https://www.farrerparkpri.moe.edu.sg/partners/pek-kio-cc/). Original modelling code and geometry are in this repository; no third-party 3D assets are included.

The viewer is loaded on demand through Google's `model-viewer`, with a still-picture fallback when WebGL is unavailable. The 3D scene is authored in Blender, not AI-generated.

## Neighbourhood-scale 3D map

The same **3D Pek Kio** tab now defaults to a **1.5 km radius** around Pek Kio Community Centre (3 km across). This is an exploration extent, not an official neighbourhood boundary. The original CC miniature remains available with the scale switch.

The Blender model uses a local OpenStreetMap snapshot, including mapped building footprints/parts, roads, paths and green/water areas. The initial release contains 5,530 building shapes and parts, 6,648 road/path sections and 106 green/water polygons. These are geometry counts, not counts of unique addresses, streets or parks. The projection uses local metres around 1.31308 N, 103.85138 E, scaled to .02 Blender units per metre. Geometry is clipped to a 1.5 km circular extent.

Height provenance: 426 shapes use mapped heights; 2,491 derive height from tagged storeys (3.2 m/storey); 2,613 use category estimates. The CC height is an estimate. Terrain is flat, 46 courtyard relations are simplified, roof shapes/facades are not reconstructed, and heights are capped at 250 m. Building parts can overlap parent footprints. It is a stylised map, not a digital twin or a surveying/navigation product. Station pins indicate mapped station centres, not exact street-level entrances.

The GLB uses Draco compression and material batching (about 1.4 MB in this release). The browser loads the decoder as needed. Eight landmarks have camera jumps: CC, market, Pek Kio Park, Farrer Park MRT, Little India MRT, Indian Heritage Centre, City Square Mall and Novena MRT. A static Blender render, editable .blend and the source map extract are downloadable.

**Attribution/licence:** © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). The source snapshot is available at `public/data/pekkio-osm.json.gz`; retrieval/query/projection/provenance are in `public/data/district.json`. Preserve attribution and comply with ODbL when redistributing source or derived map data. The website always displays the attribution link on the district view, and the render includes an attribution caption.

To rebuild from the included snapshot: `blender --background --python scripts/build_neighbourhood.py` (Blender 5.2.1). It reads the raw JSON if available or the included gzip otherwise, generates geometry, metadata, compressed GLB, Blender scene and PNG. Use sharp to convert PNG to WebP. To refresh the map snapshot first, run `node scripts/fetch_neighbourhood.mjs`; this makes a bounded Overpass request and writes the snapshot and retrieval metadata. Review changes and regenerate the scene rather than fetching map geometry on every visitor request.
