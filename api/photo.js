// GET /api/photo?k=키 — 시설 사진(비공개 저장소)을 캐시와 함께 내보냄
import { get } from "@vercel/blob";

export default async function handler(req, res) {
  const k = String((req.query && req.query.k) || "");
  if (!/^[a-z0-9-]{2,40}$/.test(k)) { res.status(400).end("bad key"); return; }
  try {
    const r = await get("photos/" + k + ".jpg", { access: "private" });
    if (!r || r.statusCode !== 200) { res.status(404).end("not found"); return; }
    const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800");
    res.status(200).send(buf);
  } catch (e) {
    console.error(e);
    res.status(500).end("error");
  }
}
