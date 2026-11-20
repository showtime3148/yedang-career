// GET  /api/admin/bookings        — 전체 신청 목록
// POST /api/admin/bookings        — { id, status?, adminMemo? } 상태·메모 변경
import { listPaths, readJSON, writeJSON, remove, requireAdmin, clean, send, claim } from "../../lib/store.js";

const STATUSES = ["requested", "confirmed", "done", "cancelled", "noshow"];

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") {
      const paths = await listPaths("bookings/");
      const recs = [];
      // 동시에 너무 많이 읽지 않도록 8개씩
      for (let i = 0; i < paths.length; i += 8) {
        const chunk = await Promise.all(paths.slice(i, i + 8).map((p) => readJSON(p)));
        chunk.forEach((r) => r && recs.push(r));
      }
      recs.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      return send(res, 200, { bookings: recs });
    }
    if (req.method === "POST") {
      const b = req.body || {};
      const id = clean(b.id, 12);
      if (!/^YD-[A-Z0-9]{6}$/.test(id)) return send(res, 400, { error: "예약번호가 올바르지 않습니다." });
      const rec = await readJSON("bookings/" + id + ".json");
      if (!rec) return send(res, 404, { error: "예약을 찾지 못했습니다." });

      if (typeof b.adminMemo === "string") rec.adminMemo = clean(b.adminMemo, 1000);
      if (b.status && STATUSES.includes(b.status) && b.status !== rec.status) {
        const wasCancelled = rec.status === "cancelled";
        if (b.status === "cancelled") {
          await remove(rec.slots || []);
          rec.cancelledBy = "관리자";
        } else if (wasCancelled) {
          // 취소를 되돌릴 때는 시간대를 다시 잡아야 함
          const got = [];
          for (const p of rec.slots || []) {
            const ok = await claim(p, { id: rec.id, at: new Date().toISOString() });
            if (!ok) { await remove(got); return send(res, 409, { error: "그 시간에 이미 다른 예약이 있어 되돌릴 수 없습니다." }); }
            got.push(p);
          }
        }
        rec.status = b.status;
      }
      rec.updatedAt = new Date().toISOString();
      await writeJSON("bookings/" + id + ".json", rec);
      return send(res, 200, { ok: true, booking: rec });
    }
    send(res, 405, { error: "GET 또는 POST" });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "처리 중 문제가 생겼습니다." });
  }
}
