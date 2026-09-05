import { XMLParser } from "fast-xml-parser";
export type Story = {
  title: string;
  url: string;
  source: string;
  date: string;
};
export const fallback: Story[] = [
  {
    title: "The people behind Wah Kee’s planned June reopening",
    url: "https://cnalifestyle.channelnewsasia.com/dining/wah-kee-big-prawn-noodles-reopens-after-3-month-closure-583786",
    source: "CNA Lifestyle",
    date: "2026-05-29",
  },
];
export async function getNews(): Promise<{ stories: Story[]; live: boolean }> {
  try {
    const response = await fetch(
      "https://news.google.com/rss/search?q=%22Pek+Kio%22&hl=en-SG&gl=SG&ceid=SG:en",
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) throw new Error("Feed unavailable");
    const data = new XMLParser({
      ignoreAttributes: false,
      processEntities: true,
    }).parse(await response.text());
    const items = data?.rss?.channel?.item;
    const stories: Story[] = (
      Array.isArray(items) ? items : items ? [items] : []
    )
      .map((item: Record<string, unknown>) => ({
        title: String(item.title || "").replace(/\s-\s[^-]+$/, ""),
        url: String(item.link || ""),
        source:
          typeof item.source === "string"
            ? item.source
            : String(
                (item.source as Record<string, string>)?.["#text"] ||
                  "Local news",
              ),
        date: new Date(String(item.pubDate)).toISOString(),
      }))
      .filter(
        (s: Story) =>
          s.title &&
          s.url.startsWith("https://") &&
          /pek\s*kio/i.test(s.title) &&
          new Date(s.date).getTime() <= Date.now(),
      )
      .sort((a: Story, b: Story) => Date.parse(b.date) - Date.parse(a.date))
      .slice(0, 12);
    return stories.length
      ? { stories, live: true }
      : { stories: fallback, live: false };
  } catch {
    return { stories: fallback, live: false };
  }
}
