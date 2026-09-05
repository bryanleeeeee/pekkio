"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
const Quest = dynamic(() => import("./quest"), {
  loading: () => <p>Opening your little adventure…</p>,
});
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
  ChevronLeft,
  ChevronRight,
  TrainFront,
  Sparkles,
  Home,
  Camera,
  ImageOff,
  ExternalLink,
} from "lucide-react";
import { places, type Place } from "@/lib/places";
import { photos, placePhoto, type Photo } from "@/lib/photos";
import type { Story } from "@/lib/news";
const tabs = [
  { id: "discover", label: "Discover", Icon: Compass },
  { id: "quest", label: "AI Quest", Icon: Sparkles },
  { id: "food", label: "Good food", Icon: Utensils },
  { id: "activities", label: "Go & do", Icon: Sun },
  { id: "news", label: "Local buzz", Icon: Newspaper },
  { id: "welcome", label: "New here?", Icon: Home },
] as const;
type Tab = (typeof tabs)[number]["id"] | "saved";
const maps = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " Singapore")}`;
function Photograph({
  photo,
  priority = false,
  className = "",
}: {
  photo: Photo;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo.src]);
  return (
    <div className={`photograph ${className}`}>
      {failed ? (
        <div className="photo-fallback">
          <ImageOff />
          <span>Photo unavailable</span>
        </div>
      ) : (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 700px) 100vw, 60vw"
          priority={priority}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
function PhotoCredit({ photo }: { photo: Photo }) {
  return (
    <span className="photo-credit">
      <Camera size={11} />
      <a href={photo.source} target="_blank" rel="noreferrer">
        {photo.credit}
      </a>
      {photo.license && (
        <>
          {" "}
          ·{" "}
          <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
            {photo.license}
          </a>
        </>
      )}
    </span>
  );
}
export default function Guide({
  news,
}: {
  news: { stories: Story[]; live: boolean };
}) {
  const [tab, setTab] = useState<Tab>("discover");
  const [page, setPage] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("All");
  const [detailTab, setDetailTab] = useState("overview");
  const [audience, setAudience] = useState("Everyone");
  const [saved, setSaved] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [credits, setCredits] = useState(false);
  const [notice, setNotice] = useState("");
  const detail = useRef<HTMLDialogElement>(null);
  const creditDialog = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(max-width: 700px)");
    const update = () => {
      setMobile(media.matches);
      setPage(0);
    };
    update();
    media.addEventListener("change", update);
    const hash = location.hash.slice(1);
    if ([...tabs.map((t) => t.id), "saved"].includes(hash)) setTab(hash as Tab);
    const handleHash = () => {
      const t = location.hash.slice(1);
      setTab(
        [...tabs.map((x) => x.id), "saved"].includes(t)
          ? (t as Tab)
          : "discover",
      );
      setPage(0);
      setKind("All");
      setAudience("Everyone");
      setQuery("");
    };
    window.addEventListener("hashchange", handleHash);
    try {
      const s = JSON.parse(localStorage.getItem("pekkio-saved-v1") || "[]");
      const d = JSON.parse(localStorage.getItem("pekkio-done-v1") || "[]");
      if (Array.isArray(s))
        setSaved(s.filter((id) => places.some((p) => p.id === id)));
      if (Array.isArray(d))
        setDone(d.filter((id) => ["breakfast", "walk", "hello"].includes(id)));
    } catch {}
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);
  useEffect(() => {
    setDetailTab("overview");
    if (selected) {
      detail.current?.showModal();
      detail.current?.scrollTo({ top: 0 });
    } else detail.current?.close();
  }, [selected]);
  useEffect(() => {
    if (credits) creditDialog.current?.showModal();
    else creditDialog.current?.close();
  }, [credits]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2400);
    return () => clearTimeout(timer);
  }, [notice]);
  function navigate(next: Tab) {
    setTab(next);
    setPage(0);
    setQuery("");
    setAudience("Everyone");
    setKind("All");
    history.pushState(null, "", `#${next}`);
    main.current?.scrollTo({ top: 0 });
  }
  function keyboard(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let index = i;
    if (e.key === "ArrowRight") index = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") index = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") index = 0;
    else if (e.key === "End") index = tabs.length - 1;
    else return;
    e.preventDefault();
    navigate(tabs[index].id);
    document.getElementById(`tab-${tabs[index].id}`)?.focus();
  }
  function persist(key: string, value: string[]) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setNotice("Saved for this visit. Device storage is unavailable.");
    }
  }
  function save(id: string) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    persist("pekkio-saved-v1", next);
    setNotice(
      next.includes(id)
        ? "Added to your little local list"
        : "Removed from saved places",
    );
  }
  function toggleDone(id: string) {
    const next = done.includes(id)
      ? done.filter((x) => x !== id)
      : [...done, id];
    setDone(next);
    persist("pekkio-done-v1", next);
  }
  const availableKinds = [
    ...new Set(
      places
        .filter(
          (p) =>
            (tab !== "food" || p.category === "Food") &&
            (tab !== "activities" || p.category === "Activities") &&
            (tab !== "saved" || saved.includes(p.id)),
        )
        .map((p) => p.kind),
    ),
  ];
  const results = places.filter(
    (p) =>
      (tab !== "food" || p.category === "Food") &&
      (tab !== "activities" || p.category === "Activities") &&
      (tab !== "saved" || saved.includes(p.id)) &&
      (audience === "Everyone" || p.audience.includes(audience)) &&
      (kind === "All" || p.kind === kind) &&
      `${p.name} ${p.description} ${p.address} ${p.kind} ${p.area} ${p.highlights.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const size = mobile ? 1 : 3;
  const pageCount = Math.ceil(results.length / size);
  const activePage = Math.min(page, Math.max(0, pageCount - 1));
  const displayed = results.slice(activePage * size, (activePage + 1) * size);
  const newsSize = mobile ? 2 : 4;
  const newsPageCount = Math.ceil(news.stories.length / newsSize);
  const newsPage = Math.min(page, Math.max(0, newsPageCount - 1));
  function pager(total: number, current: number, label: string) {
    return (
      <div className="pager">
        <span>{label}</span>
        <div>
          <button
            disabled={current === 0}
            aria-label="Previous page"
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={17} />
          </button>
          <span aria-live="polite">
            {total ? current + 1 : 0} / {total}
          </span>
          <button
            disabled={current >= total - 1}
            aria-label="Next page"
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="app-shell">
      <a href="#panel" className="skip">
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => navigate("discover")}
          aria-label="Pek Kio home"
        >
          <span className="brand-mark">
            pk<i>✳</i>
          </span>
          <span>
            pek kio<small>YOUR NEIGHBOURHOOD, DISCOVERED.</small>
          </span>
        </button>
        <span className="location-badge">
          <MapPin size={14} /> A little corner of Singapore <span>·</span> A lot
          to love
        </span>
        <button
          className={`saved-button ${tab === "saved" ? "active" : ""}`}
          onClick={() => navigate("saved")}
          aria-label={`View saved places, ${saved.length} saved`}
        >
          <Heart size={17} />
          <span>My little list</span>
          <b>{saved.length}</b>
        </button>
      </header>
      <nav className="tabbar" role="tablist" aria-label="Neighbourhood guide">
        {tabs.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={tab === id}
            aria-controls="panel"
            tabIndex={tab === id || (tab === "saved" && i === 0) ? 0 : -1}
            onKeyDown={(e) => keyboard(e, i)}
            onClick={() => navigate(id)}
            className={tab === id ? "active" : ""}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <main
        ref={main}
        id="panel"
        tabIndex={-1}
        className={`workspace ${tab}`}
        role="tabpanel"
        aria-label={
          tab === "saved"
            ? "Saved places"
            : tabs.find((t) => t.id === tab)?.label
        }
      >
        {tab === "quest" && <Quest onPlace={setSelected} />}
        {tab === "discover" && (
          <div className="view home-view" key="discover">
            <div className="view-heading">
              <div>
                <span className="eyebrow">
                  <span className="sunflower">✳</span> SMALL NEIGHBOURHOOD. BIG
                  HEART.
                </span>
                <h1>
                  Same streets. <em>New favourites.</em>
                </h1>
                <p>
                  Good makan, familiar faces, and a little adventure around the
                  corner.
                </p>
              </div>
              <button
                className="welcome-pill"
                onClick={() => navigate("quest")}
              >
                <Sparkles size={18} />
                <span>
                  YOUR OWN LITTLE ADVENTURE
                  <strong>
                    Make my AI trail <ArrowRight size={14} />
                  </strong>
                </span>
              </button>
            </div>
            <div className="home-grid">
              <div className="hero-photo">
                <Photograph photo={photos.stalls} priority />
                <span className="floating-label">
                  <MapPin size={13} /> PEK KIO, SINGAPORE
                </span>
                <div className="hero-overlay">
                  <span className="eyebrow">YOUR NEXT HAPPY PLACE</span>
                  <h2>
                    Come for the food.
                    <br />
                    Stay for the feeling.
                  </h2>
                  <p>The real heart of Pek Kio, one breakfast at a time.</p>
                  <button
                    className="button cream"
                    onClick={() => navigate("quest")}
                  >
                    Find my little adventure <ArrowUpRight size={18} />
                  </button>
                </div>
                <span className="photo-label">
                  Pek Kio Market · photographed 2025
                </span>
              </div>
              <div className="home-side">
                <button
                  className="teaser peach"
                  onClick={() => {
                    navigate("food");
                    setSelected(places[0]);
                  }}
                >
                  <Photograph photo={photos["pin-wei"]} />
                  <div>
                    <span className="eyebrow">ON THE MENU</span>
                    <h3>
                      Meet your new
                      <br />
                      breakfast obsession.
                    </h3>
                    <span className="teaser-bottom">
                      Pin Wei Chee Cheong Fun <ArrowUpRight size={19} />
                    </span>
                  </div>
                </button>
                <button
                  className="teaser lavender"
                  onClick={() => navigate("activities")}
                >
                  <Photograph photo={photos.cc} />
                  <div>
                    <span className="eyebrow">MAKE A DAY OF IT</span>
                    <h3>
                      More good times.
                      <br />
                      More good company.
                    </h3>
                    <span className="teaser-bottom">
                      Find your people at Pek Kio CC <ArrowUpRight size={19} />
                    </span>
                  </div>
                </button>
              </div>
            </div>
            <div className="home-bottom">
              <span>
                <span className="status-dot" />{" "}
                {places.filter((p) => p.category === "Food").length} food spots
                · {places.filter((p) => p.category === "Activities").length}{" "}
                things to do
              </span>
              <button onClick={() => navigate("news")}>
                What’s the local buzz? <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
        {["food", "activities", "saved"].includes(tab) && (
          <div className="view browse-view" key={tab}>
            <div className="view-heading">
              <div>
                <span className="eyebrow">
                  {tab === "food"
                    ? "GOOD MAKAN, GREAT MOOD"
                    : tab === "activities"
                      ? "STEP OUT. GET CURIOUS."
                      : "YOUR FAVOURITES, ALL TOGETHER"}
                </span>
                <h1>
                  {tab === "food" ? (
                    <>
                      Eat your <em>heart out.</em>
                    </>
                  ) : tab === "activities" ? (
                    <>
                      Make a little <em>day of it.</em>
                    </>
                  ) : (
                    <>
                      Your little <em>local list.</em>
                    </>
                  )}
                </h1>
                <p>
                  {tab === "food"
                    ? "Real hawker heroes. The kind of food you’ll come back for."
                    : tab === "activities"
                      ? "Play a game, meet your neighbours, find something that feels like you."
                      : "Saved on this device. Your next adventure is ready when you are."}
                </p>
              </div>
              <div className="search">
                <Search size={17} />
                <input
                  aria-label="Search places"
                  placeholder="Find your kind of good…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
                {query && (
                  <button
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      setPage(0);
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
            <div className="filter-bar">
              <div className="pills" aria-label="Filter by audience">
                {["Everyone", "Youths", "Adults"].map((a) => (
                  <button
                    key={a}
                    aria-pressed={a === audience}
                    className={a === audience ? "active" : ""}
                    onClick={() => {
                      setAudience(a);
                      setPage(0);
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <div className="kind-filter">
                <label className="sr-only" htmlFor="kind-filter">
                  Filter by type
                </label>
                <select
                  id="kind-filter"
                  value={kind}
                  onChange={(e) => {
                    setKind(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="All">All types</option>
                  {availableKinds.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <span aria-live="polite">{results.length} finds</span>
              </div>
            </div>
            {results.length ? (
              <div className="place-grid">
                {displayed.map((place) => (
                  <article
                    key={place.id}
                    className={`place-card ${place.color}`}
                  >
                    <div className="card-photo">
                      <button
                        className="photo-open"
                        aria-label={`View ${place.name}`}
                        onClick={() => setSelected(place)}
                      >
                        <Photograph photo={placePhoto(place.id)} />
                        {placePhoto(place.id).note && (
                          <span className="context-photo-note">
                            {placePhoto(place.id).note}
                          </span>
                        )}
                      </button>
                      <span className="floating-label">
                        {place.category === "Food" ? "GOOD MAKAN" : "GO & DO"}
                      </span>
                      <button
                        className={`heart ${saved.includes(place.id) ? "active" : ""}`}
                        aria-label={`${saved.includes(place.id) ? "Unsave" : "Save"} ${place.name}`}
                        aria-pressed={saved.includes(place.id)}
                        onClick={() => save(place.id)}
                      >
                        <Heart
                          size={19}
                          fill={
                            saved.includes(place.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>
                    <div className="card-body">
                      <span className="eyebrow">
                        {place.kind} · {place.area}
                      </span>
                      <h2>
                        <button onClick={() => setSelected(place)}>
                          {place.name}
                          <ArrowUpRight size={20} />
                        </button>
                      </h2>
                      <p>{place.description}</p>
                      <span className="card-address">
                        <MapPin size={13} />
                        {place.address}
                      </span>
                      <div className="card-actions">
                        <button onClick={() => setSelected(place)}>
                          Take a little look <ArrowRight size={16} />
                        </button>
                        <a
                          aria-label={`Directions to ${place.name}`}
                          href={maps(place.address)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapPin size={15} /> Directions
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty">
                <Search size={36} />
                <h2>
                  {tab === "saved" && !query
                    ? "Your next favourite is out there."
                    : "No matches this time."}
                </h2>
                <p>
                  {tab === "saved" && !query
                    ? "Tap a heart on a place to keep it here."
                    : "Try a different search or audience."}
                </p>
                <button
                  className="button dark"
                  onClick={() => {
                    if (tab === "saved") navigate("food");
                    else {
                      setQuery("");
                      setAudience("Everyone");
                      setKind("All");
                    }
                  }}
                >
                  Explore again <ArrowRight size={17} />
                </button>
              </div>
            )}
            {pager(
              pageCount,
              activePage,
              tab === "food"
                ? "Check opening hours before you go."
                : "Check current availability with the organiser.",
            )}
          </div>
        )}
        {tab === "news" && (
          <div className="view news-view" key="news">
            <div className="view-heading">
              <div>
                <span className="eyebrow">AROUND THE BLOCK</span>
                <h1>
                  The local <em>buzz.</em>
                </h1>
                <p>Small stories. Big neighbourhood energy.</p>
              </div>
              <a
                href="https://moulmein-cairnhill.pa.gov.sg/"
                target="_blank"
                rel="noreferrer"
                className="button outline"
              >
                Community updates <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="news-layout">
              <a
                className="news-feature"
                href="https://www.onepa.gov.sg/cc/pek-kio-cc"
                target="_blank"
                rel="noreferrer"
              >
                <Photograph photo={photos.cc} />
                <div className="news-feature-copy">
                  <span className="eyebrow">YOUR COMMUNITY CONNECTION</span>
                  <h2>
                    Good things happen
                    <br />
                    when we get together.
                  </h2>
                  <p>Courses, facilities and ways to join in at Pek Kio CC.</p>
                  <span>
                    See what’s on at onePA <ArrowUpRight size={18} />
                  </span>
                </div>
              </a>
              <div className="news-feed">
                <span className="feed-label">
                  <span className="status-dot" />
                  {news.live
                    ? "Latest indexed stories · refreshed hourly"
                    : "Reading list · live feed unavailable"}
                </span>
                <div className="news-items">
                  {news.stories
                    .slice(newsPage * newsSize, (newsPage + 1) * newsSize)
                    .map((story, i) => (
                      <a
                        className="news-item"
                        key={story.url}
                        href={story.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className={`story-number color-${i}`}>
                          {String(newsPage * newsSize + i + 1).padStart(2, "0")}
                        </span>
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
                        </div>
                        <ArrowUpRight size={19} />
                      </a>
                    ))}
                </div>
                {pager(
                  newsPageCount,
                  newsPage,
                  "Dates shown are publication dates.",
                )}
              </div>
            </div>
          </div>
        )}
        {tab === "welcome" && (
          <div className="view welcome-view" key="welcome">
            <div className="view-heading">
              <div>
                <span className="eyebrow">
                  NEW KEYS. NEW STREETS. NEW FAVOURITES.
                </span>
                <h1>
                  Hey neighbour. <em>You’re home.</em>
                </h1>
                <p>
                  A few small steps to make Pek Kio feel a little more like
                  yours.
                </p>
              </div>
              <span className="welcome-spark">✳</span>
            </div>
            <div className="welcome-layout">
              <div className="welcome-photo">
                <Photograph photo={photos.market} />
                <span className="floating-label">
                  YOUR NEIGHBOURHOOD STARTS HERE
                </span>
                <div className="welcome-map">
                  <span>
                    <TrainFront size={19} />
                    <strong>Find your bearings</strong>
                    <small>Farrer Park MRT is a nearby starting point.</small>
                  </span>
                  <a
                    href={maps("Pek Kio Market and Food Centre")}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open Pek Kio on Google Maps"
                  >
                    <ArrowUpRight size={23} />
                  </a>
                </div>
              </div>
              <div className="checklist">
                <div className="checklist-heading">
                  <span className="eyebrow">YOUR FIRST LITTLE ADVENTURES</span>
                  <b>{done.length} / 3</b>
                </div>
                <div className="progress">
                  <span style={{ width: `${(done.length / 3) * 100}%` }} />
                </div>
                {[
                  {
                    id: "breakfast",
                    title: "Find your go-to breakfast",
                    text: "Start with a wander around Pek Kio Market.",
                    go: "food",
                  },
                  {
                    id: "walk",
                    title: "Take the long way home",
                    text: "Get familiar with Cambridge and Dorset Roads.",
                    go: "activities",
                  },
                  {
                    id: "hello",
                    title: "Say your first hello",
                    text: "Drop by the CC or Residents’ Network.",
                    go: "activities",
                  },
                ].map((item, i) => (
                  <div
                    className={`check-row ${done.includes(item.id) ? "complete" : ""}`}
                    key={item.id}
                  >
                    <button
                      className="check-box"
                      onClick={() => toggleDone(item.id)}
                      aria-pressed={done.includes(item.id)}
                      aria-label={`Mark ${item.title} ${done.includes(item.id) ? "incomplete" : "complete"}`}
                    >
                      {done.includes(item.id) ? (
                        <Check size={19} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </button>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <button
                      className="check-go"
                      aria-label={`Explore: ${item.title}`}
                      onClick={() => navigate(item.go as Tab)}
                    >
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                ))}
                <div className="welcome-note">
                  <Sparkles size={19} />
                  <p>
                    {done.length === 3
                      ? "Look at you, already a local!"
                      : "No rush. The best discoveries happen at your pace."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer>
        <span>
          Made with a little kampung spirit <Heart size={11} />
        </span>
        <div>
          <button onClick={() => setCredits(true)}>
            <Camera size={12} /> Photo credits
          </button>
          <a
            href="https://github.com/bryanleeeeee/pekkio/issues"
            target="_blank"
            rel="noreferrer"
          >
            Suggest a gem <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <dialog
        ref={detail}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        aria-labelledby="place-title"
      >
        {selected && (
          <>
            <button
              className="dialog-close"
              aria-label="Close place details"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <div className="detail-photo">
              <Photograph photo={placePhoto(selected.id)} />
            </div>
            <div className="detail-body">
              <span className="eyebrow">
                {selected.category} · {selected.tag}
              </span>
              <h2 id="place-title">{selected.name}</h2>
              <div className="detail-tabs" aria-label="Place information">
                <button
                  aria-pressed={detailTab === "overview"}
                  onClick={() => setDetailTab("overview")}
                >
                  Overview
                </button>
                <button
                  aria-pressed={detailTab === "ideas"}
                  onClick={() => setDetailTab("ideas")}
                >
                  {selected.steps
                    ? "The itinerary"
                    : selected.category === "Food"
                      ? "What to try"
                      : "Your to-do list"}
                </button>
                {selected.review && (
                  <button
                    aria-pressed={detailTab === "reviews"}
                    onClick={() => setDetailTab("reviews")}
                  >
                    Reviews & sources
                  </button>
                )}
              </div>
              {detailTab === "overview" && (
                <>
                  <p className="detail-description">{selected.description}</p>
                  <dl className="quick-facts">
                    <div>
                      <dt>Where</dt>
                      <dd>{selected.area}</dd>
                    </div>
                    <div>
                      <dt>
                        {selected.category === "Food"
                          ? "Budget"
                          : "Entry / booking"}
                      </dt>
                      <dd>{selected.cost}</dd>
                    </div>
                    <div>
                      <dt>Plan for</dt>
                      <dd>{selected.duration}</dd>
                    </div>
                  </dl>
                </>
              )}
              {detailTab === "ideas" && (
                <section className="detail-ideas">
                  <h3>
                    {selected.steps
                      ? "Your suggested route"
                      : selected.category === "Food"
                        ? "Start with these"
                        : "Make a little plan"}
                  </h3>
                  {selected.steps ? (
                    <ol className="itinerary">
                      {selected.steps.map((step) => (
                        <li key={step.placeId}>
                          <button
                            onClick={() => {
                              const p = places.find(
                                (p) => p.id === step.placeId,
                              );
                              if (p) setSelected(p);
                            }}
                          >
                            <strong>{step.title}</strong>
                            <span>{step.detail}</span>
                            <ArrowUpRight size={16} />
                          </button>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul>
                      {selected.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <small>
                    Suggested visit times are planning estimates. Allow extra
                    time for queues and travel.
                  </small>
                </section>
              )}
              {detailTab === "reviews" && selected.review && (
                <section className="review-snapshot">
                  <h3>
                    {selected.review.publisher === "Old Hen Coffee"
                      ? "From the café"
                      : "Review snapshot"}
                  </h3>
                  <p>{selected.review.text}</p>
                  <a
                    href={selected.review.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selected.review.publisher}
                    {selected.review.date
                      ? " · " +
                        new Date(selected.review.date).toLocaleDateString(
                          "en-SG",
                          { month: "short", year: "numeric" },
                        )
                      : ""}{" "}
                    <ArrowUpRight size={13} />
                  </a>
                  <small>
                    Paraphrased source notes, not our own visit or a live Google
                    rating.
                  </small>
                </section>
              )}
              <span className="card-address">
                <MapPin size={15} />
                {selected.address}
              </span>
              {detailTab !== "reviews" && (
                <div className="tip">
                  <strong>Before you go</strong>
                  <p>{selected.tip}</p>
                </div>
              )}
              <div className="detail-actions">
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
                <a
                  href={selected.source}
                  target="_blank"
                  rel="noreferrer"
                  className="source-link"
                >
                  {selected.category === "Food"
                    ? "Read the food guide"
                    : "Official details"}{" "}
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="more-source-links">
                <a
                  href={maps(selected.name + " " + selected.address)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Maps & visitor reviews <ArrowUpRight size={13} />
                </a>
                {selected.booking && (
                  <a href={selected.booking} target="_blank" rel="noreferrer">
                    Check bookings <ArrowUpRight size={13} />
                  </a>
                )}
                <span>Sources checked 5 Sep 2026</span>
              </div>
              {placePhoto(selected.id).note && (
                <p className="detail-photo-note">
                  Photo: {placePhoto(selected.id).note}
                </p>
              )}
              <PhotoCredit photo={placePhoto(selected.id)} />
            </div>
          </>
        )}
      </dialog>
      <dialog
        ref={creditDialog}
        onCancel={() => setCredits(false)}
        onClose={() => setCredits(false)}
        aria-labelledby="credits-title"
        className="credits-dialog"
      >
        <button
          className="dialog-close"
          aria-label="Close photo credits"
          onClick={() => setCredits(false)}
        >
          <X size={20} />
        </button>
        <div className="detail-body">
          <span className="eyebrow">THE REAL PEK KIO</span>
          <h2 id="credits-title">Behind the photographs.</h2>
          <p>
            Photos are credited to their sources and may predate your visit.
            Context images and outlet-unspecified brand photos are labelled.
            Images are cropped to fit; rights remain with their creators.
          </p>
          {Object.entries(photos).map(([id, photo]) => (
            <div className="credit-row" key={id}>
              <p>{photo.alt}</p>
              <PhotoCredit photo={photo} />
            </div>
          ))}
          <small>
            Independent neighbourhood guide. Place details checked September
            2026. Confirm hours and availability with the venue.
          </small>
        </div>
      </dialog>
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice}
      </div>
    </div>
  );
}
