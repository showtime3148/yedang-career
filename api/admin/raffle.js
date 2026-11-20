// GET  /api/admin/raffle — 게임 응모자 목록, 상담 완료자 목록, 지난 추첨 기록
// POST /api/admin/raffle — { pool: "game"|"consult", count } 추첨 후 기록 저장
import crypto from "node:crypto";
import { listPaths, readJSON, writeJSON, requireAdmin, send } from "../../lib/store.js";

async function readAll(prefix) {
  const paths = await listPaths(prefix), out = [];
  for (let i = 0; i < paths.length; i += 8) {
    const chunk = await Promise.all(paths.slice(i, i + 8).map((p) => readJSON(p)));
    chunk.forEach((r) => r && out.push(r));
  }
  return out;
}
async function pools() {
  const [game, bookings, draws] = await Promise.all([readAll("raffle/game/"), readAll("bookings/"), readAll("raffle/draws/")]);
  // 상담 완료자: 같은 학생(이름+연락처)은 한 번만
  const seen = new Set(), consult = [];
  bookings.filter((b) => b.status === "done").forEach((b) => {
    const k = b.studentName + "|" + String(b.studentPhone || b.parentPhone).replace(/\D/g, "");
    if (seen.has(k)) return; seen.add(k);
    consult.push({ name: b.studentName, school: b.school, phone: b.studentPhone || b.parentPhone, field: b.career, at: b.updatedAt, id: b.id });
  });
  game.sort((a, b) => a.at.localeCompare(b.at));
  draws.sort((a, b) => b.at.localeCompare(a.at));
  return { game, consult, draws };
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") return send(res, 200, await pools());
    if (req.method === "POST") {
      const { pool, count } = req.body || {};
      if (pool !== "game" && pool !== "consult") return send(res, 400, { error: "추첨 대상을 고르세요." });
      const n = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
      const p = await pools();
      const list = p[pool].slice();
      if (!list.length) return send(res, 400, { error: "응모자가 없습니다." });
      // 공정한 무작위 섞기 (crypto)
      for (let i = list.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [list[i], list[j]] = [list[j], list[i]]; }
      const winners = list.slice(0, Math.min(n, list.length));
      const rec = { pool, count: n, total: p[pool].length, winners, at: new Date().toISOString() };
      await writeJSON("raffle/draws/" + Date.now() + "-" + pool + ".json", rec);
      return send(res, 200, rec);
    }
    send(res, 405, { error: "GET 또는 POST" });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "처리 중 문제가 생겼습니다." });
  }
}
