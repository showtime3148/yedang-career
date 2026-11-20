// Vercel Blob(비공개 저장소) 기반 저장 계층
import { put, get, list, del } from "@vercel/blob";
import crypto from "node:crypto";

const ACCESS = { access: "private" };

export async function readJSON(pathname) {
  try {
    const r = await get(pathname, { ...ACCESS, useCache: false });
    if (!r || r.statusCode !== 200) return null;
    return JSON.parse(await new Response(r.stream).text());
  } catch (e) {
    if (String(e && e.message).includes("not found") || (e && e.name === "BlobNotFoundError")) return null;
    throw e;
  }
}

export async function writeJSON(pathname, data, { overwrite = true } = {}) {
  return put(pathname, JSON.stringify(data), {
    ...ACCESS,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: overwrite,
    cacheControlMaxAge: 60
  });
}

// 같은 경로가 이미 있으면 실패 → 시간대 선점(중복 예약 방지)에 사용
export async function claim(pathname, data) {
  try {
    await writeJSON(pathname, data, { overwrite: false });
    return true;
  } catch (e) {
    const msg = String((e && e.message) || "");
    if (msg.toLowerCase().includes("already exists") || (e && e.name === "BlobAlreadyExistsError")) return false;
    throw e;
  }
}

export async function listPaths(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, limit: 1000, cursor });
    for (const b of r.blobs) out.push(b.pathname);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

export async function remove(pathnames) {
  const arr = [].concat(pathnames).filter(Boolean);
  if (arr.length) await del(arr);
}

/* ---- 관리자 인증 (HMAC 서명 토큰, 12시간) ---- */
function secret() {
  const s = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update("yd-career:" + s).digest();
}
export function makeToken() {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const sig = crypto.createHmac("sha256", secret()).update(String(exp)).digest("hex");
  return exp + "." + sig;
}
export function checkToken(token) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [exp, sig] = String(token).split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = crypto.createHmac("sha256", secret()).update(String(exp)).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)); } catch { return false; }
}
export function passwordOK(pw) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real || typeof pw !== "string") return false;
  const a = crypto.createHash("sha256").update(pw).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b);
}
export function requireAdmin(req, res) {
  const h = req.headers["authorization"] || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!checkToken(token)) {
    res.status(401).json({ error: "관리자 로그인이 필요합니다." });
    return false;
  }
  return true;
}

/* ---- 공통 ---- */
export function newId() {
  // 사람이 읽기 쉬운 예약번호: YD-XXXXXX (헷갈리는 글자 제외)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) s += chars[bytes[i] % chars.length];
  return "YD-" + s;
}
export function digits(s) { return String(s || "").replace(/\D/g, ""); }
export function clean(s, max = 200) { return String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max); }

export async function getBlocks() {
  return (await readJSON("config/blocks.json")) || { dates: [], slots: [] };
}

export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}
