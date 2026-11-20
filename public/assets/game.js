/* 예당고 3년 미리 살기 — 6학기 동안 활동을 골라 진로를 찾아가는 게임
 * 능력치: 만들기(R) 탐구(I) 표현(A) 소통(S) 도전(E) 꼼꼼(C) + 성적 + 체력
 * 졸업할 때 능력치 모양과 가장 닮은 진로 분야(data-fields.js)를 추천합니다. */
(function () {
  "use strict";
  var STATS = [
    { k: "R", name: "만들기", c: "#E07B1F" },
    { k: "I", name: "탐구", c: "#2D6FD6" },
    { k: "A", name: "표현", c: "#C9428E" },
    { k: "S", name: "소통", c: "#1C9B6E" },
    { k: "E", name: "도전", c: "#D94F6B" },
    { k: "C", name: "꼼꼼", c: "#6B55D9" }
  ];
  var SEM = ["1학년 1학기", "1학년 2학기", "2학년 1학기", "2학년 2학기", "3학년 1학기", "3학년 2학기"];

  // 분야별 능력치 모양 (R I A S E C)
  var PROFILE = {
    doctor: [1, 3, 0, 2, 1, 1], nursing: [1, 2, 0, 3, 0, 1], bio: [1, 3, 0, 0, 0, 2], semi: [3, 3, 0, 0, 0, 1],
    mech: [3, 2, 1, 0, 1, 0], aero: [3, 2, 0, 0, 2, 0], arch: [2, 1, 3, 0, 0, 1], chem: [2, 3, 0, 0, 0, 1],
    cs_ai: [2, 3, 1, 0, 1, 1], game: [2, 1, 3, 0, 1, 0], science: [0, 3, 0, 0, 0, 2], environment: [2, 2, 0, 1, 1, 0],
    business: [0, 1, 0, 1, 3, 2], law_gov: [0, 1, 0, 1, 2, 3], humanities: [0, 2, 3, 1, 0, 0], media: [0, 1, 3, 1, 2, 0],
    education: [0, 1, 0, 3, 1, 1], welfare: [0, 1, 0, 3, 0, 1], safety: [3, 0, 0, 2, 2, 0], tourism: [1, 0, 1, 3, 2, 0],
    design: [1, 0, 3, 0, 1, 1], music: [1, 0, 3, 1, 1, 0], sports: [3, 0, 0, 1, 2, 0]
  };

  // 활동 카드: cost(시간 칸) / fx 능력치 / g 성적 / en 체력 / from 학기(0~5)부터 / tag 생기부 문장
  var CARDS = [
    { id: "lib", e: "📚", n: "도서관 혜윰에서 책 읽기", p: "도서관 혜윰", cost: 1, fx: { I: 1, A: 1 }, g: 0, en: 0, tag: "도서관에서 관심 분야 책을 꾸준히 읽음" },
    { id: "dadok", e: "🗣️", n: "다독다독 독서토론", p: "독서 동아리", cost: 1, fx: { A: 1, S: 1, I: 1 }, g: 0, en: -1, tag: "독서토론에서 근거를 들어 자기 생각을 말함" },
    { id: "pi", e: "π", n: "파이(π) 수학 탐구", p: "수학 동아리", cost: 1, fx: { I: 2, C: 1 }, g: 1, en: -1, tag: "수학 개념을 확장해 탐구 보고서를 씀" },
    { id: "lab", e: "🧪", n: "창의과학연구부 실험", p: "과학실", cost: 1, fx: { I: 2, R: 1 }, g: 0, en: -1, tag: "가설을 세우고 실험으로 검증함" },
    { id: "dal", e: "🔧", n: "달그락 메이커 활동", p: "무한상상실", cost: 1, fx: { R: 2, A: 1 }, g: 0, en: -1, tag: "센서로 생활 속 불편을 해결하는 장치를 만듦" },
    { id: "robit", e: "🤖", n: "ROBIT 로봇 만들기", p: "AI실", cost: 1, fx: { R: 2, I: 1 }, g: 0, en: -1, tag: "로봇을 설계하고 코딩으로 움직이게 함" },
    { id: "aikkum", e: "✨", n: "AI 꿈키움 프로젝트", p: "2030 AI 아고라", cost: 1, fx: { I: 1, R: 1, E: 1 }, g: 0, en: -1, tag: "AI로 지역 문제를 해결하는 프로젝트를 이끎" },
    { id: "vibe", e: "💻", n: "바이브코딩으로 앱 만들기", p: "AI실", cost: 1, fx: { R: 1, A: 1, E: 1 }, g: 0, en: -1, tag: "AI와 함께 친구들이 쓰는 앱을 직접 만듦" },
    { id: "night", e: "🩺", n: "나이팅게일 응급처치 캠페인", p: "보건 동아리", cost: 1, fx: { S: 2, R: 1 }, g: 0, en: -1, tag: "응급처치 캠페인을 기획해 친구들에게 알림" },
    { id: "frame", e: "🎬", n: "프레임잇 영상 제작", p: "미디어 동아리", cost: 1, fx: { A: 2, E: 1 }, g: 0, en: -1, tag: "학교 행사를 취재해 영상으로 만듦" },
    { id: "aimusic", e: "🎵", n: "AI 작곡 (인공지능미디어랩)", p: "음악실", cost: 1, fx: { A: 2, R: 1 }, g: 0, en: -1, tag: "AI 음악 도구로 곡을 만들고 편곡함" },
    { id: "draw", e: "🎨", n: "드로잉 동아리", p: "미술실", cost: 1, fx: { A: 2, C: 1 }, g: 0, en: 0, tag: "주제를 정해 연작 그림을 완성함" },
    { id: "vivid", e: "💃", n: "비비드 댄스 공연", p: "인명축제 무대", cost: 1, fx: { A: 1, E: 1, S: 1 }, g: -1, en: -1, tag: "축제 무대 공연을 친구들과 준비함" },
    { id: "futsal", e: "⚽", n: "공차 풋살", p: "풋살장", cost: 1, fx: { R: 2, S: 1 }, g: 0, en: 1, tag: "스포츠클럽에서 팀워크를 키움" },
    { id: "mentor", e: "🤝", n: "교학상장 또래 멘토링", p: "교실", cost: 1, fx: { S: 2, C: 1 }, g: 1, en: -1, tag: "친구에게 어려운 개념을 쉽게 설명해 줌" },
    { id: "mind", e: "💚", n: "마음챙김 캠페인", p: "상담실", cost: 1, fx: { S: 2 }, g: 0, en: 0, tag: "친구들의 마음건강 캠페인을 기획함" },
    { id: "council", e: "🏛️", n: "학생자치회 활동", p: "학생회실", cost: 1, fx: { E: 2, C: 1 }, g: 0, en: -1, tag: "학칙 개정안을 내고 의견을 모음" },
    { id: "debate", e: "⚖️", n: "시사 토론대회", p: "2030 AI 아고라", cost: 1, fx: { E: 1, I: 1, S: 1 }, g: 0, en: -1, tag: "사회 쟁점을 근거로 토론함" },
    { id: "write", e: "✍️", n: "문예 백일장", p: "국어과 대회", cost: 1, fx: { A: 2 }, g: 0, en: 0, tag: "백일장에서 자신의 이야기를 글로 씀" },
    { id: "star", e: "🔭", n: "'별 헤는 밤' 천체관측", p: "운동장", cost: 1, fx: { I: 2 }, g: 0, en: -1, tag: "천체를 관측하고 기록을 분석함" },
    { id: "english", e: "🌏", n: "어학실 영어 발표", p: "어학실 · HWHH", cost: 1, fx: { S: 1, A: 1, E: 1 }, g: 1, en: 0, tag: "진로 주제를 영어로 발표함" },
    { id: "league", e: "📋", n: "리그전 심판·기록 맡기", p: "진은관", cost: 1, fx: { C: 2, R: 1 }, g: 0, en: 0, tag: "경기 기록을 정리하고 분석함" },
    { id: "dorm", e: "🏠", n: "기숙사 생활부장", p: "심경학사", cost: 1, fx: { C: 2, S: 1 }, g: 0, en: -1, tag: "기숙사 생활 규칙을 함께 정함" },
    { id: "festival", e: "🎪", n: "인명축제 부스 운영", p: "축제", cost: 1, fx: { E: 2, S: 1 }, g: -1, en: -1, tag: "축제 부스의 수익 구조를 기획함" },
    { id: "donghaeng", e: "🌱", n: "'따뜻한 동행' 봉사", p: "지역 마을", cost: 1, fx: { S: 2, E: 1 }, g: 0, en: -1, tag: "지역 어르신 돌봄 봉사를 기획함" },
    { id: "eco", e: "🍃", n: "생태지도 만들기", p: "득량만 · 차밭", cost: 1, fx: { I: 1, R: 1, S: 1 }, g: 0, en: 0, tag: "우리 마을 생태지도를 만듦" },
    { id: "jayul", e: "🌙", n: "자율학습실 야간 자습", p: "자율학습실", cost: 1, fx: { C: 1 }, g: 3, en: -2, tag: "" },
    { id: "jeongdok", e: "📖", n: "정독실 집중 공부", p: "정독실", cost: 1, fx: { C: 1 }, g: 2, en: -1, tag: "" },
    { id: "cafe", e: "🎧", n: "학습카페 인강 듣기", p: "온라인 학습카페", cost: 1, fx: {}, g: 2, en: 0, tag: "" },
    { id: "rest", e: "👣", n: "맨발 트랙 걷기 · 쉬기", p: "맨발걷기 돌길", cost: 1, fx: {}, g: 0, en: 3, tag: "" },
    { id: "golf", e: "⛳", n: "스크린 골프로 기분 전환", p: "스크린 골프장", cost: 1, fx: { R: 1 }, g: 0, en: 2, tag: "" },
    { id: "onetamgu", e: "🔬", n: "1학생 1탐구", p: "지능형 과학실", cost: 2, fx: { I: 3, C: 1 }, g: 1, en: -2, from: 1, tag: "스스로 정한 주제로 1년간 탐구를 완성함" },
    { id: "fab", e: "🔌", n: "미니 반도체 팹 실습", p: "미니 팹", cost: 1, fx: { R: 2, I: 1 }, g: 0, en: -1, from: 2, tag: "반도체 공정을 실습하고 공정 변수를 분석함" },
    { id: "rne", e: "📑", n: "R&E 과제연구", p: "연구팀", cost: 2, fx: { I: 3, E: 1, C: 1 }, g: 0, en: -2, from: 2, tag: "연구팀을 꾸려 논문형 보고서를 씀" },
    { id: "ee", e: "📝", n: "IB 소논문(EE) 맛보기", p: "IB 수업", cost: 2, fx: { I: 2, A: 2 }, g: 1, en: -2, from: 1, tag: "스스로 질문을 세워 소논문을 씀" },
    { id: "indie", e: "🎮", n: "인디게임 만들기", p: "AI실", cost: 2, fx: { R: 2, A: 2, E: 1 }, g: -1, en: -2, from: 1, tag: "팀을 꾸려 인디게임을 만들어 출시함" },
    { id: "hanlim", e: "🎓", n: "한림원 석사와의 만남", p: "진로특강", cost: 1, fx: { I: 1, E: 1 }, g: 0, en: 0, from: 2, tag: "대학원 연구자와 연구 진로를 이야기함" },
    { id: "lead", e: "🧭", n: "후배 멘토 · 동아리 부장", p: "동아리", cost: 1, fx: { S: 1, E: 2 }, g: 0, en: -1, from: 4, tag: "동아리 부장으로 후배들을 이끎" },
    { id: "portfolio", e: "🗂️", n: "3년 활동 포트폴리오 정리", p: "진로실", cost: 1, fx: { C: 2, A: 1 }, g: 1, en: 0, from: 4, tag: "3년간의 활동을 하나의 이야기로 정리함" }
  ];

  // 학기 사이 사건 (선택지)
  var EVENTS = [
    { t: "중간고사 일주일 전, 친구가 축제 준비를 같이 하자고 한다.", a: [{ n: "시험공부에 집중한다", fx: { C: 1 }, g: 3, en: -1 }, { n: "축제 준비를 돕는다", fx: { E: 1, S: 1 }, g: -1, en: 0 }] },
    { t: "진로특강에서 만난 연구원이 연구실 견학을 제안했다.", a: [{ n: "견학을 간다", fx: { I: 2 }, g: 0, en: -1 }, { n: "다음 기회로 미룬다", fx: {}, g: 1, en: 1 }] },
    { t: "금요일 밤 생성형 AI 해커톤 캠프 공지가 올라왔다.", a: [{ n: "팀을 꾸려 참가한다", fx: { R: 1, I: 1, E: 1 }, g: 0, en: -2 }, { n: "푹 쉰다", fx: {}, g: 0, en: 2 }] },
    { t: "기숙사 룸메이트와 생활 습관 때문에 사이가 어색해졌다.", a: [{ n: "솔직하게 대화한다", fx: { S: 2 }, g: 0, en: -1 }, { n: "사감 선생님과 규칙을 정한다", fx: { C: 1, S: 1 }, g: 0, en: 0 }] },
    { t: "IB 수업 시간, 선생님이 '우리는 그것을 어떻게 아는가?'라고 물었다.", a: [{ n: "근거를 찾아 발표한다", fx: { I: 1, E: 1 }, g: 1, en: -1 }, { n: "다른 관점의 글을 써 본다", fx: { A: 1, I: 1 }, g: 1, en: 0 }] },
    { t: "선배와의 만남. 원하는 대학에 간 선배가 3년 공부법을 알려 줬다.", a: [{ n: "공부 계획표를 새로 짠다", fx: { C: 1 }, g: 2, en: 0 }, { n: "선배에게 활동 조언을 묻는다", fx: { E: 1, S: 1 }, g: 0, en: 0 }] },
    { t: "요즘 피곤해서 수업 시간에 자꾸 졸린다.", a: [{ n: "맨발 트랙을 걸으며 쉰다", fx: {}, g: 0, en: 3 }, { n: "참고 버틴다", fx: { C: 1 }, g: -1, en: -1 }] },
    { t: "서울대 나눔교실 대학생 멘토가 겨울방학 캠프를 연다.", a: [{ n: "캠프에 참가한다", fx: { I: 1, S: 1 }, g: 2, en: -1 }, { n: "집에서 쉰다", fx: {}, g: 0, en: 2 }] },
    { t: "학교 홍보 영상을 같이 찍자는 제안을 받았다.", a: [{ n: "출연하고 편집도 돕는다", fx: { A: 1, E: 1 }, g: 0, en: -1 }, { n: "대본만 써 준다", fx: { A: 1, C: 1 }, g: 0, en: 0 }] },
    { t: "지역 어르신 디지털 교실에서 도우미를 구한다.", a: [{ n: "스마트폰 사용법을 가르쳐 드린다", fx: { S: 2, R: 1 }, g: 0, en: -1 }, { n: "안내 자료를 만들어 드린다", fx: { C: 1, A: 1 }, g: 0, en: 0 }] }
  ];
  var TRACKS = [
    { n: "자연·공학 과목 위주", d: "물리학, 화학, 미적분Ⅰ, 정보", fx: { I: 1, R: 1 } },
    { n: "인문·사회 과목 위주", d: "사회와 문화, 세계사, 문학, 경제", fx: { S: 1, E: 1 } },
    { n: "생명·보건 과목 위주", d: "생명과학, 화학, 확률과 통계, 보건", fx: { I: 1, S: 1 } },
    { n: "예술·디자인 과목 위주", d: "미술, 음악, 매체 의사소통, 정보", fx: { A: 2 } }
  ];
  var BADGES = [
    { id: "book", n: "책벌레", d: "도서관·독서 활동 3번", test: function (s) { return cnt(s, ["lib", "dadok"]) >= 3; } },
    { id: "ai", n: "AI 개척자", d: "AI 활동 3번", test: function (s) { return cnt(s, ["aikkum", "vibe", "robit", "indie", "aimusic"]) >= 3; } },
    { id: "lab", n: "밤샘 연구자", d: "R&E·1인 1탐구·소논문 2번", test: function (s) { return cnt(s, ["rne", "onetamgu", "ee"]) >= 2; } },
    { id: "heart", n: "따뜻한 마음", d: "봉사·멘토링·캠페인 4번", test: function (s) { return cnt(s, ["donghaeng", "mentor", "mind", "night"]) >= 4; } },
    { id: "stage", n: "무대 체질", d: "공연·축제·영상 3번", test: function (s) { return cnt(s, ["vivid", "festival", "frame"]) >= 3; } },
    { id: "study", n: "자기주도학습왕", d: "자습·정독실 5번", test: function (s) { return cnt(s, ["jayul", "jeongdok", "cafe"]) >= 5; } },
    { id: "balance", n: "균형 잡힌 사람", d: "모든 능력치 5 이상", test: function (s) { return STATS.every(function (x) { return s.st[x.k] >= 5; }); } },
    { id: "fab", n: "반도체 꿈나무", d: "미니 팹 실습 2번", test: function (s) { return cnt(s, ["fab"]) >= 2; } }
  ];
  function cnt(s, ids) { return s.log.filter(function (l) { return ids.indexOf(l) >= 0; }).length; }

  /* ───── 상태 ───── */
  var KEY = "yd_game_v1", st;
  function fresh(name) { var o = { name: name || "", sem: 0, st: {}, g: 50, en: 8, log: [], track: null, picked: [], hand: [], done: false, events: [] }; STATS.forEach(function (x) { o.st[x.k] = 1; }); return o; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function deal() {
    var pool = CARDS.filter(function (c) { return (c.from || 0) <= st.sem; });
    var study = pool.filter(function (c) { return !c.tag || c.id === "rest"; });
    var acts = shuffle(pool.filter(function (c) { return c.tag && c.id !== "rest"; })).slice(0, 5);
    var extra = shuffle(study).slice(0, 2);
    st.hand = acts.concat(extra).map(function (c) { return c.id; });
    st.picked = [];
  }
  function card(id) { return CARDS.find(function (c) { return c.id === id; }); }
  function slotsUsed() { return st.picked.reduce(function (n, id) { return n + card(id).cost; }, 0); }
  function apply(fx, g, en) { Object.keys(fx || {}).forEach(function (k) { st.st[k] = (st.st[k] || 0) + fx[k]; }); st.g = clamp(st.g + (g || 0), 0, 100); st.en = clamp(st.en + (en || 0), 0, 10); }
  function fxText(c) {
    var p = [];
    STATS.forEach(function (x) { if (c.fx && c.fx[x.k]) p.push(x.name + " +" + c.fx[x.k]); });
    if (c.g) p.push("성적 " + (c.g > 0 ? "+" : "") + c.g);
    if (c.en) p.push("체력 " + (c.en > 0 ? "+" : "") + c.en);
    return p.join(" · ") || "변화 없음";
  }

  /* ───── 화면 ───── */
  var root;
  function hud() {
    var max = Math.max.apply(null, STATS.map(function (x) { return st.st[x.k]; }).concat([8]));
    return '<div class="g-hud"><ol class="g-sems" aria-label="학기 진행">' + SEM.map(function (s, i) { return '<li class="' + (i < st.sem ? "g-done" : i === st.sem ? "now" : "") + '"><span>' + s.replace("학년 ", "-").replace("학기", "") + "</span></li>"; }).join("") + "</ol>" +
      '<div class="g-meters"><div class="g-meter"><span>체력</span><i style="--v:' + st.en * 10 + '%" class="m-en"></i><b>' + st.en + "/10</b></div>" +
      '<div class="g-meter"><span>성적</span><i style="--v:' + st.g + '%" class="m-g"></i><b>' + gradeLabel(st.g) + "</b></div></div>" +
      '<div class="g-stats">' + STATS.map(function (x) { return '<div class="g-stat"><span>' + x.name + '</span><i style="--v:' + Math.round(st.st[x.k] / max * 100) + "%;--c:" + x.c + '"></i><b>' + st.st[x.k] + "</b></div>"; }).join("") + "</div></div>";
  }
  function gradeLabel(g) { return g >= 80 ? "최상위권" : g >= 65 ? "상위권" : g >= 45 ? "중위권" : "노력 필요"; }

  function render() {
    if (!st || !st.name) return renderStart();
    if (st.done) return renderEnd();
    if (st.sem === 2 && !st.track) return renderTrack();
    if (!st.hand.length) { deal(); save(); }
    var left = 3 - slotsUsed();
    root.innerHTML = hud() +
      '<section class="g-play"><h2>' + SEM[st.sem] + '<small>이번 학기에 할 일을 골라 주세요. 시간 칸 <b>' + left + "</b>개 남음</small></h2>" +
      (st.en <= 2 ? '<p class="g-warn">체력이 바닥났어요. 쉬는 활동을 하나 넣어 보세요.</p>' : "") +
      '<div class="g-cards">' + st.hand.map(function (id) {
        var c = card(id), on = st.picked.indexOf(id) >= 0, dis = !on && c.cost > left;
        return '<button class="g-card' + (on ? " on" : "") + '" data-id="' + id + '"' + (dis ? " disabled" : "") + ' aria-pressed="' + on + '"><span class="g-e" aria-hidden="true">' + c.e + "</span><b>" + esc(c.n) + '</b><span class="g-p">' + esc(c.p) + (c.cost > 1 ? " · 시간 2칸" : "") + '</span><span class="g-fx">' + fxText(c) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="g-actions"><button class="btn btn-primary" id="gNext"' + (st.picked.length ? "" : " disabled") + ">" + (st.sem === 5 ? "졸업하기" : "이번 학기 마치기") + '</button><button class="btn btn-ghost btn-small" id="gReset">처음부터</button></div></section>';
    root.querySelectorAll(".g-card").forEach(function (b) {
      b.onclick = function () { var id = b.dataset.id, i = st.picked.indexOf(id); if (i >= 0) st.picked.splice(i, 1); else st.picked.push(id); save(); render(); };
    });
    root.querySelector("#gNext").onclick = endSemester;
    root.querySelector("#gReset").onclick = function () { st = fresh(st.name); save(); render(); };
  }

  function renderStart() {
    var id = null; try { id = JSON.parse(sessionStorage.getItem("yd_id") || "null"); } catch (e) {}
    var saved = load();
    root.innerHTML = '<section class="g-start"><div class="g-start-art" aria-hidden="true">' + SEM.map(function (s, i) { return '<span style="--i:' + i + '">' + s + "</span>"; }).join("") + "</div>" +
      '<div><h2>예당고 3년, 미리 살아 보기</h2><p>2027년 3월, 예당고에 입학했어요. 6학기 동안 동아리·탐구·봉사·공부·휴식 가운데 무엇을 할지 고르세요. 고른 활동이 쌓여 졸업할 때 나에게 맞는 진로가 나타납니다.</p>' +
      '<ul class="g-rules"><li>학기마다 시간 칸 3개를 씁니다.</li><li>활동마다 만들기·탐구·표현·소통·도전·꼼꼼 능력치가 오릅니다.</li><li>공부를 안 하면 성적이, 쉬지 않으면 체력이 떨어져요.</li></ul>' +
      '<form id="gStart" class="g-form"><label for="gName">이름</label><div class="g-row"><input id="gName" maxlength="12" placeholder="이름 또는 별명" value="' + esc((id && id.name) || "") + '"><button class="btn btn-primary" type="submit">입학하기</button></div></form>' +
      (saved && saved.name && !saved.done ? '<button class="btn btn-ghost btn-small" id="gCont">' + esc(saved.name) + " 학생, " + SEM[saved.sem] + "부터 이어 하기</button>" : "") + "</div></section>";
    root.querySelector("#gStart").onsubmit = function (e) { e.preventDefault(); var n = root.querySelector("#gName").value.trim() || "예당이"; st = fresh(n); deal(); save(); render(); };
    var c = root.querySelector("#gCont"); if (c) c.onclick = function () { st = saved; render(); };
  }

  function renderTrack() {
    root.innerHTML = hud() + '<section class="g-play"><h2>2학년 과목 선택<small>고교학점제! 2학년부터는 듣고 싶은 과목을 직접 고릅니다.</small></h2><div class="g-cards">' +
      TRACKS.map(function (t, i) { return '<button class="g-card" data-i="' + i + '"><span class="g-e" aria-hidden="true">🗂️</span><b>' + esc(t.n) + '</b><span class="g-p">' + esc(t.d) + '</span><span class="g-fx">' + fxText({ fx: t.fx }) + "</span></button>"; }).join("") + "</div></section>";
    root.querySelectorAll(".g-card").forEach(function (b) { b.onclick = function () { var t = TRACKS[+b.dataset.i]; st.track = t.n; apply(t.fx, 0, 0); deal(); save(); render(); }; });
  }

  function endSemester() {
    st.picked.forEach(function (id) { var c = card(id); apply(c.fx, c.g, c.en); st.log.push(id); });
    st.g = clamp(st.g + (st.en <= 1 ? -3 : 0) - 1, 0, 100); // 시간이 지나면 성적은 조금씩 내려가요(복습 필요)
    st.en = clamp(st.en + 1, 0, 10);
    var gained = st.picked.slice();
    st.picked = []; st.hand = [];
    if (st.sem === 5) { st.done = true; save(); return render(); }
    var ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    showEvent(ev, gained);
  }
  function showEvent(ev, gained) {
    var bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = '<div class="modal g-ev" role="dialog" aria-modal="true" aria-labelledby="evT"><p class="g-ev-k">' + SEM[st.sem] + ' 끝 · 이번 학기 기록</p><p class="g-ev-log">' + gained.map(function (id) { return card(id).e + " " + esc(card(id).n); }).join("<br>") + '</p><h2 id="evT">' + esc(ev.t) + '</h2><div class="g-ev-a">' +
      ev.a.map(function (a, i) { return '<button class="btn ' + (i ? "btn-ghost" : "btn-primary") + '" data-i="' + i + '">' + esc(a.n) + "<small>" + fxText(a) + "</small></button>"; }).join("") + "</div></div>";
    document.body.appendChild(bg);
    bg.querySelectorAll("[data-i]").forEach(function (b) {
      b.onclick = function () { var a = ev.a[+b.dataset.i]; apply(a.fx, a.g, a.en); st.events.push(ev.t); st.sem++; save(); bg.remove(); render(); window.scrollTo({ top: root.offsetTop - 70, behavior: "smooth" }); };
    });
    bg.querySelector("[data-i]").focus();
  }

  function match() {
    var v = STATS.map(function (x) { return st.st[x.k]; });
    var mean = v.reduce(function (a, b) { return a + b; }, 0) / 6;
    var vc = v.map(function (x) { return x - mean; });
    var F = window.YD.FIELDS;
    return F.map(function (f) {
      var p = PROFILE[f.id] || [1, 1, 1, 1, 1, 1], pm = p.reduce(function (a, b) { return a + b; }, 0) / 6;
      var pc = p.map(function (x) { return x - pm; });
      var dot = 0, a = 0, b = 0; for (var i = 0; i < 6; i++) { dot += vc[i] * pc[i]; a += vc[i] * vc[i]; b += pc[i] * pc[i]; }
      return { f: f, s: a && b ? dot / Math.sqrt(a * b) : 0 };
    }).sort(function (x, y) { return y.s - x.s; });
  }
  function radar() {
    var max = Math.max.apply(null, STATS.map(function (x) { return st.st[x.k]; }).concat([6])), R = 110, cx = 150, cy = 140;
    function pt(i, r) { var a = -Math.PI / 2 + i * Math.PI / 3; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    var grid = [0.33, 0.66, 1].map(function (k) { return '<polygon points="' + STATS.map(function (_, i) { return pt(i, R * k).join(","); }).join(" ") + '" fill="none" stroke="rgba(255,255,255,.18)"/>'; }).join("");
    var poly = '<polygon points="' + STATS.map(function (x, i) { return pt(i, R * st.st[x.k] / max).join(","); }).join(" ") + '" fill="rgba(201,234,106,.35)" stroke="#C9EA6A" stroke-width="2.5"/>';
    var labels = STATS.map(function (x, i) { var p = pt(i, R + 22); return '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" fill="#DDEBE1" font-size="13" font-weight="700">' + x.name + " " + st.st[x.k] + "</text>"; }).join("");
    return '<svg viewBox="0 0 300 290" role="img" aria-label="능력치 그래프">' + grid + poly + labels + "</svg>";
  }
  function renderEnd() {
    var m = match(), best = m[0].f, alts = [m[1].f, m[2].f];
    var acts = []; st.log.forEach(function (id) { var c = card(id); if (c.tag && acts.indexOf(c.tag) < 0) acts.push(c.tag); });
    var badges = BADGES.filter(function (b) { return b.test(st); });
    var top2 = STATS.slice().sort(function (a, b) { return st.st[b.k] - st.st[a.k]; }).slice(0, 2);
    try { localStorage.setItem("yd_game_last", JSON.stringify({ name: st.name, field: best.id, at: Date.now() })); } catch (e) {}
    root.innerHTML = '<section class="g-end"><div class="g-end-head"><div><p class="g-ev-k">' + esc(st.name) + ' 학생의 예당고 3년</p><h2>졸업을 축하해요!</h2><p>' + esc(top2[0].name) + "과 " + esc(top2[1].name) + " 능력이 가장 많이 자랐어요. 이 모양과 가장 닮은 진로는</p>" +
      '<div class="g-best"><span aria-hidden="true">' + best.emoji + "</span><b>" + esc(best.name) + "</b></div><p class=\"g-sub\">" + esc(best.tagline) + "</p>" +
      '<div class="g-end-btns"><a class="btn btn-sprout" href="#/f/' + best.id + '/1">이 진로 로드맵 보기</a><a class="btn btn-ghost g-light" href="#/booking?f=' + best.id + '">이 결과로 상담 신청</a></div></div>' +
      '<div class="g-radar">' + radar() + "</div></div>" +
      '<div class="g-end-body"><div><h3>이런 진로도 어울려요</h3><ul class="g-alts">' + alts.map(function (f) { return '<li><a href="#/f/' + f.id + '/1">' + f.emoji + " " + esc(f.name) + "</a></li>"; }).join("") + "</ul>" +
      "<h3>얻은 배지</h3>" + (badges.length ? '<ul class="g-badges">' + badges.map(function (b) { return "<li><b>" + esc(b.n) + "</b><span>" + esc(b.d) + "</span></li>"; }).join("") + "</ul>" : '<p class="g-muted">이번엔 배지가 없어요. 다른 활동 조합으로 다시 도전해 보세요.</p>') +
      "<p class=\"g-muted\">최종 성적: " + gradeLabel(st.g) + " · 2학년 과목: " + esc(st.track || "-") + "</p></div>" +
      '<div><h3>내 생활기록부에 남을 이야기</h3><ul class="ul">' + acts.slice(-8).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div>" +
      '<div class="g-actions"><button class="btn btn-primary" id="gAgain">다른 3년 살아 보기</button><button class="btn btn-ghost" id="gShare">결과 저장</button></div>' +
      '<p class="src">게임 결과는 재미로 보는 참고용이에요. 진짜 진로는 활동을 해 보며 조금씩 찾아가는 거예요.</p></section>';
    root.querySelector("#gAgain").onclick = function () { st = fresh(st.name); deal(); save(); render(); window.scrollTo(0, 0); };
    root.querySelector("#gShare").onclick = function () {
      var t = ["예당고 3년 미리 살기 결과", "이름: " + st.name, "추천 진로: " + best.name, "어울리는 진로: " + alts.map(function (f) { return f.name; }).join(", "), "능력치: " + STATS.map(function (x) { return x.name + " " + st.st[x.k]; }).join(", "), "배지: " + (badges.map(function (b) { return b.n; }).join(", ") || "-"), "", "생활기록부 이야기:"].concat(acts.map(function (a) { return "- " + a; })).join("\n");
      var blob = new Blob([t], { type: "text/plain;charset=utf-8" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "예당고_3년미리살기_" + st.name + ".txt"; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 200);
    };
  }

  window.YD.game = {
    mount: function (el) { root = el; st = load(); if (st && st.done) st = null; render(); }
  };
})();
