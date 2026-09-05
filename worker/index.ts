import { getNews } from "../lib/news";
export default {
  async fetch(request: Request, env: { ASSETS: { fetch(request: Request): Promise<Response> } }) {
    if (new URL(request.url).pathname === "/api/news") {
      if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", {status:405});
      const news = await getNews();
      return new Response(request.method === "HEAD" ? null : JSON.stringify(news), {headers:{"Content-Type":"application/json", "Cache-Control":news.live ? "public, max-age=3600" : "public, max-age=60"}});
    }
    return env.ASSETS.fetch(request);
  }
};
