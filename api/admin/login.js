// POST /api/admin/login — 관리자 비밀번호 확인 후 12시간 토큰 발급
import { passwordOK, makeToken, send } from "../../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  if (!process.env.ADMIN_PASSWORD) return send(res, 500, { error: "관리자 비밀번호(ADMIN_PASSWORD)가 설정되지 않았습니다." });
  const pw = (req.body || {}).password;
  await new Promise((r) => setTimeout(r, 400)); // 무차별 대입 완화
  if (!passwordOK(pw)) return send(res, 401, { error: "비밀번호가 맞지 않습니다." });
  send(res, 200, { ok: true, token: makeToken() });
}
