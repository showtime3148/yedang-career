// POST /api/raffle — 게임 완주 추첨 응모 { name, school, phone, field, agree }
// 같은 전화번호는 한 번만 응모됩니다(다시 응모하면 최신 정보로 바뀜).
import crypto from "node:crypto";
import { writeJSON, digits, clean, send } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  const b = req.body || {};
  if (b.website) return send(res, 200, { ok: true });
  const name = clean(b.name, 20), school = clean(b.school, 30), phone = clean(b.phone, 20), field = clean(b.field, 40);
  if (!name || !school) return send(res, 400, { error: "이름과 학교를 적어 주세요." });
  if (digits(phone).length < 10) return send(res, 400, { error: "당첨 연락을 받을 휴대폰 번호를 적어 주세요." });
  if (!b.agree) return send(res, 400, { error: "개인정보 수집·이용에 동의해 주세요." });
  const key = crypto.createHash("sha256").update("yd-raffle:" + digits(phone)).digest("hex").slice(0, 20);
  try {
    await writeJSON("raffle/game/" + key + ".json", { name, school, phone, field, at: new Date().toISOString() });
    send(res, 200, { ok: true });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "응모를 저장하지 못했어요. 잠시 후 다시 시도해 주세요." });
  }
}
