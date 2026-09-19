import { Newsletter } from "@/components/home/Newsletter";
import { getGlobalSubscribe } from "@/lib/pages";

export async function GlobalNewsletter() {
  const content = await getGlobalSubscribe();
  return <Newsletter content={content} />;
}
