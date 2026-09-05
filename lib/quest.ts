import { places, type Place } from "./places";
export type QuestInput = {
  prompt: string;
  mood: "foodie" | "chill" | "culture" | "surprise";
  minutes: 60 | 120 | 180;
  budget: "hawker" | "treat";
  sheltered: boolean;
};
export type QuestStop = {
  id: string;
  minutes: number;
  why: string;
  mission: string;
};
export type QuestPlan = {
  id: string;
  title: string;
  stops: QuestStop[];
  mode: "ai" | "curated" | "shared";
  minutes: number;
  createdAt: string;
  note: string;
  model?: string;
  elapsedMs?: number;
};
export const modelId = "Xenova/all-MiniLM-L6-v2";
export const questPlaces = places.filter((p) => !p.steps);
export const corpus = questPlaces.map((p) => ({
  id: p.id,
  text: `${p.name}. ${p.kind}. ${p.description} ${p.highlights.join(" ")} ${p.tip}`,
}));
const duration: Record<string, number> = {
  market: 25,
  "min-hiang": 15,
  "yean-heng": 20,
  "old-hen": 50,
  syip: 50,
  daizu: 50,
  "pek-kio-park": 25,
  heartroom: 150,
  activesg: 60,
  "indian-heritage": 60,
  "little-india-trail": 60,
  badminton: 60,
  arts: 90,
  neighbours: 30,
  heritage: 30,
};
const indoor = new Set([
  "market",
  "pin-wei",
  "wah-kee",
  "lai-hiang",
  "sheng-seng",
  "yean-heng",
  "good-spice",
  "min-hiang",
  "cambridge-roast",
  "sin-kee",
  "cambridge-ytf",
  "old-hen",
  "syip",
  "daizu",
  "indian-heritage",
  "heartroom",
  "badminton",
  "arts",
]);
const paid = new Set([
  "old-hen",
  "syip",
  "daizu",
  "heartroom",
  "activesg",
  "badminton",
  "arts",
  "indian-heritage",
]);
export const missionFor = (p: Place) =>
  p.category === "Food"
    ? "Try one dish or drink that is new to you."
    : p.kind === "Outdoors"
      ? "Notice three different leaf shapes along your walk."
      : p.kind === "Heritage"
        ? "Find one detail you would have walked past before."
        : p.kind === "Sports"
          ? "Put your phone away for one game."
          : p.kind === "Creative"
            ? "Make something without worrying about perfect."
            : "Learn one new thing about your neighbourhood.";
export function planQuest(
  input: QuestInput,
  scores: Record<string, number> = {},
  mode: "ai" | "curated" = "curated",
): QuestPlan {
  const terms = input.prompt.toLowerCase().match(/[a-z]{3,}/g) || [];
  const dietary = /allerg|halal|vegan|vegetarian|gluten|nut.free/i.test(
    input.prompt,
  );
  let candidates = questPlaces.filter(
    (p) =>
      (!input.sheltered || indoor.has(p.id)) &&
      (input.budget !== "hawker" || !paid.has(p.id)) &&
      (!dietary || p.category !== "Food"),
  );
  candidates = candidates
    .map((p) => ({
      p,
      score:
        (scores[p.id] || 0) * 5 +
        (input.mood === "foodie" && p.category === "Food" ? 0.8 : 0) +
        (input.mood === "chill" &&
        ["Outdoors", "Cafés", "Snacks & drinks"].includes(p.kind)
          ? 0.8
          : 0) +
        (input.mood === "culture" &&
        ["Heritage", "Creative", "Community"].includes(p.kind)
          ? 0.8
          : 0) +
        (mode === "curated"
          ? terms.filter((t) =>
              `${p.name} ${p.description} ${p.highlights}`
                .toLowerCase()
                .includes(t),
            ).length * 0.3
          : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
  const selected: Place[] = [];
  let used = 0;
  for (const p of candidates) {
    const n = duration[p.id] || 30;
    const travel = selected.length ? 10 : 0;
    if (used + n + travel > input.minutes || selected.length === 3) continue;
    if (
      selected.length &&
      p.kind === "Hawker" &&
      selected.some((q) => q.kind === "Hawker")
    )
      continue;
    selected.push(p);
    used += n + travel;
  }
  const names = {
    foodie: "The makan little adventure",
    chill: "Your slow-down escape",
    culture: "Stories around the corner",
    surprise: "A little out of the ordinary",
  };
  return {
    id: crypto.randomUUID(),
    title: names[input.mood],
    stops: selected.map((p) => ({
      id: p.id,
      minutes: duration[p.id] || 30,
      why: `${mode === "ai" ? "Matched to your request" : "Selected from the local guide"} · ${p.kind.toLowerCase()}${input.sheltered ? " · sheltered stop" : ""}.`,
      mission: missionFor(p),
    })),
    mode,
    minutes: used,
    createdAt: new Date().toISOString(),
    note: dietary
      ? "Dietary suitability is not verified, so this trail uses non-food stops. Ask venues directly about your requirements."
      : "Visit times and 10-minute transfer allowances are estimates, not live walking routes. Check opening hours and any bookings.",
    ...(mode === "ai" ? { model: modelId } : {}),
  };
}
export function readSharedPlan(value: string): QuestPlan | null {
  const ids = [...new Set(value.split(","))]
    .filter((id) => questPlaces.some((p) => p.id === id))
    .slice(0, 3);
  if (!ids.length) return null;
  return {
    id: crypto.randomUUID(),
    title: "A little trail, shared with you",
    mode: "shared",
    createdAt: new Date().toISOString(),
    minutes:
      ids.reduce((n, id) => n + (duration[id] || 30), 0) +
      (ids.length - 1) * 10,
    note: "Shared stop list. Visit times are estimates; check opening hours and bookings.",
    stops: ids.map((id) => ({
      id,
      minutes: duration[id] || 30,
      why: "Chosen by the person who shared this trail.",
      mission: missionFor(questPlaces.find((p) => p.id === id)!),
    })),
  };
}
