// GET /api/availability — 날짜별 예약 가능 시간 (개인정보 없음)
import { allDates, timesFor, slotKey, isTooSoon, HOLIDAYS, RANGE_START, RANGE_END, TYPES } from "../lib/schedule.js";
import { listPaths, getBlocks, send } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "GET only" });
  try {
    const [taken, blocks] = await Promise.all([listPaths("slots/"), getBlocks()]);
    const takenSet = new Set(taken.map((p) => p.replace(/^slots\//, "").replace(/\.json$/, "")));
    const blockedDates = new Set(blocks.dates || []);
    const blockedSlots = new Set(blocks.slots || []);
    const days = allDates().map((date) => {
      const times = timesFor(date);
      const closedReason = HOLIDAYS[date] || (blockedDates.has(date) ? "휴무" : "");
      return {
        date,
        closed: !times.length || blockedDates.has(date),
        reason: closedReason,
        slots: times.map((t) => {
          const k = slotKey(date, t);
          let status = "open";
          if (blockedDates.has(date) || blockedSlots.has(k)) status = "blocked";
          else if (takenSet.has(k)) status = "taken";
          else if (isTooSoon(date, t)) status = "past";
          return { time: t, status };
        })
      };
    });
    send(res, 200, { range: [RANGE_START, RANGE_END], types: TYPES, days });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
}
