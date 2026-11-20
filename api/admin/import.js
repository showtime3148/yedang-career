// POST /api/admin/import — { key, url } 학교 홈페이지 사진을 서버가 직접 받아 저장 (관리자 토큰 필요)
import { put } from "@vercel/blob";
import { requireAdmin } from "../../lib/store.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const { key, url } = req.body || {};
  let u;
  try { u = new URL(url); } catch { res.status(400).json({ error: "url" }); return; }
  if (u.hostname !== "yedang.jge.hs.kr" || !/^[a-z0-9-]{2,40}$/.test(key || "")) { res.status(400).json({ error: "허용되지 않는 주소" }); return; }
  try {
    const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (yedang-career photo import)", Referer: "https://yedang.jge.hs.kr/" } });
    if (!r.ok) { res.status(502).json({ error: "원본 " + r.status }); return; }
    const buf = Buffer.from(await r.arrayBuffer());
    await put("photos/" + key + ".jpg", buf, { access: "private", contentType: "image/jpeg", addRandomSuffix: false, allowOverwrite: true });
    res.status(200).json({ ok: true, key, bytes: buf.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  }
}
