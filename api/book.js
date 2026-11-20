// POST /api/book — 상담 예약 신청
import { slotsNeeded, slotKey, isTooSoon, TYPES, RANGE_START, RANGE_END } from "../lib/schedule.js";
import { claim, writeJSON, remove, newId, digits, clean, getBlocks, send } from "../lib/store.js";

const TOPICS = ["진로·진학", "과목 선택(고교학점제)", "IB 과정", "AI 교육", "기숙사·학교생활", "입학 절차", "기타"];

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  const b = req.body || {};
  if (b.website) return send(res, 200, { ok: true, id: "YD-000000" }); // 스팸 방지용 숨은 칸

  const type = TYPES[b.type] ? b.type : "student";
  const date = clean(b.date, 10);
  const time = clean(b.time, 5);
  const studentName = clean(b.studentName, 20);
  const school = clean(b.school, 30);
  const grade = clean(b.grade, 10);
  const studentPhone = clean(b.studentPhone, 20);
  const parentName = clean(b.parentName, 20);
  const parentPhone = clean(b.parentPhone, 20);
  const parentRelation = clean(b.parentRelation, 10);
  const career = clean(b.career, 40);
  const fieldName = clean(b.fieldName, 40);
  const message = clean(b.message, 500);
  const topics = Array.isArray(b.topics) ? b.topics.filter((t) => TOPICS.includes(t)).slice(0, 7) : [];

  // 검증
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < RANGE_START || date > RANGE_END) return send(res, 400, { error: "상담 날짜를 다시 선택해 주세요." });
  if (!studentName || !school) return send(res, 400, { error: "학생 이름과 학교를 입력해 주세요." });
  if (digits(studentPhone).length < 8 && digits(parentPhone).length < 8) return send(res, 400, { error: "연락받을 전화번호를 입력해 주세요." });
  if (type === "family" && (!parentName || digits(parentPhone).length < 8)) return send(res, 400, { error: "학부모 동반 상담은 보호자 이름과 연락처가 필요합니다." });
  if (!b.agree) return send(res, 400, { error: "개인정보 수집·이용에 동의해 주세요." });

  const times = slotsNeeded(date, time, type);
  if (!times) return send(res, 400, { error: type === "family" ? "부모님과 함께 오시는 상담은 바로 다음 시간도 비어 있어야 합니다. 다른 시간을 골라 주세요." : "선택할 수 없는 시간입니다." });
  if (isTooSoon(date, times[0])) return send(res, 400, { error: "지금부터 3시간 이후의 시간만 예약할 수 있습니다." });

  try {
    const blocks = await getBlocks();
    if ((blocks.dates || []).includes(date) || times.some((t) => (blocks.slots || []).includes(slotKey(date, t)))) {
      return send(res, 409, { error: "선택한 시간은 상담이 어렵습니다. 다른 시간을 골라 주세요." });
    }

    const id = newId();
    const claimed = [];
    for (const t of times) {
      const p = "slots/" + slotKey(date, t) + ".json";
      const ok = await claim(p, { id, at: new Date().toISOString() });
      if (!ok) {
        await remove(claimed); // 일부만 잡았으면 되돌림
        return send(res, 409, { error: "방금 다른 분이 이 시간을 예약했어요. 다른 시간을 골라 주세요." });
      }
      claimed.push(p);
    }

    const record = {
      id, status: "requested", type, typeLabel: TYPES[type].label, minutes: TYPES[type].minutes,
      date, time: times[0], endTime: times[times.length - 1], slots: claimed,
      studentName, school, grade, studentPhone, parentName, parentRelation, parentPhone,
      career, fieldName, topics, message,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), adminMemo: ""
    };
    await writeJSON("bookings/" + id + ".json", record);
    send(res, 200, { ok: true, id, date, time: times[0], minutes: record.minutes, typeLabel: record.typeLabel });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "예약을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
}
