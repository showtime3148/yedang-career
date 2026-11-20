// POST /api/lookup — 예약번호 + 전화번호 뒤 4자리로 예약 확인·취소
import { readJSON, writeJSON, remove, digits, clean, send } from "../lib/store.js";

function matches(rec, last4) {
  const nums = [rec.studentPhone, rec.parentPhone].map(digits).filter(Boolean);
  return nums.some((n) => n.slice(-4) === last4);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  const b = req.body || {};
  const id = clean(b.id, 12).toUpperCase().replace(/\s/g, "");
  const last4 = digits(b.last4).slice(-4);
  if (!/^YD-[A-Z0-9]{6}$/.test(id) || last4.length !== 4) return send(res, 400, { error: "예약번호(YD-로 시작)와 전화번호 뒤 4자리를 확인해 주세요." });
  try {
    const rec = await readJSON("bookings/" + id + ".json");
    if (!rec || !matches(rec, last4)) return send(res, 404, { error: "일치하는 예약을 찾지 못했습니다." });

    if (b.action === "cancel") {
      if (rec.status === "cancelled") return send(res, 200, { ok: true, booking: publicView(rec) });
      if (rec.status === "done") return send(res, 400, { error: "이미 끝난 상담은 취소할 수 없습니다." });
      await remove(rec.slots || []);
      rec.status = "cancelled";
      rec.cancelledBy = "신청자";
      rec.updatedAt = new Date().toISOString();
      await writeJSON("bookings/" + id + ".json", rec);
    }
    send(res, 200, { ok: true, booking: publicView(rec) });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "조회 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요." });
  }
}

function publicView(r) {
  return { id: r.id, status: r.status, typeLabel: r.typeLabel, minutes: r.minutes, date: r.date, time: r.time, studentName: r.studentName, school: r.school, career: r.career };
}
