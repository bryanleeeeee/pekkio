"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Heart,
  MapPin,
  Compass,
  Utensils,
  Sun,
  Newspaper,
  X,
  Check,
  Menu,
  TrainFront,
  Sparkles,
} from "lucide-react";
import { places, type Place } from "@/lib/places";
import type { Story } from "@/lib/news";
const maps = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " Singapore")}`;
function Neighbourhood() {
  return (
    <svg
      viewBox="0 0 650 460"
      role="img"
      aria-label="A playful illustration of Pek Kio: pastel flats, a hawker centre, leafy trees and neighbours"
    >
      <defs>
        <pattern
          id="windows"
          width="36"
          height="43"
          patternUnits="userSpaceOnUse"
        >
          <rect x="9" y="9" width="15" height="23" rx="3" fill="#fcf4dd" />
          <path d="M16 10v21" stroke="#bd877a" strokeWidth="2" />
        </pattern>
      </defs>
      <circle cx="348" cy="232" r="195" fill="#e5e9ce" />
      <g fill="#fffdf2">
        <path d="M40 113c-13-28 26-46 43-25 23-38 65-10 56 15 24 0 28 22 13 25H43z" />
        <path d="M455 65c-10-23 20-35 34-19 18-30 52-8 44 12 23-1 24 19 10 20h-85z" />
      </g>
      <circle cx="527" cy="131" r="35" fill="#ffcb68" />
      <g stroke="#edaf46" strokeWidth="3" strokeLinecap="round">
        <path d="M527 82v-9m0 116v-9m49-49h9m-116 0h9m85-36 7-7m-85 85 7-7" />
      </g>
      <ellipse cx="336" cy="402" rx="284" ry="35" fill="#d5dec0" />
      <path
        d="M93 390c120-62 261-33 410 27"
        fill="none"
        stroke="#fff8e9"
        strokeWidth="32"
      />
      <g transform="translate(357 109) rotate(3)">
        <rect width="139" height="263" rx="7" fill="#c4b8d8" />
        <rect x="10" y="12" width="119" height="234" fill="url(#windows)" />
        <path d="M-8 0h155v14H-8z" fill="#a799bf" />
        <rect x="59" y="208" width="24" height="55" rx="4" fill="#786f92" />
      </g>
      <g transform="translate(210 71) rotate(-3)">
        <rect width="155" height="300" rx="8" fill="#eca895" />
        <rect x="12" y="20" width="130" height="255" fill="url(#windows)" />
        <path d="M-8 0h171v15H-8z" fill="#d78878" />
        <rect x="14" y="125" width="127" height="8" fill="#d98b7c" />
        <rect x="14" y="214" width="127" height="8" fill="#d98b7c" />
        <rect x="62" y="255" width="31" height="45" fill="#a66d62" />
      </g>
      <g transform="translate(86 261)">
        <rect x="0" y="0" width="278" height="117" rx="5" fill="#f6e5b6" />
        <path d="M-17 4 15-25h242l35 29" fill="#427461" />
        <rect x="17" y="16" width="244" height="30" rx="4" fill="#fff8e7" />
        <text
          x="139"
          y="37"
          textAnchor="middle"
          fill="#315845"
          fontSize="14"
          fontFamily="Arial"
          fontWeight="bold"
          letterSpacing="2"
        >
          PEK KIO MARKET
        </text>
        <path d="M10 55h258v15H10z" fill="#e4937f" />
        {[16, 57, 98, 139, 180, 221].map((x) => (
          <g key={x}>
            <path d={`M${x} 55h24l5 17h-34z`} fill="#fff3d8" />
            <rect x={x} y="77" width="29" height="40" fill="#55695a" />
          </g>
        ))}
        <path
          d="M-8 118h294"
          stroke="#cdbd99"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      <g stroke="#7e7850" strokeWidth="8" strokeLinecap="round">
        <path d="M73 341V208m0 60-25-29m25 11 23-27M533 365V249m0 35 22-26" />
      </g>
      <g fill="#719b72">
        <circle cx="53" cy="214" r="36" />
        <circle cx="87" cy="197" r="44" />
        <circle cx="97" cy="235" r="31" />
        <circle cx="515" cy="237" r="37" />
        <circle cx="549" cy="226" r="33" />
        <circle cx="554" cy="255" r="29" />
      </g>
      <g fill="#93b285">
        <circle cx="63" cy="192" r="24" />
        <circle cx="536" cy="218" r="24" />
      </g>
      <g transform="translate(428 334)">
        <circle cx="0" cy="0" r="10" fill="#bc8060" />
        <path d="M-12 16q12-10 24 0l4 28h-32z" fill="#f1b054" />
        <path
          d="M-7 44v25m14-25 7 25"
          stroke="#516558"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="m-12 18-12 18m36-18 17 7"
          stroke="#bc8060"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(474 342)">
        <circle r="9" fill="#946445" />
        <path d="M-11 14h22l6 30h-34z" fill="#d6aad0" />
        <path
          d="M-6 44v19m13-19 4 19"
          stroke="#61664e"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(149 381)">
        <ellipse cx="0" cy="10" rx="19" ry="9" fill="#e1a96b" />
        <circle cx="16" cy="0" r="9" fill="#e1a96b" />
        <path
          d="m10-5 0-10 8 8m-29 18q-20-17-17 0"
          fill="none"
          stroke="#cf9056"
          strokeWidth="5"
        />
        <circle cx="19" cy="0" r="1.5" />
      </g>
      <g fill="#f7fbef">
        <path d="m179 182 5 11 12 4-12 4-5 12-4-12-12-4 12-4z" />
        <path d="m576 326 4 9 10 4-10 4-4 9-4-9-9-4 9-4z" />
      </g>
    </svg>
  );
}
export default function Guide({
  news,
}: {
  news: { stories: Story[]; live: boolean };
}) {
  const [category, setCategory] = useState("All");
  const [audience, setAudience] = useState("Everyone");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const [menu, setMenu] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("pekkio-saved-v1") || "[]");
      const d = JSON.parse(localStorage.getItem("pekkio-done-v1") || "[]");
      if (Array.isArray(s)) setSaved(s.filter((x) => typeof x === "string"));
      if (Array.isArray(d)) setDone(d.filter((x) => typeof x === "string"));
    } catch {}
  }, []);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  const persist = (key: string, value: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setNotice("Storage unavailable. Your choices will last for this visit.");
    }
  };
  function save(id: string) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    persist("pekkio-saved-v1", next);
    setNotice(
      next.includes(id)
        ? "Added to your little local list ♥"
        : "Removed from your saved places",
    );
  }
  function discover(value = "All", only = false) {
    setCategory(value);
    setSavedOnly(only);
    setMenu(false);
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  }
  const results = places.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (audience === "Everyone" || p.audience.includes(audience)) &&
      (!savedOnly || saved.includes(p.id)) &&
      `${p.name} ${p.tag} ${p.description} ${p.address}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header>
        <a className="brand" href="#" aria-label="Pek Kio home">
          <span className="brand-icon">
            pk<span>✳</span>
          </span>
          <span>
            pek kio
            <span className="brand-sub">YOUR NEIGHBOURHOOD, DISCOVERED.</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className={menu ? "open" : ""}>
          <a href="#explore" onClick={() => discover()}>
            Explore
          </a>
          <a href="#explore" onClick={() => discover("Food")}>
            Good food
          </a>
          <a href="#explore" onClick={() => discover("Activities")}>
            Things to do
          </a>
          <a href="#news" onClick={() => setMenu(false)}>
            The local buzz
          </a>
        </nav>
        <button
          className="saved-button"
          aria-label="View my saved places"
          onClick={() => discover("All", true)}
        >
          <Heart size={17} /> <span>My little list</span>
          <b>{saved.length}</b>
        </button>
        <button
          className="menu"
          aria-label="Toggle navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <Menu />
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="little-sun">✳</span> SMALL NEIGHBOURHOOD. BIG
              HEART.
            </span>
            <h1>
              A little corner.
              <br />A whole lot
              <br />
              to{" "}
              <span className="love">
                love.
                <svg viewBox="0 0 250 20" aria-hidden="true">
                  <path
                    d="M4 12Q110-3 243 10M30 18q105-9 183-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="hero-star">✳</span>
            </h1>
            <p>
              Good makan. Great company. Everyday discoveries.
              <br className="desktop" /> Get to know Pek Kio, one little
              adventure at a time.
            </p>
            <div className="hero-actions">
              <a className="button dark" href="#explore">
                Find your next favourite <ArrowUpRight size={19} />
              </a>
              <a className="text-link" href="#new-here">
                New here? Start here <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-foot">
              <span className="avatar-stack">
                <i>☺</i>
                <i>☺</i>
                <i>☺</i>
              </span>
              <span>
                For the old kakis.
                <br />
                <strong>And the new kids on the block.</strong>
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-note note-top">📍 Right here in Singapore</div>
            <Neighbourhood />
            <div className="art-note note-bottom">
              Made of good food & good neighbours <Heart size={15} />
            </div>
            <span className="hand-note">your next happy place ↗</span>
          </div>
        </section>
        <div className="ribbon">
          <span>GOOD FOOD</span>✳<span>FAMILIAR FACES</span>✳
          <span>HIDDEN GEMS</span>✳<span>KAMPUNG SPIRIT</span>✳
          <span>YOUR KIND OF PLACE</span>✳
        </div>
        <section id="explore" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STEP OUT. GET CURIOUS.</span>
              <h2>
                What’s your kind of day? <span className="tiny-spark">✧</span>
              </h2>
              <p>A good bite, a new hobby, or simply somewhere to belong.</p>
            </div>
            <span className="hand-note desktop">
              There’s a little something for everyone.
            </span>
          </div>
          <div className="category-grid">
            {[
              {
                name: "All",
                title: "A bit of everything",
                subtitle: "Let the neighbourhood surprise you",
                Icon: Compass,
                color: "mint",
              },
              {
                name: "Food",
                title: "Eat your heart out",
                subtitle: "Hawker heroes & everyday favourites",
                Icon: Utensils,
                color: "peach",
              },
              {
                name: "Activities",
                title: "Make a day of it",
                subtitle: "Get moving, get creative, get together",
                Icon: Sun,
                color: "lavender",
              },
            ].map(({ name, title, subtitle, Icon, color }) => (
              <button
                key={name}
                className={`category ${color} ${category === name ? "active" : ""}`}
                onClick={() => {
                  setCategory(name);
                  setSavedOnly(false);
                }}
                aria-pressed={category === name && !savedOnly}
              >
                <Icon size={27} />
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <ArrowUpRight size={21} />
              </button>
            ))}
          </div>
          <div className="discovery-bar">
            <div>
              <h3>
                {savedOnly
                  ? "Your little local list"
                  : category === "Food"
                    ? "Good food, happy mood"
                    : category === "Activities"
                      ? "Go on, try something new"
                      : "The neighbourhood shortlist"}
              </h3>
              <span>
                {savedOnly
                  ? "Saved on this device. Ready when you are."
                  : "Handpicked places. Plenty of Pek Kio personality."}
              </span>
            </div>
            <div className="search">
              <Search size={18} />
              <input
                aria-label="Search places"
                placeholder="Find your kind of good…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="filter-row">
            <div className="pills" aria-label="Filter by audience">
              {["Everyone", "Youths", "Adults"].map((a) => (
                <button
                  key={a}
                  aria-pressed={a === audience}
                  className={a === audience ? "chosen" : ""}
                  onClick={() => setAudience(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <span aria-live="polite">
              {results.length} little discoveries
              {savedOnly && (
                <button
                  className="inline-button"
                  onClick={() => setSavedOnly(false)}
                >
                  Show all
                </button>
              )}
            </span>
          </div>
          <div className="places-grid">
            {results.map((place, i) => (
              <article
                className="place-card"
                key={place.id}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className={`place-visual ${place.color}`}>
                  <span className="card-label">
                    {place.category === "Food" ? "GOOD MAKAN" : "GO & DO"}
                  </span>
                  <button
                    className={`heart ${saved.includes(place.id) ? "is-saved" : ""}`}
                    aria-label={`${saved.includes(place.id) ? "Unsave" : "Save"} ${place.name}`}
                    aria-pressed={saved.includes(place.id)}
                    onClick={() => save(place.id)}
                  >
                    <Heart
                      size={19}
                      fill={saved.includes(place.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <span className="food-doodle" aria-hidden="true">
                    {place.emoji}
                  </span>
                  <span className="doodle-star star-one">✦</span>
                  <span className="doodle-star star-two">✧</span>
                  <span className="visual-caption">{place.tag}</span>
                </div>
                <div className="card-body">
                  <span className="location">
                    <MapPin size={13} />
                    {place.address.split(",")[0]}
                  </span>
                  <h3>
                    <button onClick={() => setSelected(place)}>
                      {place.name}
                      <ArrowUpRight size={20} />
                    </button>
                  </h3>
                  <p>{place.description}</p>
                  <button
                    className="card-link"
                    onClick={() => setSelected(place)}
                  >
                    Take a little look <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {results.length === 0 && (
            <div className="empty">
              <span>🔎</span>
              <h3>
                {savedOnly
                  ? "Your next favourite is out there."
                  : "No discoveries just yet."}
              </h3>
              <p>
                {savedOnly
                  ? "Tap a heart on any place to keep it here."
                  : "Try another search or give all the categories a go."}
              </p>
              <button
                className="button dark"
                onClick={() => {
                  setQuery("");
                  setAudience("Everyone");
                  setCategory("All");
                  setSavedOnly(false);
                }}
              >
                Explore all places <ArrowRight size={17} />
              </button>
            </div>
          )}
        </section>
        <section id="new-here" className="new-here">
          <div className="welcome-copy">
            <span className="eyebrow">JUST MOVED IN?</span>
            <h2>
              Hey neighbour.
              <br />
              You’re home. <span>☀</span>
            </h2>
            <p>
              New keys, new streets, new favourite breakfast.
              <br />
              Let’s make this place feel a little more like yours.
            </p>
            <a
              href={maps("Pek Kio Market and Food Centre")}
              target="_blank"
              rel="noreferrer"
              className="button dark"
            >
              Get your bearings <MapPin size={17} />
            </a>
            <small>
              <TrainFront size={15} /> Farrer Park MRT is a nearby starting
              point.
            </small>
          </div>
          <div className="checklist">
            <div className="checklist-title">
              <span>YOUR FIRST LITTLE ADVENTURES</span>
              <span>{done.length}/3</span>
            </div>
            {[
              {
                id: "breakfast",
                title: "Find your go-to breakfast",
                text: "Start with a wander around Pek Kio Market.",
              },
              {
                id: "walk",
                title: "Take the long way home",
                text: "Get familiar with Cambridge and Dorset Roads.",
              },
              {
                id: "hello",
                title: "Say your first hello",
                text: "Drop by the CC or Residents’ Network.",
              },
            ].map((item, i) => (
              <button
                className={`check-item ${done.includes(item.id) ? "complete" : ""}`}
                key={item.id}
                onClick={() => {
                  const next = done.includes(item.id)
                    ? done.filter((x) => x !== item.id)
                    : [...done, item.id];
                  setDone(next);
                  persist("pekkio-done-v1", next);
                }}
                aria-pressed={done.includes(item.id)}
              >
                <span className="check-box">
                  {done.includes(item.id) ? (
                    <Check size={18} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </button>
            ))}
            <div className="checklist-foot">
              {done.length === 3
                ? "Look at you, already a local! ✨"
                : "No rush. The best discoveries happen at your pace."}
            </div>
          </div>
        </section>
        <section id="news" className="section news-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">AROUND THE BLOCK</span>
              <h2>
                The local buzz <span>↗</span>
              </h2>
              <p>Little updates that keep you in the loop.</p>
            </div>
            <a
              className="text-link"
              href="https://moulmein-cairnhill.pa.gov.sg/"
              target="_blank"
              rel="noreferrer"
            >
              Community updates <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="news-layout">
            <a
              className="community-card"
              href="https://www.onepa.gov.sg/cc/pek-kio-cc"
              target="_blank"
              rel="noreferrer"
            >
              <span className="eyebrow">MEET YOUR COMMUNITY</span>
              <div className="community-art" aria-hidden="true">
                ☺ <span>✳</span> ☺
              </div>
              <h3>
                Good things happen
                <br />
                when we get together.
              </h3>
              <p>
                Find current courses, facilities and ways to join in at Pek Kio
                CC.
              </p>
              <span className="text-link">
                See what’s on at onePA <ArrowUpRight size={18} />
              </span>
            </a>
            <div>
              <div className="feed-label">
                <span className="status-dot" />
                {news.live
                  ? "Latest indexed stories · refreshed hourly"
                  : "From the reading list · live feed unavailable"}
              </div>
              {news.stories.map((story) => (
                <a
                  className="news-item"
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  key={story.url}
                >
                  <div>
                    <span>
                      {story.source} ·{" "}
                      {new Date(story.date).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        timeZone: "Asia/Singapore",
                      })}
                    </span>
                    <h3>{story.title}</h3>
                    <small>Read the full story</small>
                  </div>
                  <ArrowUpRight size={22} />
                </a>
              ))}
              <p className="feed-note">
                Stories link to their publishers. Dates reflect publication, not
                the date of an event.
              </p>
            </div>
          </div>
        </section>
        <section className="closing">
          <Sparkles size={25} />
          <h2>
            Same neighbourhood.
            <br />A new little discovery, every day.
          </h2>
          <p>Go on. Your next favourite might be just around the corner.</p>
          <a href="#explore" className="button dark">
            Let’s explore <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <footer>
        <a className="brand" href="#">
          <span className="brand-icon">
            pk<span>✳</span>
          </span>
          <span>pek kio</span>
        </a>
        <p>
          An independent guide. Made with a little kampung spirit.
          <br />
          Place details checked September 2026. Confirm hours and availability
          before visiting.
        </p>
        <a
          href="https://github.com/bryanleeeeee/pekkio/issues"
          target="_blank"
          rel="noreferrer"
        >
          Suggest a little improvement <ArrowUpRight size={15} />
        </a>
      </footer>
      <dialog
        ref={dialog}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        onClose={() => setSelected(null)}
        aria-labelledby="place-title"
      >
        {selected && (
          <>
            <button
              className="dialog-close"
              aria-label="Close place details"
              onClick={() => setSelected(null)}
            >
              <X />
            </button>
            <div className={`modal-art ${selected.color}`}>
              {selected.emoji}
            </div>
            <div className="modal-body">
              <span className="eyebrow">
                {selected.category} · {selected.tag}
              </span>
              <h2 id="place-title">{selected.name}</h2>
              <p>{selected.description}</p>
              <p className="location">
                <MapPin size={17} />
                {selected.address}
              </p>
              <div className="tip">
                <strong>A little local know-how</strong>
                <p>{selected.tip}</p>
              </div>
              <div className="modal-actions">
                <a
                  className="button dark"
                  href={maps(selected.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions <ArrowUpRight size={17} />
                </a>
                <button
                  className="button outline"
                  onClick={() => save(selected.id)}
                >
                  <Heart
                    size={17}
                    fill={saved.includes(selected.id) ? "currentColor" : "none"}
                  />
                  {saved.includes(selected.id) ? "Saved" : "Save place"}
                </button>
              </div>
              <a
                className="source-link"
                href={selected.source}
                target="_blank"
                rel="noreferrer"
              >
                {selected.category === "Food"
                  ? "Read the food guide"
                  : "Visit the official source"}{" "}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </>
        )}
      </dialog>
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </>
  );
}
