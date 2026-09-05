"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Check,
  Clock,
  Share2,
  RefreshCw,
  ShieldCheck,
  BookOpen,
  CloudSun,
  Leaf,
  Utensils,
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  LoaderCircle,
  Stamp,
} from "lucide-react";
import { places, type Place } from "@/lib/places";
import { placePhoto } from "@/lib/photos";
import {
  corpus,
  modelId,
  planQuest,
  readSharedPlan,
  type QuestInput,
  type QuestPlan,
} from "@/lib/quest";
const moods = [
  {
    id: "foodie",
    label: "Makan mission",
    icon: Utensils,
    prompt: "Local hawker breakfast, a sweet treat and something to drink.",
  },
  {
    id: "chill",
    label: "Slow & easy",
    icon: Leaf,
    prompt: "I need a quiet break, green space and a relaxed coffee.",
  },
  {
    id: "culture",
    label: "Curious soul",
    icon: BookOpen,
    prompt: "Help me discover local history, art and neighbourhood stories.",
  },
  {
    id: "surprise",
    label: "Surprise me",
    icon: Compass,
    prompt: "I am new here. Show me a mix of food and unexpected things to do.",
  },
] as const;
const initial: QuestInput = {
  prompt: moods[0].prompt,
  mood: "foodie",
  minutes: 120,
  budget: "hawker",
  sheltered: false,
};
export default function Quest({
  onPlace,
}: {
  onPlace: (place: Place) => void;
}) {
  const [input, setInput] = useState<QuestInput>(initial);
  const [plan, setPlan] = useState<QuestPlan | null>(null);
  const [active, setActive] = useState(0);
  const [stamps, setStamps] = useState<string[]>([]);
  const [view, setView] = useState<"plan" | "passport">("plan");
  const [mobilePane, setMobilePane] = useState<"make" | "trail">("make");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [info, setInfo] = useState(false);
  const worker = useRef<Worker | null>(null);
  const job = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const infoDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("pekkio-passport-v1") || "[]",
      );
      if (Array.isArray(stored))
        setStamps(stored.filter((id) => places.some((p) => p.id === id)));
      const shared = readSharedPlan(
        new URLSearchParams(location.search).get("trail") || "",
      );
      if (shared) {
        setPlan(shared);
        setMobilePane("trail");
      } else {
        const saved = JSON.parse(
          localStorage.getItem("pekkio-quest-v1") || "null",
        );
        if (
          saved &&
          ["ai", "curated", "shared"].includes(saved.mode) &&
          Array.isArray(saved.stops) &&
          saved.stops.length <= 3 &&
          saved.stops.every((s: { id: string }) =>
            places.some((p) => p.id === s.id),
          )
        )
          setPlan(saved);
      }
    } catch {}
    return () => {
      worker.current?.terminate();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (info) infoDialog.current?.showModal();
    else infoDialog.current?.close();
  }, [info]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);
  function keep(next: QuestPlan) {
    const url = new URL(location.href);
    url.searchParams.delete("trail");
    history.replaceState(null, "", url);
    setPlan(next);
    setActive(0);
    setMobilePane("trail");
    setView("plan");
    try {
      localStorage.setItem("pekkio-quest-v1", JSON.stringify(next));
    } catch {
      setNotice(
        "This trail is available for this visit. Storage is unavailable.",
      );
    }
  }
  function stop() {
    job.current++;
    worker.current?.terminate();
    worker.current = null;
    if (timer.current) clearTimeout(timer.current);
    setBusy(false);
    setStatus("");
  }
  function instant() {
    stop();
    keep(planQuest(input));
  }
  function generate() {
    if (busy) return;
    const request = { ...input };
    const started = performance.now();
    setBusy(true);
    setProgress(null);
    setStatus("Starting your private AI guide");
    const current = ++job.current;
    const fail = () => {
      if (current !== job.current) return;
      stop();
      keep(planQuest(request));
      setNotice(
        "The AI could not load. This is a curated trail; retry AI when your connection is ready.",
      );
    };
    try {
      worker.current ??= new Worker(
        new URL("./quest.worker.js", import.meta.url),
        { type: "module" },
      );
      worker.current.onerror = fail;
      worker.current.onmessage = ({ data }) => {
        if (data.job !== job.current) return;
        if (data.type === "progress") {
          setStatus(data.text);
          setProgress(data.progress);
        } else if (data.type === "error") fail();
        else if (data.type === "result") {
          if (timer.current) clearTimeout(timer.current);
          setBusy(false);
          setStatus("");
          keep({
            ...planQuest(request, data.scores, "ai"),
            elapsedMs: Math.round(performance.now() - started),
          });
        }
      };
      worker.current.postMessage({
        job: current,
        query:
          request.prompt || moods.find((m) => m.id === request.mood)!.prompt,
        corpus,
      });
      timer.current = setTimeout(fail, 120000);
    } catch {
      fail();
    }
  }
  function stamp(id: string) {
    const next = stamps.includes(id)
      ? stamps.filter((x) => x !== id)
      : [...stamps, id];
    setStamps(next);
    try {
      localStorage.setItem("pekkio-passport-v1", JSON.stringify(next));
    } catch {
      setNotice("Stamp kept for this visit only.");
    }
    if (next.includes(id))
      setNotice("One more little memory. Passport stamped!");
  }
  async function share() {
    if (!plan) return;
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set("trail", plan.stops.map((s) => s.id).join(","));
    url.hash = "quest";
    try {
      await navigator.clipboard.writeText(url.toString());
      setNotice("Trail link copied. Your private prompt is not included.");
    } catch {
      setNotice("Copy the trail link from your address bar.");
      history.replaceState(null, "", url);
    }
  }
  const current = plan?.stops[active];
  const place = places.find((p) => p.id === current?.id);
  const level =
    stamps.length >= 10
      ? "Local legend"
      : stamps.length >= 6
        ? "Neighbourhood regular"
        : stamps.length >= 3
          ? "Curious explorer"
          : "New kid on the block";
  return (
    <div className="view quest-view">
      <div className="view-heading quest-heading">
        <div>
          <span className="eyebrow">
            <Sparkles size={12} /> A LITTLE ADVENTURE. A LOT MORE BELONGING.
          </span>
          <h1>
            Kampung <em>Quest.</em>
          </h1>
          <p>Your mood. Your time. A neighbourhood that feels like yours.</p>
        </div>
        <div className="quest-top-actions">
          <button className="quest-info" onClick={() => setInfo(true)}>
            <ShieldCheck size={15} />
            <span>How the AI works</span>
          </button>
          <button
            className={
              "passport-toggle " + (view === "passport" ? "active" : "")
            }
            onClick={() => setView(view === "passport" ? "plan" : "passport")}
          >
            <Stamp size={17} />
            <span>My passport</span>
            <b>{stamps.length}</b>
          </button>
        </div>
      </div>
      {view === "passport" ? (
        <section className="passport-page">
          <div className="passport-cover">
            <span className="eyebrow">REPUBLIC OF LITTLE ADVENTURES</span>
            <div className="passport-emblem">
              pk<span>✳</span>
            </div>
            <h2>
              Neighbourhood
              <br />
              passport
            </h2>
            <p>{level}</p>
            <strong>{stamps.length} / 23 places explored</strong>
            <small>
              Self-marked memories, saved on this device.
              <br />
              No GPS tracking. No account.
            </small>
            <button className="button cream" onClick={() => setView("plan")}>
              Find my next adventure <ArrowRight size={16} />
            </button>
          </div>
          <div className="stamp-collection">
            <h3>Small moments. Real connections.</h3>
            <p>
              Tap a stamp to revisit a place. Mark stops on your trail as
              explored to add them here.
            </p>
            <div className="stamp-grid">
              {stamps.length
                ? stamps.map((id) => {
                    const p = places.find((p) => p.id === id)!;
                    return (
                      <button
                        className="passport-stamp"
                        key={id}
                        onClick={() => onPlace(p)}
                      >
                        <span>{p.emoji}</span>
                        <strong>{p.name}</strong>
                        <small>PEK KIO · EXPLORED</small>
                      </button>
                    );
                  })
                : [1, 2, 3].map((i) => (
                    <div className="empty-stamp" key={i}>
                      <Stamp size={28} />
                      <span>Your next memory</span>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="quest-mobile-switch">
            <button
              aria-pressed={mobilePane === "make"}
              onClick={() => setMobilePane("make")}
            >
              1. Make my trail
            </button>
            <button
              aria-pressed={mobilePane === "trail"}
              onClick={() => setMobilePane("trail")}
            >
              2. Explore {plan ? "(" + plan.stops.length + ")" : ""}
            </button>
          </div>
          <div className={"quest-layout show-" + mobilePane}>
            <section className="quest-builder">
              <div className="builder-title">
                <span className="mini-sun">✳</span>
                <div>
                  <h2>What’s your kind of day?</h2>
                  <p>Start with a feeling. We’ll find the places.</p>
                </div>
              </div>
              <div className="mood-grid">
                {moods.map(({ id, label, icon: Icon, prompt }) => (
                  <button
                    key={id}
                    aria-pressed={input.mood === id}
                    onClick={() => setInput({ ...input, mood: id, prompt })}
                  >
                    <Icon size={19} />
                    {label}
                  </button>
                ))}
              </div>
              <label className="quest-label" htmlFor="quest-prompt">
                Tell us a little more
              </label>
              <textarea
                id="quest-prompt"
                value={input.prompt}
                onChange={(e) => setInput({ ...input, prompt: e.target.value })}
                maxLength={400}
                placeholder="I just moved here and want a quiet breakfast…"
              />
              <div className="quest-options">
                <label>
                  Time to wander
                  <select
                    value={input.minutes}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        minutes: Number(
                          e.target.value,
                        ) as QuestInput["minutes"],
                      })
                    }
                  >
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </label>
                <label>
                  Spending mood
                  <select
                    value={input.budget}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        budget: e.target.value as QuestInput["budget"],
                      })
                    }
                  >
                    <option value="hawker">Hawker & free stops</option>
                    <option value="treat">Open to paid stops</option>
                  </select>
                </label>
              </div>
              <button
                className="shelter-toggle"
                aria-pressed={input.sheltered}
                onClick={() =>
                  setInput({ ...input, sheltered: !input.sheltered })
                }
              >
                <CloudSun size={17} />
                <span>
                  Prefer sheltered stops
                  <small>Transfers may still be outdoors</small>
                </span>
                <span className="toggle-track">
                  <i />
                </span>
              </button>
              <div className="quest-generate">
                <button
                  className="button dark"
                  onClick={generate}
                  disabled={busy}
                >
                  {busy ? (
                    <LoaderCircle className="spin" size={17} />
                  ) : (
                    <Sparkles size={17} />
                  )}{" "}
                  {busy ? "Finding your little adventure" : "Make my AI trail"}
                  {!busy && <ArrowRight size={17} />}
                </button>
                {busy ? (
                  <div className="model-loading" role="status">
                    <span>
                      {status}
                      {progress !== null ? " · " + progress + "%" : ""}
                    </span>
                    <button onClick={stop}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p className="privacy-note">
                      <ShieldCheck size={12} /> Runs on your device. First use
                      downloads an AI model.
                    </p>
                    <button className="instant-link" onClick={instant}>
                      Or try an instant curated trail <ArrowUpRight size={12} />
                    </button>
                  </>
                )}
              </div>
            </section>
            <section
              className="quest-result"
              aria-label="Your neighbourhood trail"
              aria-busy={busy}
            >
              {plan && place && current ? (
                <>
                  <div className="route-heading">
                    <div>
                      <span className={"mode-badge " + plan.mode}>
                        {plan.mode === "ai" ? (
                          <Sparkles size={11} />
                        ) : (
                          <Compass size={11} />
                        )}{" "}
                        {plan.mode === "ai"
                          ? "ON-DEVICE AI"
                          : plan.mode === "shared"
                            ? "SHARED TRAIL"
                            : "CURATED TRAIL"}
                      </span>
                      <h2>{plan.title}</h2>
                    </div>
                    <button
                      className="share-trail"
                      onClick={share}
                      aria-label="Copy trail link"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                  <div className="trail-metadata">
                    <span>
                      <Clock size={13} />
                      {plan.minutes} min including transfer allowances
                    </span>
                    <span>{plan.stops.length} little discoveries</span>
                  </div>
                  <div
                    className="route-ribbon"
                    aria-label="Choose a trail stop"
                  >
                    <div className="route-line" />
                    {plan.stops.map((s, i) => {
                      const p = places.find((p) => p.id === s.id)!;
                      return (
                        <button
                          aria-pressed={active === i}
                          key={s.id}
                          onClick={() => setActive(i)}
                        >
                          <span
                            className={
                              "route-node " +
                              (stamps.includes(s.id) ? "stamped" : "")
                            }
                          >
                            {stamps.includes(s.id) ? (
                              <Check size={19} />
                            ) : (
                              p.emoji
                            )}
                            <b>{i + 1}</b>
                          </span>
                          <strong>{p.name.split(" · ")[0]}</strong>
                        </button>
                      );
                    })}
                    <small>
                      Illustrated stop sequence · not a geographic map
                    </small>
                  </div>
                  <article className="quest-stop" key={place.id}>
                    <button
                      className="quest-stop-image"
                      onClick={() => onPlace(place)}
                      aria-label={"View " + place.name}
                    >
                      <Image
                        src={placePhoto(place.id).src}
                        alt={placePhoto(place.id).alt}
                        fill
                        sizes="(max-width:700px) 100vw, 35vw"
                      />
                      <span>
                        {active + 1} / {plan.stops.length} · {current.minutes}{" "}
                        min
                      </span>
                      {placePhoto(place.id).note && (
                        <small>{placePhoto(place.id).note}</small>
                      )}
                    </button>
                    <div className="quest-stop-copy">
                      <span className="eyebrow">
                        {place.kind} · {place.area}
                      </span>
                      <h3>
                        <button onClick={() => onPlace(place)}>
                          {place.name}
                          <ArrowUpRight size={17} />
                        </button>
                      </h3>
                      <p className="match-reason">{current.why}</p>
                      <div className="tiny-mission">
                        <span>YOUR LITTLE MISSION</span>
                        <p>{current.mission}</p>
                      </div>
                      <div className="stop-buttons">
                        <button
                          className={
                            "stamp-button " +
                            (stamps.includes(place.id) ? "stamped" : "")
                          }
                          aria-pressed={stamps.includes(place.id)}
                          onClick={() => stamp(place.id)}
                        >
                          {stamps.includes(place.id) ? (
                            <Check size={15} />
                          ) : (
                            <Stamp size={15} />
                          )}{" "}
                          {stamps.includes(place.id)
                            ? "Explored!"
                            : "Mark explored"}
                        </button>
                        <button onClick={() => onPlace(place)}>
                          Tips & sources <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                  <div className="quest-bottom">
                    <p>{plan.note}</p>
                    <div>
                      <button
                        aria-label="Previous stop"
                        disabled={active === 0}
                        onClick={() => setActive(active - 1)}
                      >
                        <ChevronLeft size={17} />
                      </button>
                      <button
                        aria-label="Next stop"
                        disabled={active === plan.stops.length - 1}
                        onClick={() => setActive(active + 1)}
                      >
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="quest-empty">
                  <div className="orbit-art">
                    <span className="orbit orbit-one" />
                    <span className="orbit orbit-two" />
                    <i className="orbit-food">🥢</i>
                    <i className="orbit-tree">🌿</i>
                    <i className="orbit-art-icon">🎨</i>
                    <div className="quest-mascot">
                      pk<span>✳</span>
                      <small>LET’S GO, NEIGHBOUR</small>
                    </div>
                  </div>
                  <span className="eyebrow">LESS SEARCHING. MORE LIVING.</span>
                  <h2>
                    A whole neighbourhood.
                    <br />
                    <em>One very you adventure.</em>
                  </h2>
                  <p>
                    Find a new breakfast ritual. Take the scenic detour.
                    <br />
                    Turn “I live here” into “I belong here”.
                  </p>
                  <div className="quest-proof">
                    <span>
                      <ShieldCheck size={14} /> Private by design
                    </span>
                    <span>
                      <BookOpen size={14} /> 23 sourced places
                    </span>
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}
      {notice && (
        <div className="quest-notice" role="status">
          {notice}
        </div>
      )}
      <dialog
        ref={infoDialog}
        className="quest-explainer"
        onCancel={() => setInfo(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setInfo(false);
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close AI explanation"
          onClick={() => setInfo(false)}
        >
          <X size={19} />
        </button>
        <div className="detail-body">
          <span className="eyebrow">SMALL MODEL. LOCAL KNOWLEDGE.</span>
          <h2>AI with a neighbourhood compass.</h2>
          <p>
            A semantic search model understands the meaning of your request and
            compares it with our sourced place guide. A separate planner applies
            the time, spending and shelter choices.
          </p>
          <ol className="ai-flow">
            <li>
              <b>01</b>
              <span>
                <strong>Your words become a vector</strong>MiniLM encodes
                meaning in 384 dimensions, inside a browser worker.
              </span>
            </li>
            <li>
              <b>02</b>
              <span>
                <strong>Find the local matches</strong>Cosine similarity ranks
                23 researched places. No invented venues.
              </span>
            </li>
            <li>
              <b>03</b>
              <span>
                <strong>Build a practical little trail</strong>Rules fit up to
                three stops into your time, with source links and visit tips.
              </span>
            </li>
          </ol>
          <p>
            Your prompt and passport stay on this device. The model downloads
            from Hugging Face; venue photos load from their publishers. This is
            semantic AI, not a generative chatbot. It does not know live opening
            hours, weather or walking times.
          </p>
          <p>
            If AI cannot load, the app labels the result “Curated trail”. You
            can use that mode without downloading a model.
          </p>
          <a
            className="source-link"
            href={"https://huggingface.co/" + modelId}
            target="_blank"
            rel="noreferrer"
          >
            Open model card <ArrowUpRight size={13} />
          </a>
          {plan?.mode === "ai" && (
            <small>
              Last trail: {plan.model} ·{" "}
              {((plan.elapsedMs || 0) / 1000).toFixed(1)} seconds including any
              first-load time ·{" "}
              {new Date(plan.createdAt).toLocaleString("en-SG")}
            </small>
          )}
        </div>
      </dialog>
    </div>
  );
}
