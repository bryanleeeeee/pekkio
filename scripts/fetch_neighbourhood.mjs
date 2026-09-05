import { writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
const query = `[out:json][timeout:90];(way[building](around:1500,1.31308,103.85138);relation[building](around:1500,1.31308,103.85138);way["building:part"](around:1500,1.31308,103.85138);relation["building:part"](around:1500,1.31308,103.85138);way[highway](around:1550,1.31308,103.85138);way[waterway](around:1550,1.31308,103.85138);way[natural=water](around:1500,1.31308,103.85138);way[leisure~"park|garden|pitch"](around:1500,1.31308,103.85138);nwr[name][amenity~"marketplace|community_centre|hospital|school"](around:1500,1.31308,103.85138);nwr[name][railway=station](around:1500,1.31308,103.85138););out body geom;`;
const endpoints = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
let fetched = false;
for (const url of endpoints) {
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "PekKioCommunityGuide/1.0 (neighbourhood Blender visualisation)",
      },
      body: new URLSearchParams({ data: query }),
      signal: AbortSignal.timeout(105000),
    });
    if (!r.ok) throw Error("HTTP " + r.status);
    const j = await r.json();
    if (!j.elements?.length || j.remark) throw Error(j.remark || "No map data");
    writeFileSync("public/data/pekkio-osm.json", JSON.stringify(j));
    writeFileSync(
      "public/data/pekkio-osm.json.gz",
      gzipSync(JSON.stringify(j), { level: 9 }),
    );
    writeFileSync(
      "public/data/map-source.json",
      JSON.stringify(
        {
          center: { lat: 1.31308, lon: 103.85138 },
          radiusMeters: 1500,
          retrievedAt: new Date().toISOString(),
          endpoint: url,
          query,
          licence: "ODbL 1.0",
          attribution: "© OpenStreetMap contributors",
          url: "https://www.openstreetmap.org/copyright",
        },
        null,
        2,
      ),
    );
    console.log(
      JSON.stringify({
        elements: j.elements.length,
        buildings: j.elements.filter((e) => e.tags?.building).length,
        roads: j.elements.filter((e) => e.tags?.highway).length,
      }),
    );
    fetched = true;
    break;
  } catch (e) {
    console.log(url, e.message);
  }
}

if (!fetched)
  throw new Error(
    "All map endpoints failed; existing snapshot was not refreshed.",
  );
