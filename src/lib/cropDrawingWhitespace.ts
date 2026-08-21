const WHITE_THRESHOLD = 245;
const PADDING_PX = 24;

function isEmptyPixel(r: number, g: number, b: number, a: number) {
  if (a < 10) return true;
  return r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
}

export async function cropDrawingFromUrl(src: string): Promise<string> {
  const image = await loadCrossOriginImage(src);
  const source = document.createElement("canvas");
  source.width = image.naturalWidth || image.width;
  source.height = image.naturalHeight || image.height;
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return src;

  ctx.drawImage(image, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, source.width, source.height);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      if (isEmptyPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) return src;

  const x = Math.max(0, minX - PADDING_PX);
  const y = Math.max(0, minY - PADDING_PX);
  const cropW = Math.min(width - 1, maxX + PADDING_PX) - x + 1;
  const cropH = Math.min(height - 1, maxY + PADDING_PX) - y + 1;
  if ((cropW * cropH) / (width * height) > 0.92) return src;

  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  const out = cropped.getContext("2d");
  if (!out) return src;
  out.fillStyle = "#ffffff";
  out.fillRect(0, 0, cropW, cropH);
  out.drawImage(source, x, y, cropW, cropH, 0, 0, cropW, cropH);
  return cropped.toDataURL("image/png");
}

function loadCrossOriginImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("drawing image failed to load"));
    image.src = src;
  });
}
