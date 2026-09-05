import Guide from "@/components/guide";
import { getNews } from "@/lib/news";
export const revalidate = 3600;
export default async function Page() {
  const news = await getNews();
  return <Guide news={news} />;
}
