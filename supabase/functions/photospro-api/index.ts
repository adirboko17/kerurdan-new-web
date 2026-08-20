import { createClient } from "npm:@supabase/supabase-js@2";

const STORE_NAME = "קירור דן";
const PRODUCTS_TABLE = "products";
const PRODUCT_IMAGES_TABLE = "product_images";
const BUCKET = "product-images";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-api-key, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function routePath(req: Request): string {
  const pathname = new URL(req.url).pathname;
  const marker = "/photospro-api";
  const idx = pathname.indexOf(marker);
  let path = idx >= 0 ? pathname.slice(idx + marker.length) || "/" : pathname;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

function decodeBase64(input: string): Uint8Array {
  const raw = input.includes(",") ? input.split(",")[1] : input;
  const bin = atob(raw);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function contentTypeFor(filename: string, dataUri?: string): string {
  const fromUri = dataUri?.match(/^data:([^;]+);/i)?.[1];
  if (fromUri) return fromUri;
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const apiKey = req.headers.get("x-api-key");
  const expected =
    Deno.env.get("PHOTOSPRO_API_KEY") ||
    (await supabase.rpc("photospro_expected_api_key")).data;
  if (!expected || apiKey !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  const path = routePath(req);

  try {
    if (req.method === "GET" && (path === "/products" || path === "/")) {
      const [{ data: rows, error: productsError }, { data: extraRows, error: imagesError }] =
        await Promise.all([
          supabase
            .from(PRODUCTS_TABLE)
            .select("id, name, image_url")
            .order("sort_order", { ascending: true, nullsFirst: false }),
          supabase
            .from(PRODUCT_IMAGES_TABLE)
            .select("product_id, image_url, is_primary, sort_order, status")
            .not("product_id", "is", null),
        ]);

      if (productsError) return json({ error: productsError.message }, 500);
      if (imagesError) return json({ error: imagesError.message }, 500);

      const extrasByProduct = new Map<string, string[]>();
      for (const image of extraRows ?? []) {
        if (!image.product_id || !image.image_url) continue;
        if (image.status && image.status !== "active") continue;
        const list = extrasByProduct.get(image.product_id) ?? [];
        list.push(image.image_url);
        extrasByProduct.set(image.product_id, list);
      }

      const products = (rows ?? [])
        .map((product) => {
          const images: { url: string }[] = [];
          const seen = new Set<string>();
          const add = (url?: string | null) => {
            if (!url || seen.has(url)) return;
            seen.add(url);
            images.push({ url });
          };

          add(product.image_url);
          for (const url of extrasByProduct.get(product.id) ?? []) add(url);

          return {
            id: product.id,
            title: product.name,
            image_url: images[0]?.url ?? null,
            images,
          };
        })
        .filter((product) => Boolean(product.image_url));

      return json({ store_name: STORE_NAME, products });
    }

    const imageMatch = path.match(/^\/products\/([^/]+)\/image$/i);
    if (req.method === "PUT" && imageMatch) {
      const productId = imageMatch[1];
      const body = (await req.json().catch(() => null)) as {
        image_base64?: string;
        filename?: string;
        alt?: string;
      } | null;

      if (!body?.image_base64) {
        return json({ error: "image_base64 is required" }, 400);
      }

      const { data: existing, error: existingError } = await supabase
        .from(PRODUCTS_TABLE)
        .select("id")
        .eq("id", productId)
        .maybeSingle();

      if (existingError) return json({ error: existingError.message }, 500);
      if (!existing) return json({ error: "Product not found" }, 404);

      let bytes: Uint8Array;
      try {
        bytes = decodeBase64(body.image_base64);
      } catch {
        return json({ error: "Invalid base64" }, 400);
      }

      const safeName = (body.filename || "image.jpg").replace(/[^\w.\-]/g, "_");
      const contentType = contentTypeFor(safeName, body.image_base64);
      const filePath = `photospro/${productId}/${Date.now()}-${safeName}`;

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.some((bucket) => bucket.id === BUCKET)) {
        const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
          public: true,
        });
        if (bucketError) return json({ error: bucketError.message }, 500);
      }

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, bytes, { contentType, upsert: true });

      if (uploadError) return json({ error: uploadError.message }, 500);

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const newImageUrl = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from(PRODUCTS_TABLE)
        .update({ image_url: newImageUrl })
        .eq("id", productId);

      if (updateError) return json({ error: updateError.message }, 500);

      await supabase.from(PRODUCT_IMAGES_TABLE).insert({
        product_id: productId,
        image_url: newImageUrl,
        alt_text: body.alt ?? null,
        is_primary: true,
        status: "active",
        sort_order: 0,
      });

      return json({ success: true, new_image_url: newImageUrl });
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
