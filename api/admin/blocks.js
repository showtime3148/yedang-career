// GET  /api/admin/blocks — 막아 둔 날짜·시간
// POST /api/admin/blocks — { kind: "date"|"slot", key, blocked: true|false }
import { getBlocks, writeJSON, requireAdmin, send } from "../../lib/store.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const blocks = await getBlocks();
    if (req.method === "GET") return send(res, 200, blocks);
    if (req.method === "POST") {
      const { kind, key, blocked } = req.body || {};
      const list = kind === "date" ? "dates" : kind === "slot" ? "slots" : null;
      const valid = kind === "date" ? /^\d{4}-\d{2}-\d{2}$/.test(key) : /^\d{4}-\d{2}-\d{2}_\d{4}$/.test(key);
      if (!list || !valid) return send(res, 400, { error: "잘못된 요청입니다." });
      const set = new Set(blocks[list] || []);
      if (blocked) set.add(key); else set.delete(key);
      blocks[list] = Array.from(set).sort();
      await writeJSON("config/blocks.json", blocks);
      return send(res, 200, { ok: true, ...blocks });
    }
    send(res, 405, { error: "GET 또는 POST" });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "처리 중 문제가 생겼습니다." });
  }
}
