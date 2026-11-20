// 상담 일정 규칙 — 12월~2월 평일 16:00~18:00, 토요일 10:00~12:00, 30분 단위
export const RANGE_START = "2026-12-01";
export const RANGE_END = "2027-02-27";
export const SLOT_MIN = 30;
export const WEEKDAY_TIMES = ["16:00", "16:30", "17:00", "17:30"];
export const SATURDAY_TIMES = ["10:00", "10:30", "11:00", "11:30"];

// 공휴일 (관리자 화면에서 날짜를 추가로 막을 수 있음)
export const HOLIDAYS = {
  "2026-12-25": "성탄절",
  "2027-01-01": "신정",
  "2027-02-06": "설날 연휴",
  "2027-02-07": "설날",
  "2027-02-08": "설날 연휴",
  "2027-02-09": "대체공휴일"
};

export const TYPES = {
  student: { label: "학생 개인 상담", slots: 1, minutes: 30 },
  family: { label: "학부모 동반 상담", slots: 2, minutes: 60 }
};

function pad(n) { return String(n).padStart(2, "0"); }
export function ymd(d) { return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }

export function timesFor(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z");
  const dow = d.getUTCDay();
  if (HOLIDAYS[dateStr]) return [];
  if (dow === 0) return [];
  if (dow === 6) return SATURDAY_TIMES;
  return WEEKDAY_TIMES;
}

export function allDates() {
  const out = [];
  const end = new Date(RANGE_END + "T00:00:00Z");
  for (let d = new Date(RANGE_START + "T00:00:00Z"); d <= end; d.setUTCDate(d.getUTCDate() + 1)) out.push(ymd(d));
  return out;
}

export function nextTime(t) {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + SLOT_MIN;
  return pad(Math.floor(total / 60)) + ":" + pad(total % 60);
}

// 한국 시간 기준 현재 시각 (분 단위 epoch 비교용)
export function kstEpoch(dateStr, time) {
  return Date.parse(dateStr + "T" + time + ":00+09:00");
}

// 예약 가능 최소 시점: 지금부터 3시간 뒤
export function isTooSoon(dateStr, time) {
  return kstEpoch(dateStr, time) < Date.now() + 3 * 60 * 60 * 1000;
}

export function slotKey(dateStr, time) { return dateStr + "_" + time.replace(":", ""); }

// 상담 유형에 필요한 연속 슬롯 목록 (없으면 null)
export function slotsNeeded(dateStr, time, type) {
  const times = timesFor(dateStr);
  const n = (TYPES[type] || TYPES.student).slots;
  const idx = times.indexOf(time);
  if (idx < 0) return null;
  const list = times.slice(idx, idx + n);
  if (list.length < n) return null;
  return list;
}
