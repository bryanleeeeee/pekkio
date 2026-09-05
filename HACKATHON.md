# Kampung Quest — hackathon demo

## One-line pitch

Pek Kio turns a new resident's spare hour into a small adventure: private, on-device AI matches their mood to real local places, and a neighbourhood passport turns exploration into a habit.

## Three-minute demo

1. **The problem (20 seconds):** A new resident knows their address but not their neighbourhood. Search returns lots of disconnected reviews. Pek Kio helps them take a useful first step outside.
2. **Creativity (30 seconds):** Open AI Quest. Show the mood tiles, illustrated trail and passport. “We turn local discovery into little missions, not just another list of restaurants.”
3. **Real AI (50 seconds):** Choose Slow & easy, allow paid stops, enter “A relaxed coffee and a quiet green space after a busy week.” Click Make my AI trail. On first use the model downloads; wait for the ON-DEVICE AI badge. Show the stop sequence and Tips & sources.
4. **Innovation (35 seconds):** Change to sheltered stops or one hour and generate again. Explain that neural similarity ranks the places, while explicit constraints shape the trail. All venue names come from the researched directory.
5. **Community (25 seconds):** Mark a stop explored, open My passport, then copy the trail link. Open that link in another tab to show a shareable route without sharing the private prompt.
6. **Trust (20 seconds):** Open How the AI works. The model is MiniLM, with 384-dimensional embeddings and cosine similarity. It runs in a worker on the visitor's device. Explain the source links and honest Curated trail fallback.

## Before judging

- Open https://pekkio.vercel.app/#quest on the actual presentation device, click Make my AI trail once and verify the ON-DEVICE AI badge. This downloads and caches the model/runtime; first use needs internet and may be slower on other devices.
- Use a modern browser with WebAssembly. Keep internet available for images and source links; this is not a fully offline website.
- Keep a second tab on a shared trail to demonstrate the hand-off.
- Passport stamps are self-marked and stored on that browser, not location verification or rewards with monetary value.
- Use an instant curated trail if the device cannot load the AI. Say clearly that it is the non-AI fallback.

## What is implemented

- Transformers.js 4.2, quantized `Xenova/all-MiniLM-L6-v2`, WebAssembly in a browser worker.
- Meaning-based comparison between the request and 23 sourced venue/activity descriptions. Two editorial itineraries remain in the main directory but are not treated as individual stops.
- Normalized mean-pooled embeddings and cosine similarity, combined with mood preference and explicit filters for time, spending and shelter.
- Up to three stops, transfer allowances, source details, discovery missions, locally saved latest trail and passport, shareable stop-list URLs.
- Lazy-loaded quest component and AI worker; no model request until the visitor clicks the AI action. Model files are cached by the library where supported.

## Honest boundaries

This is semantic retrieval AI, not a generative LLM or an autonomous agent. The prose and missions come from curated content and rules. It does not confirm live hours, inventory, booking availability, weather, prices, accessibility or dietary suitability. Walking allowances are estimates and the stop diagram is not a geographic map. Shelter applies to destinations; transfers may still be outdoors. Dietary/allergy requests omit food stops because the directory does not verify those requirements.

The AI prompt and passport are processed/stored locally. Model assets are fetched from Hugging Face and the ONNX runtime CDN; photos and source links use third-party hosts. Shared URLs contain only known place IDs, not the prompt, passport or AI metadata. This application does not claim cross-device account persistence.

Vercel AI Gateway was tested during development but required a payment card. The shipped experience therefore uses working on-device AI with no API key or inference billing requirement.

## Validation

- Production build and TypeScript checks.
- 48 combinations of mood, time, spending and shelter plus malformed/duplicate share links and dietary filtering.
- Real browser inference verified: MiniLM returned an AI trail, including actual elapsed time in the explanation panel.
- Responsive browser checks, source details, passport persistence, sharing and curated fallback.

## Future work to describe as future work

Opt-in resident contributions and moderation; venue-verified opening data; route calculations from a mapping service; multilingual evaluation; and a controlled study of whether residents discover more independent businesses. These are not shipped features.

## Optional visual opening

Open **3D Pek Kio**, immediately beside AI Quest. Rotate the Blender miniature and switch to the street view. Explain that the coral façade is based on the Community Centre reference photo; surrounding buildings are illustrative. This is original Blender modelling, while the separate AI Quest performs real neural semantic matching. Keep those two technologies distinct in the pitch.
