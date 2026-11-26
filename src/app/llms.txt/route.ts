import { buildLlmsProfile } from "@/lib/llms";
import { isIndexingEnabled } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  if (!isIndexingEnabled) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildLlmsProfile(false), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
