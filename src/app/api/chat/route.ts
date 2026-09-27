import { buildSalesSystemPrompt, presentSalesReply, salesTurnForModel, sanitizePagePath, sanitizeSalesTurns } from "@/lib/sales-agent";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 24;

const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function deltaText(content: unknown) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && "text" in part && typeof part.text === "string") return part.text;
      return "";
    })
    .join("");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim();
  if (!apiKey || !model) {
    return Response.json(
      { error: "היועץ עדיין לא מחובר. צריך להגדיר מפתח ומודל של OpenRouter." },
      { status: 503 },
    );
  }

  if (limited(clientIp(request))) {
    return Response.json({ error: "יש הרבה פניות ברצף. נסו שוב בעוד כמה דקות, או דברו איתנו בוואטסאפ." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "לא הצלחנו לקרוא את ההודעה." }, { status: 400 });
  }

  const turns = sanitizeSalesTurns((body as { messages?: unknown })?.messages);
  if (!turns) {
    return Response.json({ error: "חסרה הודעה לשליחה." }, { status: 400 });
  }

  const page = sanitizePagePath((body as { page?: unknown })?.page);
  const system = await buildSalesSystemPrompt(page);

  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE.url,
        "X-Title": "Kerur Dan",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_completion_tokens: 900,
        reasoning: { effort: "none" },
        stream: false,
        messages: [
          { role: "system", content: system },
          ...turns.map((turn) => ({ role: turn.role, content: salesTurnForModel(turn) })),
        ],
      }),
    });
  } catch (error) {
    console.error("OpenRouter request failed", error);
    return Response.json({ error: "לא הצלחנו להתחבר ליועץ כרגע. אפשר לפנות בוואטסאפ." }, { status: 502 });
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    let message = "לא הצלחנו לקבל תשובה כרגע.";
    try {
      const parsed = JSON.parse(detail) as { error?: { message?: string } };
      const provider = parsed.error?.message;
      if (provider && provider.length < 280 && !provider.includes(apiKey)) {
        message = provider;
      }
    } catch {
      // keep the Hebrew fallback
    }
    return Response.json({ error: message }, { status: 502 });
  }

  const payload = (await upstream.json()) as { choices?: { message?: { content?: unknown } }[] };
  const presented = await presentSalesReply(deltaText(payload.choices?.[0]?.message?.content));
  if (!presented.message && !presented.cards.length) {
    return Response.json({ error: "לא התקבלה תשובה. נסו לנסח שוב, או דברו איתנו בוואטסאפ." }, { status: 502 });
  }

  return Response.json(presented, { headers: { "Cache-Control": "no-store" } });
}
