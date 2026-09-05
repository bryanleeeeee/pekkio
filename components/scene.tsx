"use client";
import { createElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Box,
  RotateCcw,
  Move,
  Download,
  ArrowUpRight,
  Camera,
  LoaderCircle,
  MapPin,
  Maximize2,
} from "lucide-react";
import district from "@/public/data/district.json";
type Anchor = (typeof district.anchors)[number];
const landmarkLabels: Record<string, string> = {
  cc: "Pek Kio CC",
  market: "Pek Kio Market",
  park: "Pek Kio Park",
  farrer: "Farrer Park MRT",
  little: "Little India MRT",
  novena: "Novena MRT",
  heritage: "Indian Heritage Centre",
  mall: "City Square Mall",
};
const landmarks = [
  "cc",
  "market",
  "park",
  "farrer",
  "little",
  "heritage",
  "mall",
  "novena",
]
  .map((id) => district.anchors.find((a) => a.id === id)!)
  .filter(Boolean);
const closeups = [
  { name: "Street view", orbit: "10deg 75deg 110%" },
  { name: "Bird’s-eye", orbit: "35deg 50deg 110%" },
  { name: "School side", orbit: "-50deg 65deg 110%" },
];
export default function Scene() {
  const [ready, setReady] = useState(false);
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width:700px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const overviewOrbit = small ? "25deg 55deg 105%" : "25deg 62deg 75%";
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [picture, setPicture] = useState(false);
  const [scale, setScale] = useState<"district" | "cc">("district");
  const [focus, setFocus] = useState("overview");
  const [close, setClose] = useState(1);
  const [progress, setProgress] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const wide = scale === "district";
  const asset = wide ? "pek-kio-district" : "pek-kio-cc";
  const selected = landmarks.find((a) => a.id === focus);
  const orbit = wide
    ? selected
      ? `0deg 50deg ${selected.id === "novena" ? 18 : 12}m`
      : overviewOrbit
    : closeups[close].orbit;
  const target =
    wide && selected
      ? `${selected.x}m ${("height" in selected ? selected.height : 0) || 0}m ${selected.z}m`
      : "auto auto auto";
  useEffect(() => {
    let live = true;
    import("@google/model-viewer")
      .then(() => {
        if (live) setReady(true);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const el = host.current?.querySelector("model-viewer");
    if (!el) return;
    const success = () => {
      setLoaded(true);
      setProgress(100);
    };
    const fail = () => setFailed(true);
    const update = (e: Event) =>
      setProgress(
        Math.round(((e as CustomEvent).detail.totalProgress || 0) * 100),
      );
    el.addEventListener("load", success);
    el.addEventListener("error", fail);
    el.addEventListener("progress", update);
    if ((el as HTMLElement & { loaded?: boolean }).loaded) success();
    return () => {
      el.removeEventListener("load", success);
      el.removeEventListener("error", fail);
      el.removeEventListener("progress", update);
    };
  }, [ready, scale]);
  function switchScale(next: "district" | "cc") {
    if (next !== scale) {
      setScale(next);
      setLoaded(false);
      setFailed(false);
      setProgress(0);
    }
    setPicture(false);
    setFocus("overview");
    setClose(1);
  }
  function go(id: string) {
    setFocus(id);
    setPicture(false);
    const a = landmarks.find((x) => x.id === id);
    const e = host.current?.querySelector("model-viewer");
    e?.setAttribute(
      "camera-target",
      a
        ? `${a.x}m ${("height" in a ? a.height : 0) || 0}m ${a.z}m`
        : "auto auto auto",
    );
    e?.setAttribute(
      "camera-orbit",
      a ? `0deg 50deg ${a.id === "novena" ? 18 : 12}m` : overviewOrbit,
    );
  }
  function reset() {
    setPicture(false);
    if (wide) go("overview");
    else {
      setClose(1);
      const e = host.current?.querySelector("model-viewer");
      e?.setAttribute("camera-target", "auto auto auto");
      e?.setAttribute("camera-orbit", closeups[1].orbit);
    }
  }
  const hotspot = (a: Anchor) =>
    createElement(
      "button",
      {
        key: a.id,
        slot: "hotspot-" + a.id,
        "data-position": `${a.x} ${("pinHeight" in a ? a.pinHeight : undefined) || (("height" in a ? a.height : 0) || 0) + 0.7} ${a.z}`,
        "data-normal": "0 1 0",
        className: "district-hotspot " + (focus === a.id ? "active" : ""),
        "aria-label": "Explore " + landmarkLabels[a.id],
        onClick: () => go(a.id),
      },
      createElement(
        "span",
        { className: "hotspot-dot" },
        a.id === "cc" ? "★" : "•",
      ),
      createElement(
        "span",
        { className: "hotspot-name" },
        landmarkLabels[a.id],
      ),
    );
  return (
    <div className="view scene-view district-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">
            MADE IN BLENDER · GROUNDED IN THE NEIGHBOURHOOD
          </span>
          <h1>
            Pek Kio. <em>Beyond the block.</em>
          </h1>
          <p>
            Streets, parks and buildings across a 1.5 km radius. Find your place
            in the bigger picture.
          </p>
        </div>
        <div className="scene-scale" aria-label="3D scene scale">
          <button aria-pressed={wide} onClick={() => switchScale("district")}>
            <Maximize2 size={14} />
            Neighbourhood
          </button>
          <button aria-pressed={!wide} onClick={() => switchScale("cc")}>
            <Box size={14} />
            CC miniature
          </button>
        </div>
      </div>
      <div className="district-guide">
        <div className="district-selector">
          <MapPin size={15} />
          <label htmlFor="landmark-focus" className="sr-only">
            Fly to a landmark
          </label>
          <select
            id="landmark-focus"
            value={wide ? focus : "cc-detail"}
            onChange={(e) => {
              if (!wide) switchScale("district");
              go(e.target.value);
            }}
          >
            {!wide && <option value="cc-detail">Detailed CC miniature</option>}
            <option value="overview">Whole neighbourhood · 1.5 km</option>
            {landmarks.map((a) => (
              <option value={a.id} key={a.id}>
                {landmarkLabels[a.id]}
              </option>
            ))}
          </select>
        </div>
        <span>
          {wide ? (
            <>
              <b>{district.stats.buildings.toLocaleString("en-SG")}</b> building
              shapes & parts · <b>{district.stats.greenAreas}</b> green / water
              areas
            </>
          ) : (
            "The original photo-inspired Community Centre miniature"
          )}
        </span>
      </div>
      <section
        className="scene-stage"
        aria-label={
          wide
            ? "3D Pek Kio neighbourhood within 1.5 kilometres"
            : "3D Pek Kio Community Centre"
        }
      >
        <div className="scene-corner-label">
          <Box size={15} />
          <span>
            {wide
              ? selected
                ? landmarkLabels[selected.id]
                : "PEK KIO & NEIGHBOURS"
              : "PEK KIO COMMUNITY CENTRE"}
            <small>
              {wide
                ? "1.5 km radius · 3 km across · map-based geometry"
                : "21 Gloucester Road · photo-inspired miniature"}
            </small>
          </span>
        </div>
        <div
          ref={host}
          className={"scene-canvas " + (picture || failed ? "still-mode" : "")}
        >
          {ready &&
            !failed &&
            createElement(
              "model-viewer",
              {
                key: asset,
                src: `/models/${asset}.glb`,
                poster: `/models/${asset}.webp`,
                alt: wide
                  ? "Interactive Blender model of a 1.5 kilometre radius around Pek Kio CC, with mapped building footprints, roads and green spaces"
                  : "Interactive pastel miniature of Pek Kio Community Centre",
                "camera-controls": true,
                "camera-orbit": orbit,
                "camera-target": target,
                "min-camera-orbit": wide ? "auto 10deg 3%" : "auto 15deg 45%",
                "max-camera-orbit": "auto 85deg 180%",
                "shadow-intensity": wide ? ".4" : "1",
                "shadow-softness": "1",
                "environment-image": "neutral",
                exposure: wide ? ".65" : ".9",
                "interaction-prompt": "none",
                "touch-action": "pan-y",
                style: {
                  width: "100%",
                  height: "100%",
                  background: "#e9eddf",
                  display: picture ? "none" : "block",
                },
              },
              ...(wide ? landmarks.map(hotspot) : []),
            )}
          {(picture || failed || !ready) && (
            <Image
              src={`/models/${asset}.webp`}
              alt={
                wide
                  ? "Blender-rendered map miniature of Pek Kio and neighbouring areas"
                  : "Blender-rendered Pek Kio Community Centre miniature"
              }
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
        <div className="scene-bottom-overlay">
          <span>
            {picture || failed ? (
              <>
                <Camera size={13} /> Blender-rendered picture
              </>
            ) : !loaded ? (
              <>
                <LoaderCircle size={13} className="spin" /> Loading 3D
                {progress ? " · " + progress + "%" : "…"}
              </>
            ) : (
              <>
                <Move size={13} /> Drag to orbit · pinch to zoom
                {wide ? " · tap a pin" : ""}
              </>
            )}
          </span>
          {wide ? (
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              © OpenStreetMap contributors · ODbL
            </a>
          ) : (
            <span>Artistic interpretation · not to scale</span>
          )}
        </div>
      </section>
      <div className="scene-toolbar">
        <div className="scene-presets" aria-label="Camera views">
          {wide ? (
            <>
              <button
                aria-pressed={focus === "overview" && !picture}
                onClick={() => go("overview")}
              >
                <Maximize2 size={13} />
                Overview
              </button>
              <button
                aria-pressed={focus === "cc" && !picture}
                onClick={() => go("cc")}
              >
                CC
              </button>
              <button
                aria-pressed={focus === "market" && !picture}
                onClick={() => go("market")}
              >
                Market
              </button>
              <button
                aria-pressed={focus === "little" && !picture}
                onClick={() => go("little")}
              >
                Little India
              </button>
            </>
          ) : (
            closeups.map((p, i) => (
              <button
                key={p.name}
                aria-pressed={close === i && !picture}
                disabled={failed}
                onClick={() => {
                  setPicture(false);
                  setClose(i);
                }}
              >
                <Camera size={13} />
                {p.name}
              </button>
            ))
          )}
          <button aria-pressed={picture} onClick={() => setPicture(!picture)}>
            <Camera size={13} />
            Picture
          </button>
        </div>
        <div className="scene-downloads">
          <button onClick={reset} aria-label="Reset 3D view">
            <RotateCcw size={15} />
          </button>
          <a href={`/models/${asset}.webp`} download>
            <Download size={14} />
            <span>Picture</span>
          </a>
          <a href={`/models/${asset}.blend`} download>
            <Download size={14} />
            <span>Blender file</span>
          </a>
        </div>
      </div>
      <p className="scene-footnote">
        {wide ? (
          <>
            A 1.5 km exploration area, not the official Pek Kio boundary. Flat
            ground; roofs and courtyards simplified. Heights use map tags,
            storeys or estimates.{" "}
            <a href="/data/district.json" target="_blank" rel="noreferrer">
              Model details
            </a>{" "}
            ·{" "}
            <a href="/data/pekkio-osm.json.gz" download>
              Source map data (ODbL)
            </a>
            .
          </>
        ) : (
          <>
            Photo-inspired CC façade with illustrative surroundings.{" "}
            <a
              href="https://www.onepa.gov.sg/cc/pek-kio-cc"
              target="_blank"
              rel="noreferrer"
            >
              Reference
            </a>
            .
          </>
        )}
        {failed
          ? " Interactive 3D is unavailable; the rendered picture is shown."
          : ""}
      </p>
    </div>
  );
}
