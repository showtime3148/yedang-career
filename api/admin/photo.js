// POST /api/admin/photo — { key, data(base64 jpeg) } 시설 사진 올리기 (관리자 토큰 필요)
import { put } from "@vercel/blob";
import { checkToken } from "../../lib/store.js";

const ALLOW = ["https://yedang.jge.hs.kr", "https://yedang-career.vercel.app"];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOW.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const h = req.headers["authorization"] || "";
  if (!checkToken(h.startsWith("Bearer ") ? h.slice(7) : "")) { res.status(401).json({ error: "관리자 로그인이 필요합니다." }); return; }
  const { key, data } = req.body || {};
  if (!/^[a-z0-9-]{2,40}$/.test(key || "") || typeof data !== "string") { res.status(400).json({ error: "잘못된 요청" }); return; }
  const buf = Buffer.from(data.replace(/^data:image\/\w+;base64,/, ""), "base64");
  if (buf.length < 1000 || buf.length > 3_000_000) { res.status(400).json({ error: "이미지 크기 확인" }); return; }
  await put("photos/" + key + ".jpg", buf, { access: "private", contentType: "image/jpeg", addRandomSuffix: false, allowOverwrite: true });
  res.status(200).json({ ok: true, key, bytes: buf.length });
}
