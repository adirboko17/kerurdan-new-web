import { buildLlmsFullTxt } from "@/lib/llms";

export const revalidate = 120;

export async function GET() {
  const body = await buildLlmsFullTxt();
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=3600",
    },
  });
}
