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
} from "lucide-react";
const presets = [
  { name: "Street view", orbit: "10deg 75deg 110%", target: "auto auto auto" },
  { name: "Bird’s-eye", orbit: "35deg 50deg 110%", target: "auto auto auto" },
  { name: "School side", orbit: "-50deg 65deg 110%", target: "auto auto auto" },
];
export default function Scene() {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [picture, setPicture] = useState(false);
  const [angle, setAngle] = useState(1);
  const host = useRef<HTMLDivElement>(null);
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
    const success = () => setLoaded(true);
    const fail = () => setFailed(true);
    el.addEventListener("load", success);
    el.addEventListener("error", fail);
    return () => {
      el.removeEventListener("load", success);
      el.removeEventListener("error", fail);
    };
  }, [ready]);
  return (
    <div className="view scene-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">A LITTLE WORLD, MADE IN BLENDER</span>
          <h1>
            Pek Kio. <em>A new perspective.</em>
          </h1>
          <p>
            A pastel miniature of the Community Centre and its school-side
            surroundings.
          </p>
        </div>
        <a
          className="scene-source"
          href="https://www.onepa.gov.sg/cc/pek-kio-cc"
          target="_blank"
          rel="noreferrer"
        >
          Meet the real place <ArrowUpRight size={14} />
        </a>
      </div>
      <section className="scene-stage" aria-label="3D Pek Kio Community Centre">
        <div className="scene-corner-label">
          <Box size={15} />
          <span>
            PEK KIO COMMUNITY CENTRE
            <small>21 Gloucester Road · photo-inspired miniature</small>
          </span>
        </div>
        <div
          ref={host}
          className={"scene-canvas " + (picture || failed ? "still-mode" : "")}
        >
          {ready &&
            !failed &&
            createElement("model-viewer", {
              src: "/models/pek-kio-cc.glb",
              poster: "/models/pek-kio-cc.webp",
              alt: "Interactive pastel 3D miniature of Pek Kio Community Centre, its coral facade, covered entrance, adjoining school and trees",
              "camera-controls": true,
              "camera-orbit": presets[angle].orbit,
              "camera-target": presets[angle].target,
              "min-camera-orbit": "auto 15deg 45%",
              "max-camera-orbit": "auto 85deg 180%",
              "shadow-intensity": "1",
              "shadow-softness": "1",
              "environment-image": "neutral",
              exposure: "0.9",
              "interaction-prompt": "none",
              "touch-action": "pan-y",
              style: {
                width: "100%",
                height: "100%",
                background: "#e9eddf",
                display: picture ? "none" : "block",
              },
            })}
          {(picture || failed || !ready) && (
            <Image
              src="/models/pek-kio-cc.webp"
              alt="Blender-rendered isometric miniature of Pek Kio Community Centre and its surroundings"
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
                <LoaderCircle size={13} className="spin" /> Loading the 3D
                miniature…
              </>
            ) : (
              <>
                <Move size={13} /> Drag to orbit · scroll or pinch to zoom
              </>
            )}
          </span>
          <span>Artistic interpretation · not to scale</span>
        </div>
      </section>
      <div className="scene-toolbar">
        <div className="scene-presets" aria-label="Camera views">
          {presets.map((p, i) => (
            <button
              aria-pressed={!picture && angle === i}
              disabled={failed}
              key={p.name}
              onClick={() => {
                setPicture(false);
                setAngle(i);
              }}
            >
              {i === 1 ? <Box size={13} /> : <Camera size={13} />} {p.name}
            </button>
          ))}
          <button aria-pressed={picture} onClick={() => setPicture(!picture)}>
            <Camera size={13} /> Picture
          </button>
        </div>
        <div className="scene-downloads">
          <button
            onClick={() => {
              setPicture(false);
              setAngle(1);
              const el = host.current?.querySelector("model-viewer");
              el?.setAttribute("camera-orbit", presets[1].orbit);
              el?.setAttribute("camera-target", presets[1].target);
            }}
            aria-label="Reset 3D view"
          >
            <RotateCcw size={15} />
          </button>
          <a href="/models/pek-kio-cc.webp" download>
            <Download size={14} />
            <span>Picture</span>
          </a>
          <a href="/models/pek-kio-cc.blend" download>
            <Download size={14} />
            <span>Blender file</span>
          </a>
        </div>
      </div>
      <p className="scene-footnote">
        Created in Blender from the centre’s recognisable façade. The school and
        nearby streets are simplified context.{" "}
        {failed
          ? "Interactive 3D is unavailable on this device; the rendered picture is shown."
          : ""}
      </p>
    </div>
  );
}
