/* 예당고 3년 미리 살기 — 육성 시뮬레이션
 * 3년 = 12기간(학기마다 중간고사 전 · 기말고사 전). 기간마다 방과후·자습 20시간(2시간 × 10칸)을
 * 과목 공부 · 동아리 활동 · 휴식에 나눠 쓰고, 기간 끝에 시험을 봅니다.
 * 시험 점수 = 과목 실력(공부 시간 × 적성 × 컨디션이 쌓인 값) + 컨디션 + 운.
 * 54명 기준 석차와 5등급제(1등급 10% · 2등급 34% · 3등급 66% · 4등급 90%까지)로 성적표를 줍니다.
 * 활동으로 쌓인 진로 능력치(만들기 탐구 표현 소통 도전 꼼꼼)와 가장 닮은 진로 분야를 졸업 때 추천합니다. */
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
  var PERIODS = 12, SLOTS = 10, CLASS = 54;
  function periodLabel(p) { return SEM[Math.floor(p / 2)] + " " + (p % 2 ? "기말고사" : "중간고사"); }

  // 과목 (학년마다 이름이 바뀜). where: 공부하러 가는 곳
  var SUBJ = [
    { k: "ko", e: "📖", where: "library", names: ["공통국어", "문학", "독서와 작문"] },
    { k: "ma", e: "📐", where: "dorm", names: ["공통수학", "대수 · 미적분Ⅰ", "확률과 통계"] },
    { k: "en", e: "🌏", where: "library", names: ["공통영어", "영어Ⅰ", "영어Ⅱ"] },
    { k: "ta", e: "🔬", where: "lab", names: ["통합사회 · 통합과학", "선택 과목", "진로 선택 과목"] }
  ];
  var TRACKS = [
    { n: "자연·공학", d: "물리학, 화학, 미적분Ⅰ, 정보", ta: ["물리학 · 화학", "역학과 에너지 · 화학 반응"], fx: { I: 1, R: 1 }, talent: { ma: 0.05, ta: 0.05 } },
    { n: "인문·사회", d: "사회와 문화, 세계사, 경제, 정치", ta: ["사회와 문화 · 세계사", "경제 · 정치"], fx: { S: 1, E: 1 }, talent: { ko: 0.05, ta: 0.05 } },
    { n: "생명·보건", d: "생명과학, 화학, 확률과 통계, 보건", ta: ["생명과학 · 화학", "세포와 물질대사 · 생물의 유전"], fx: { I: 1, S: 1 }, talent: { ta: 0.08 } },
    { n: "예술·디자인", d: "미술, 음악, 매체 의사소통, 정보", ta: ["미술 창작 · 음악", "미술과 매체 · 음악과 미디어"], fx: { A: 2 }, talent: { ko: 0.05, en: 0.03 } }
  ];
  function subjName(s) {
    var g = Math.floor(st.p / 4);
    if (s.k === "ta" && g >= 1 && st.track) { var t = TRACKS.find(function (x) { return x.n === st.track; }); if (t) return t.ta[g - 1]; }
    return s.names[g];
  }

  // 분야별 능력치 모양 (R I A S E C)
  var PROFILE = {
    doctor: [1, 3, 0, 2, 1, 1], nursing: [1, 2, 0, 3, 0, 1], bio: [1, 3, 0, 0, 0, 2], semi: [3, 3, 0, 0, 0, 1],
    mech: [3, 2, 1, 0, 1, 0], aero: [3, 2, 0, 0, 2, 0], arch: [2, 1, 3, 0, 0, 1], chem: [2, 3, 0, 0, 0, 1],
    cs_ai: [2, 3, 1, 0, 1, 1], game: [2, 1, 3, 0, 1, 0], science: [0, 3, 0, 0, 0, 2], environment: [2, 2, 0, 1, 1, 0],
    business: [0, 1, 0, 1, 3, 2], law_gov: [0, 1, 0, 1, 2, 3], humanities: [0, 2, 3, 1, 0, 0], media: [0, 1, 3, 1, 2, 0],
    education: [0, 1, 0, 3, 1, 1], welfare: [0, 1, 0, 3, 0, 1], safety: [3, 0, 0, 2, 2, 0], tourism: [1, 0, 1, 3, 2, 0],
    design: [1, 0, 3, 0, 1, 1], music: [1, 0, 3, 1, 1, 0], sports: [3, 0, 0, 1, 2, 0]
  };

  // 활동 카드 (한 장에 2칸 = 4시간). fx 진로 능력치 / en 체력 / sub 과목 실력 보너스 / from 기간부터 / tag 생기부 문장
  var CARDS = [
    { id: "lib", e: "📚", n: "도서관 혜윰에서 책 읽기", p: "도서관 혜윰", fx: { I: 1, A: 1 }, en: 0, sub: { ko: 2 }, tag: "도서관에서 관심 분야 책을 꾸준히 읽음" },
    { id: "steam", e: "🧩", n: "STEAM 클럽 융합 프로젝트", p: "무한상상실", fx: { R: 1, A: 1, I: 1 }, en: -1, tag: "과학·기술·예술을 엮은 융합 작품을 만듦" },
    { id: "yunghap", e: "🛰️", n: "토요 인공지능 융합교실", p: "AI실", fx: { I: 1, R: 1 }, en: -1, sub: { ma: 1 }, tag: "토요일 AI 융합교실에서 데이터로 문제를 풀어 봄" },
    { id: "nanum", e: "🎒", n: "서울대 나눔교실 멘토링", p: "본관 교실", fx: { S: 1, I: 1 }, en: 0, sub: { ko: 1, en: 1 }, tag: "대학생 멘토와 공부법·진로를 이야기함" },
    { id: "vibe", e: "💻", n: "바이브코딩으로 앱 만들기", p: "AI실", fx: { R: 1, A: 1, E: 1 }, en: -1, tag: "AI와 함께 친구들이 쓰는 앱을 직접 만듦" },
    { id: "council", e: "🏛️", n: "학생자치회 활동", p: "학생회실", fx: { E: 2, C: 1 }, en: -1, tag: "학칙 개정안을 내고 의견을 모음" },
    { id: "debate", e: "⚖️", n: "시사 토론대회", p: "2030 AI 아고라", fx: { E: 1, I: 1, S: 1 }, en: -1, sub: { ta: 1 }, tag: "사회 쟁점을 근거로 토론함" },
    { id: "write", e: "✍️", n: "문예 백일장", p: "도서관", fx: { A: 2 }, en: 0, sub: { ko: 2 }, tag: "백일장에서 자신의 이야기를 글로 씀" },
    { id: "star", e: "🔭", n: "'별 헤는 밤' 천체관측", p: "운동장", fx: { I: 2 }, en: -1, sub: { ta: 1 }, tag: "천체를 관측하고 기록을 분석함" },
    { id: "league", e: "📋", n: "리그전 심판·기록 맡기", p: "진은관", fx: { C: 2, R: 1 }, en: 0, tag: "경기 기록을 정리하고 분석함" },
    { id: "dorm", e: "🏠", n: "기숙사 생활부장", p: "심경학사", fx: { C: 2, S: 1 }, en: -1, tag: "기숙사 생활 규칙을 함께 정함" },
    { id: "festival", e: "🎪", n: "인명축제 부스 운영", p: "축제", fx: { E: 2, S: 1 }, en: -1, tag: "축제 부스의 수익 구조를 기획함" },
    { id: "donghaeng", e: "🌱", n: "'따뜻한 동행' 봉사", p: "지역 마을", fx: { S: 2, E: 1 }, en: -1, tag: "지역 어르신 돌봄 봉사를 기획함" },
    { id: "eco", e: "🍃", n: "생태지도 만들기", p: "득량만 · 차밭", fx: { I: 1, R: 1, S: 1 }, en: 0, sub: { ta: 1 }, tag: "우리 마을 생태지도를 만듦" },
    { id: "onetamgu", e: "🔬", n: "1학생 1탐구", p: "지능형 과학실", fx: { I: 3, C: 1 }, en: -1, sub: { ta: 2 }, from: 2, tag: "스스로 정한 주제로 1년간 탐구를 완성함" },
    { id: "fab", e: "🔌", n: "미니 반도체 팹 실습", p: "미니 팹", fx: { R: 2, I: 1 }, en: -1, from: 4, tag: "반도체 공정을 실습하고 공정 변수를 분석함" },
    { id: "rne", e: "📑", n: "R&E 과제연구", p: "연구팀", fx: { I: 3, E: 1, C: 1 }, en: -2, sub: { ta: 2 }, from: 4, tag: "연구팀을 꾸려 논문형 보고서를 씀" },
    { id: "ee", e: "📝", n: "IB 소논문(EE) 맛보기", p: "IB 수업", fx: { I: 2, A: 2 }, en: -1, sub: { ko: 1, ta: 1 }, from: 2, tag: "스스로 질문을 세워 소논문을 씀" },
    { id: "indie", e: "🎮", n: "인디게임 만들기", p: "AI실", fx: { R: 2, A: 2, E: 1 }, en: -2, from: 2, tag: "팀을 꾸려 인디게임을 만들어 출시함" },
    { id: "hanlim", e: "🎓", n: "한림원 석사와의 만남", p: "진로특강", fx: { I: 1, E: 1 }, en: 0, from: 4, tag: "대학원 연구자와 연구 진로를 이야기함" },
    { id: "lead", e: "🧭", n: "동아리 부장 맡기", p: "내 동아리", fx: { S: 1, E: 2 }, en: -1, from: 8, tag: "동아리 부장으로 후배들을 이끎" },
    { id: "portfolio", e: "🗂️", n: "3년 활동 포트폴리오 정리", p: "진로실", fx: { C: 2, A: 1 }, en: 0, from: 8, tag: "3년간의 활동을 하나의 이야기로 정리함" }
  ];

  // 예당고 실제 동아리 (data-base.js CLUBS 설명 사용)
  // 정규 동아리: 학년마다 하나 고르고, 창체 동아리 시간에 매 기간 자동으로 활동 (방과후 시간을 쓰지 않음)
  // 자율동아리: 원하면 하나 가입하고, 방과후 4시간을 써서 활동 카드처럼 고름
  var CLUB = [
    { k: "aimidia", e: "🎵", n: "인공지능미디어랩", at: "art", fx: { A: 1, R: 1 }, tag: "AI 음악 생성 도구와 Logic Pro로 곡을 만들고 음향을 다듬음" },
    { k: "dalgeurak", e: "🔧", n: "달그락", at: "maker", fx: { R: 2 }, tag: "미세먼지 측정기·스마트 화분 같은 생활 속 장치를 코딩해 만듦" },
    { k: "drawing", e: "🎨", n: "드로잉", at: "art", fx: { A: 2 }, tag: "주제를 정해 드로잉·회화 연작을 완성함" },
    { k: "nightingale", e: "🩺", n: "나이팅게일", at: "classroom", fx: { S: 1, I: 1 }, tag: "보건·의료를 탐구하고 응급처치·건강 캠페인을 기획함" },
    { k: "frameit", e: "🎬", n: "프레임잇", at: "art", fx: { A: 1, E: 1 }, tag: "사진·영상으로 학교 행사를 기록하고 편집함" },
    { k: "pi", e: "π", n: "파이(π)", at: "classroom", fx: { I: 1, C: 1 }, sub: { ma: 1 }, tag: "수학 개념을 탐구하고 알고리즘·코딩으로 구현해 봄" },
    { k: "scienceLab", e: "🧪", n: "창의과학연구부", at: "lab", fx: { I: 2 }, sub: { ta: 1 }, tag: "자율 주제로 실험하고 연구 결과를 발표함" },
    { k: "dadok", e: "📚", n: "다독다독", at: "library", fx: { A: 1, S: 1 }, sub: { ko: 1 }, tag: "책을 읽고 서평을 쓰며 독서토론에 참여함" },
    { k: "hwhh", e: "🎤", n: "HWHH", at: "classroom", fx: { S: 1, A: 1 }, sub: { en: 1 }, tag: "영어로 진로 주제를 발표하고 토론함" },
    { k: "gongcha", e: "⚽", n: "공차", at: "field", fx: { R: 1, S: 1 }, en: 0.5, tag: "축구·풋살 경기로 체력과 팀워크를 키움" },
    { k: "gyohak", e: "🤝", n: "교학상장", at: "classroom", fx: { S: 2 }, sub: { ma: 1 }, tag: "또래교사로 친구에게 어려운 개념을 설명해 줌" },
    { k: "bookbang", e: "📖", n: "은행책방", at: "library", fx: { S: 1, C: 1 }, sub: { ko: 1 }, tag: "책방을 운영하며 책 나눔 행사를 꾸림" }
  ];
  var JCLUB = [
    { k: "aiclub", e: "🧠", n: "인공지능 동아리", at: "ai", fx: { I: 2, R: 1 }, en: -1, tag: "로보마스터·알고리즘 연구로 심화 SW 역량을 키움" },
    { k: "aikkum", e: "✨", n: "AI 꿈키움 동아리", at: "ai", fx: { I: 1, R: 1, E: 1 }, en: -1, tag: "인공지능 원리를 배우고 실제 프로젝트를 완성함" },
    { k: "robit", e: "🤖", n: "ROBIT · AI LENS", at: "ai", fx: { R: 2, I: 1 }, en: -1, tag: "로봇·AI 프로젝트로 문제를 해결함" },
    { k: "maeum", e: "💚", n: "학생마음챙김동아리", at: "classroom", fx: { S: 2 }, en: 1, tag: "친구들의 마음건강 캠페인을 기획함" },
    { k: "vivid", e: "💃", n: "비비드", at: "art", fx: { A: 2, E: 1 }, en: -1, tag: "인명축제 무대 댄스 공연을 준비함" }
  ];
  function clubDesc(k) { var d = (window.YD.base && window.YD.base.CLUBS || {})[k] || ""; var i = d.indexOf("—"); return i >= 0 ? d.slice(i + 1).trim() : d; }
  function clubCard(c, kind) { return { id: (kind === "j" ? "j_" : "c_") + c.k, e: c.e, n: c.n + (kind === "j" ? " (자율)" : ""), p: kind === "j" ? "자율동아리" : "정규 동아리", fx: c.fx, sub: c.sub, en: c.en || 0, tag: c.tag, at: c.at }; }
  function card(id) {
    if (!id) return null;
    if (id.indexOf("c_") === 0) { var c = CLUB.find(function (x) { return "c_" + x.k === id; }); return c ? clubCard(c, "c") : null; }
    if (id.indexOf("j_") === 0) { var j = JCLUB.find(function (x) { return "j_" + x.k === id; }); return j ? clubCard(j, "j") : null; }
    return CARDS.find(function (c) { return c.id === id; }) || null;
  }
  function yearOf(p) { return Math.floor(p / 4); }
  function myClub() { return st.club && st.club[yearOf(st.p)] ? card("c_" + st.club[yearOf(st.p)]) : null; }
  function myJClub() { return st.jclub && st.jclub[yearOf(st.p)] ? "j_" + st.jclub[yearOf(st.p)] : null; }

  // 기간 사이 사건
  var EVENTS = [
    { t: "시험 끝난 주말, 친구가 축제 준비를 같이 하자고 한다.", a: [{ n: "축제 준비를 돕는다", fx: { E: 1, S: 1 }, en: -1, sr: -10 }, { n: "밀린 공부를 한다", fx: { C: 1 }, en: -1, sr: 5, skill: 2 }] },
    { t: "진로특강에서 만난 연구원이 연구실 견학을 제안했다.", a: [{ n: "견학을 간다", fx: { I: 2 }, en: -1, sr: -5 }, { n: "다음 기회로 미룬다", fx: {}, en: 1, sr: 0 }] },
    { t: "금요일 밤 생성형 AI 해커톤 캠프 공지가 올라왔다.", a: [{ n: "팀을 꾸려 참가한다", fx: { R: 1, I: 1, E: 1 }, en: -2, sr: -5 }, { n: "푹 쉰다", fx: {}, en: 2, sr: -10 }] },
    { t: "기숙사 룸메이트와 생활 습관 때문에 사이가 어색해졌다.", a: [{ n: "솔직하게 대화한다", fx: { S: 2 }, en: 0, sr: -10 }, { n: "사감 선생님과 규칙을 정한다", fx: { C: 1, S: 1 }, en: 0, sr: -5 }] },
    { t: "IB 수업 시간, 선생님이 '우리는 그것을 어떻게 아는가?'라고 물었다.", a: [{ n: "근거를 찾아 발표한다", fx: { I: 1, E: 1 }, en: -1, sr: 0, skill: 1 }, { n: "다른 관점의 글을 써 본다", fx: { A: 1, I: 1 }, en: 0, sr: 0, skill: 1 }] },
    { t: "선배와의 만남. 원하는 대학에 간 선배가 공부법을 알려 줬다.", a: [{ n: "공부 계획표를 새로 짠다", fx: { C: 1 }, en: 0, sr: 0, skill: 2 }, { n: "선배에게 활동 조언을 묻는다", fx: { E: 1, S: 1 }, en: 0, sr: -5 }] },
    { t: "요즘 피곤해서 수업 시간에 자꾸 졸린다.", a: [{ n: "맨발 트랙을 걸으며 쉰다", fx: {}, en: 3, sr: -15 }, { n: "커피를 마시고 버틴다", fx: { C: 1 }, en: -1, sr: 10 }] },
    { t: "서울대 나눔교실 대학생 멘토가 방학 캠프를 연다.", a: [{ n: "캠프에 참가한다", fx: { I: 1, S: 1 }, en: -1, sr: 0, skill: 3 }, { n: "집에서 쉰다", fx: {}, en: 2, sr: -15 }] },
    { t: "학교 홍보 영상을 같이 찍자는 제안을 받았다.", a: [{ n: "출연하고 편집도 돕는다", fx: { A: 1, E: 1 }, en: -1, sr: -5 }, { n: "대본만 써 준다", fx: { A: 1, C: 1 }, en: 0, sr: 0 }] },
    { t: "지역 어르신 디지털 교실에서 도우미를 구한다.", a: [{ n: "스마트폰 사용법을 가르쳐 드린다", fx: { S: 2, R: 1 }, en: -1, sr: -5 }, { n: "안내 자료를 만들어 드린다", fx: { C: 1, A: 1 }, en: 0, sr: 0 }] },
    { t: "성적표를 본 부모님이 학원을 다녀 보자고 하신다.", a: [{ n: "학교 방과후와 자습으로 해 보겠다고 말씀드린다", fx: { E: 1 }, en: 0, sr: 5, skill: 1 }, { n: "선생님과 함께 공부 계획을 세운다", fx: { C: 1 }, en: 0, sr: -5, skill: 2 }] }
  ];
  /* ───── 학교 지도와 캐릭터 ───── */
  // 지도 위 장소 (x, y 는 지도 1000×300 기준)
  var NODES = {
    gate: { x: 70, y: 250, n: "정문" }, village: { x: 95, y: 95, n: "득량 마을" }, field: { x: 210, y: 215, n: "운동장" },
    gym: { x: 300, y: 92, n: "진은관" }, classroom: { x: 445, y: 92, n: "본관 교실" }, maker: { x: 420, y: 238, n: "무한상상실" },
    ai: { x: 575, y: 150, n: "AI실·2030 아고라" }, art: { x: 625, y: 250, n: "음악·미술실" }, lab: { x: 700, y: 82, n: "과학실" },
    library: { x: 790, y: 190, n: "도서관 혜윰" }, dorm: { x: 890, y: 82, n: "심경학사" }, track: { x: 935, y: 245, n: "맨발 트랙" }
  };
  var LOC = { lib: "library", dadok: "library", write: "library", cafe: "library", ee: "library", pi: "classroom", mentor: "classroom", english: "classroom", night: "classroom", mind: "classroom", council: "classroom", lead: "classroom", portfolio: "classroom",
    lab: "lab", onetamgu: "lab", rne: "lab", hanlim: "lab", star: "field", festival: "field", dal: "maker", fab: "maker", robit: "ai", aikkum: "ai", vibe: "ai", indie: "ai", debate: "ai",
    frame: "art", aimusic: "art", draw: "art", vivid: "art", futsal: "gym", league: "gym", golf: "gym", donghaeng: "village", eco: "village", jayul: "dorm", jeongdok: "dorm", dorm: "dorm", rest: "track" };
  function locOf(id) { var c = card(id); return LOC[id] || (c && c.at) || "classroom"; }
  LOC.steam = "maker"; LOC.yunghap = "ai"; LOC.nanum = "classroom";
  var COLORS = [{ c: "#2C7350", n: "차잎 초록" }, { c: "#2B4C9A", n: "바다 파랑" }, { c: "#E0782A", n: "노을 주황" }, { c: "#B0457E", n: "동백 분홍" }];
  function charSVG(color) {
    return '<svg viewBox="0 0 60 92" aria-hidden="true"><g class="ch-body">' +
      '<ellipse cx="30" cy="89" rx="14" ry="3" fill="rgba(0,0,0,.18)"/>' +
      '<g class="ch-leg l"><rect x="22" y="64" width="7" height="20" rx="3.5" fill="#26313B"/><ellipse cx="25" cy="85" rx="5.5" ry="3" fill="#1B232B"/></g>' +
      '<g class="ch-leg r"><rect x="31" y="64" width="7" height="20" rx="3.5" fill="#26313B"/><ellipse cx="35" cy="85" rx="5.5" ry="3" fill="#1B232B"/></g>' +
      '<rect x="12" y="44" width="10" height="20" rx="5" fill="' + color + '" opacity=".75"/>' +
      '<g class="ch-arm l"><rect x="13" y="45" width="6" height="18" rx="3" fill="' + color + '"/><circle cx="16" cy="64" r="3.2" fill="#F3CDA8"/></g>' +
      '<rect x="18" y="41" width="24" height="27" rx="10" fill="' + color + '"/>' +
      '<path d="M26 41 L30 49 L34 41" fill="#fff"/><rect x="29" y="47" width="2" height="9" rx="1" fill="#C9EA6A"/>' +
      '<g class="ch-arm r"><rect x="41" y="45" width="6" height="18" rx="3" fill="' + color + '"/><circle cx="44" cy="64" r="3.2" fill="#F3CDA8"/></g>' +
      '<circle cx="30" cy="25" r="16" fill="#F6D7B8"/>' +
      '<path d="M14 24 C14 12 22 8 30 8 C39 8 46 13 46 24 C42 18 36 16 30 17 C24 16 18 19 14 24 Z" fill="#2A2522"/>' +
      '<circle cx="24.5" cy="27" r="2" fill="#2A2522"/><circle cx="35.5" cy="27" r="2" fill="#2A2522"/>' +
      '<circle cx="21" cy="32" r="2.6" fill="#F4A9A0" opacity=".7"/><circle cx="39" cy="32" r="2.6" fill="#F4A9A0" opacity=".7"/>' +
      '<path d="M26.5 32.5 Q30 35.5 33.5 32.5" stroke="#2A2522" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<g class="ch-sprout"><path d="M30 9 C30 5 30 3 30 1" stroke="#3F8F4E" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M30 3 C24 -2 18 1 19 5 C23 7 27 6 30 3 Z" fill="#7BC24F"/><path d="M30 3 C36 -2 42 1 41 5 C37 7 33 6 30 3 Z" fill="#9AD65A"/></g>' +
      "</g></svg>";
  }
  function mapSVG() {
    var B = function (x, y, w, h, roof, label, id) {
      return '<g class="mp-b" data-node="' + id + '"><rect x="' + (x - w / 2) + '" y="' + (y - h) + '" width="' + w + '" height="' + h + '" rx="6" fill="#FFFFFF" stroke="#C9D3C8"/>' +
        '<rect x="' + (x - w / 2 - 4) + '" y="' + (y - h - 8) + '" width="' + (w + 8) + '" height="12" rx="4" fill="' + roof + '"/>' +
        Array.from({ length: Math.max(2, Math.floor(w / 22)) }).map(function (_, i, a) { var wx = x - w / 2 + 8 + i * ((w - 16) / a.length); return '<rect x="' + wx + '" y="' + (y - h + 12) + '" width="' + ((w - 16) / a.length - 5) + '" height="9" rx="2" fill="#DCEBDD"/>'; }).join("") +
        '<text x="' + x + '" y="' + (y + 16) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#143A2B">' + label + "</text></g>";
    };
    var path = Object.keys(NODES).map(function (k) { return NODES[k]; });
    return '<svg class="mp" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<rect width="1000" height="300" rx="18" fill="#E8F1E3"/>' +
      '<path d="M0 40 C120 20 220 60 330 30 S560 10 700 35 S900 15 1000 30" stroke="#CFE3C4" stroke-width="16" fill="none"/>' +
      '<path d="M0 70 C140 50 240 90 360 60 S600 40 740 64 S920 45 1000 60" stroke="#D8EACD" stroke-width="12" fill="none"/>' +
      '<path d="M70 250 C150 240 180 210 210 215 S280 120 300 100 S380 100 445 100 S540 150 575 150 S650 90 700 90 S760 190 790 190 S860 90 890 90 S930 220 935 245 M210 215 C300 240 380 240 420 240 S560 250 625 250 S760 210 790 195 M95 100 C120 160 170 200 210 215" stroke="#F3E6C8" stroke-width="10" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="210" cy="222" rx="80" ry="34" fill="#BFDDB0"/><rect x="160" y="210" width="100" height="22" rx="11" fill="none" stroke="#FFFFFF" stroke-width="2"/>' +
      '<ellipse cx="935" cy="252" rx="52" ry="16" fill="none" stroke="#E5C894" stroke-width="7"/>' +
      '<g fill="#7FB88F"><circle cx="40" cy="180" r="13"/><circle cx="160" cy="70" r="11"/><circle cx="520" cy="60" r="12"/><circle cx="850" cy="160" r="12"/><circle cx="980" cy="160" r="10"/><circle cx="350" cy="250" r="10"/></g>' +
      '<g fill="#2C7350"><path d="M75 100 l20 -24 l20 24 z"/><rect x="80" y="100" width="30" height="20" fill="#FFFFFF" stroke="#C9D3C8"/></g><text x="95" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="#143A2B">득량 마을</text>' +
      '<g><rect x="52" y="232" width="8" height="26" fill="#143A2B"/><rect x="82" y="232" width="8" height="26" fill="#143A2B"/><rect x="48" y="226" width="46" height="9" rx="3" fill="#143A2B"/></g><text x="71" y="276" text-anchor="middle" font-size="13" font-weight="700" fill="#143A2B">정문</text>' +
      B(300, 100, 88, 52, "#E07B1F", "진은관", "gym") + B(445, 100, 110, 62, "#143A2B", "본관 교실", "classroom") + B(575, 158, 96, 50, "#2D6FD6", "AI실·2030 아고라", "ai") +
      B(700, 90, 84, 52, "#6B55D9", "과학실", "lab") + B(790, 198, 92, 48, "#1C9B6E", "도서관 혜윰", "library") + B(890, 90, 92, 62, "#0E8E9C", "심경학사", "dorm") +
      B(420, 246, 84, 40, "#D94F6B", "무한상상실", "maker") + B(625, 258, 84, 40, "#C9428E", "음악·미술실", "art") +
      '<text x="210" y="262" text-anchor="middle" font-size="13" font-weight="700" fill="#143A2B">운동장</text><text x="935" y="286" text-anchor="middle" font-size="13" font-weight="700" fill="#143A2B">맨발 트랙</text>' +
      "</svg>";
  }
  var walkQ = Promise.resolve();
  function moveTo(node, say, pop) {
    walkQ = walkQ.then(function () {
      return new Promise(function (done) {
        var el = root && root.querySelector(".ch"); if (!el) return done();
        var to = NODES[node] || NODES.gate, from = NODES[st.pos] || NODES.gate;
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.classList.toggle("flip", to.x < from.x);
        el.classList.add("walk");
        el.style.left = (to.x / 10) + "%"; el.style.top = (to.y / 3) + "%";
        st.pos = node;
        setTimeout(function () {
          el.classList.remove("walk");
          var bub = root.querySelector(".ch-bubble");
          if (bub && say) { bub.textContent = say; bub.classList.add("on"); clearTimeout(bub._t); bub._t = setTimeout(function () { bub.classList.remove("on"); }, 1800); }
          if (pop) { var f = document.createElement("span"); f.className = "ch-pop"; f.textContent = pop; f.style.left = el.style.left; f.style.top = el.style.top; el.parentNode.appendChild(f); setTimeout(function () { f.remove(); }, 1400); }
          done();
        }, reduce ? 50 : 950);
      });
    });
    return walkQ;
  }
  function mapHTML() {
    var p = NODES[st.pos] || NODES.gate;
    return '<div class="mp-wrap">' + mapSVG() + '<div class="ch" style="left:' + p.x / 10 + "%;top:" + p.y / 3 + '%"><span class="ch-bubble" role="status"></span>' + charSVG(st.color || COLORS[0].c) + "</div></div>";
  }
  function popText(c) {
    var best = null; STATS.forEach(function (x) { if (c.fx && c.fx[x.k] && (!best || c.fx[x.k] > c.fx[best.k])) best = { k: x.k, n: x.name }; });
    if (best) return best.n + " +" + c.fx[best.k];
    if (c.g) return "성적 +" + c.g;
    if (c.en) return "체력 +" + c.en;
    return "";
  }

  /* ───── 상태 ───── */
  var KEY = "yd_game_v2", st, root, busy = false;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function fresh(name) {
    var o = { name: name || "", color: COLORS[0].c, pos: "gate", p: 0, st: {}, en: 8, sr: 20, minEn: 8, skill: {}, talent: {}, plan: { ko: 0, ma: 0, en: 0, ta: 0, rest: 0 }, acts: [], hand: [], log: [], exams: [], track: null, club: [null, null, null], jclub: [null, null, null], done: false };
    STATS.forEach(function (x) { o.st[x.k] = 1; });
    SUBJ.forEach(function (s) { o.talent[s.k] = Math.round(rnd(0.85, 1.2) * 100) / 100; o.skill[s.k] = Math.round(rnd(17, 27)); });
    return o;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function load() { try { return fixState(JSON.parse(localStorage.getItem(KEY) || "null")); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function deal() {
    var j = myJClub();
    st.hand = (j ? [j] : []).concat(shuffle(CARDS.filter(function (c) { return (c.from || 0) <= st.p; })).slice(0, j ? 4 : 5).map(function (c) { return c.id; }));
    st.acts = [];
  }
  function fixState(o) {
    if (!o) return o;
    if (!o.club) o.club = [null, null, null];
    if (!o.jclub) o.jclub = [null, null, null];
    o.hand = (o.hand || []).filter(function (id) { return card(id); });
    o.acts = (o.acts || []).filter(function (id) { return o.hand.indexOf(id) >= 0; });
    return o;
  }
  function used() { return st.plan.ko + st.plan.ma + st.plan.en + st.plan.ta + st.plan.rest + st.acts.length * 2; }
  function fxText(o) {
    var p = [];
    STATS.forEach(function (x) { if (o.fx && o.fx[x.k]) p.push(x.name + " +" + o.fx[x.k]); });
    if (o.sub) SUBJ.forEach(function (s) { if (o.sub[s.k]) p.push(subjName(s).split(" ")[0] + " 실력 +" + o.sub[s.k]); });
    if (o.skill) p.push("모든 과목 실력 +" + o.skill);
    if (o.en) p.push("체력 " + (o.en > 0 ? "+" : "") + o.en);
    if (o.sr) p.push("스트레스 " + (o.sr > 0 ? "+" : "") + o.sr);
    return p.join(" · ") || "변화 없음";
  }

  /* ───── 시험 계산 ───── */
  function erf(x) { var t = 1 / (1 + 0.3275911 * Math.abs(x)); var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; }
  function topPct(score, p) { var mu = 62 + p * 0.8, sd = 14; var z = (score - mu) / sd; return 1 - 0.5 * (1 + erf(z / Math.SQRT2)); } // 나보다 잘한 비율
  function gradeOf(pct) { return pct <= 0.10 ? 1 : pct <= 0.34 ? 2 : pct <= 0.66 ? 3 : pct <= 0.90 ? 4 : 5; }
  function efficiency() { return clamp(0.55 + 0.45 * (st.en / 10) - 0.4 * Math.max(0, (st.sr - 60) / 40), 0.3, 1.1); }
  function condText() {
    var e = efficiency();
    return e >= 0.95 ? "컨디션 최고" : e >= 0.8 ? "컨디션 좋음" : e >= 0.6 ? "조금 지침" : "많이 지침";
  }
  function avgGrade(ex) { return Math.round(ex.subj.reduce(function (a, s) { return a + s.grade; }, 0) / ex.subj.length * 10) / 10; }

  function simulate() {
    var eff = efficiency(), studySlots = 0, prev = st.exams[st.exams.length - 1];
    SUBJ.forEach(function (s) {
      var n = st.plan[s.k]; studySlots += n;
      if (n > 0) st.skill[s.k] += n * 2 * 0.85 * st.talent[s.k] * eff; else st.skill[s.k] -= 2.5;
    });
    st.acts.forEach(function (id) {
      var c = card(id);
      Object.keys(c.fx || {}).forEach(function (k) { st.st[k] += c.fx[k]; });
      Object.keys(c.sub || {}).forEach(function (k) { st.skill[k] += c.sub[k]; });
      st.en += c.en || 0; st.log.push(id);
    });
    var mc = myClub();
    if (mc) {
      Object.keys(mc.fx || {}).forEach(function (k) { st.st[k] += mc.fx[k]; });
      Object.keys(mc.sub || {}).forEach(function (k) { st.skill[k] += mc.sub[k]; });
      st.en += mc.en || 0; st.log.push(mc.id);
    }
    st.sr += studySlots * 4 + st.acts.length - st.plan.rest * 10 - 4;
    st.en += -studySlots * 0.45 + st.plan.rest * 1.0 + 1;
    st.sr = clamp(Math.round(st.sr), 0, 100); st.en = clamp(Math.round(st.en * 10) / 10, 0, 10);
    st.minEn = Math.min(st.minEn, st.en);
    SUBJ.forEach(function (s) { st.skill[s.k] = clamp(Math.round(st.skill[s.k] * 10) / 10, 0, 80); });
    // 시험
    var cond = (st.en < 3 ? -6 : 0) + (st.sr > 75 ? -8 : st.sr > 60 ? -3 : 0);
    var ex = { p: st.p, label: periodLabel(st.p), subj: [] };
    SUBJ.forEach(function (s, i) {
      var score = clamp(Math.round(34 + st.skill[s.k] * 1.15 + cond + rnd(-6, 6)), 0, 100);
      var pct = topPct(score, st.p);
      var ps = prev && prev.subj[i];
      ex.subj.push({ k: s.k, name: subjName(s), h: st.plan[s.k] * 2, score: score, grade: gradeOf(pct), rank: clamp(1 + Math.floor(pct * (CLASS - 1)), 1, CLASS), prev: ps ? ps.score : null });
    });
    ex.avg = avgGrade(ex);
    st.exams.push(ex);
    return ex;
  }

  /* ───── 화면: 상단 정보판 ───── */
  function hud() {
    var max = Math.max.apply(null, STATS.map(function (x) { return st.st[x.k]; }).concat([8]));
    var last = st.exams[st.exams.length - 1];
    var cells = []; for (var i = 0; i < PERIODS; i++) cells.push('<li class="' + (i < st.p ? "g-done" : i === st.p ? "now" : "") + '" title="' + periodLabel(i) + '"><span>' + (Math.floor(i / 4) + 1) + "-" + (Math.floor(i / 2) % 2 + 1) + (i % 2 ? " 기말" : " 중간") + "</span></li>");
    return '<div class="g-hud"><ol class="g-sems g-12" aria-label="진행">' + cells.join("") + "</ol>" +
      '<div class="g-meters"><div class="g-meter"><span>체력</span><i style="--v:' + st.en * 10 + '%" class="m-en"></i><b>' + Math.round(st.en) + '/10</b></div>' +
      '<div class="g-meter"><span>스트레스</span><i style="--v:' + st.sr + '%" class="m-sr"></i><b>' + st.sr + "</b></div>" +
      '<div class="g-meter g-last"><span>지난 시험</span><b>' + (last ? "평균 " + last.avg.toFixed(1) + "등급" : "아직 없음") + "</b></div></div>" +
      '<div class="g-stats">' + STATS.map(function (x) { return '<div class="g-stat"><span>' + x.name + '</span><i style="--v:' + Math.round(st.st[x.k] / max * 100) + "%;--c:" + x.c + '"></i><b>' + st.st[x.k] + "</b></div>"; }).join("") + "</div></div>";
  }

  /* ───── 화면: 시간표 짜기 ───── */
  function render() {
    if (busy) return;
    if (!st || !st.name) return renderStart();
    if (st.done) return renderEnd();
    if (st.p === 4 && !st.track) return renderTrack();
    if (!st.club[yearOf(st.p)]) return renderClub();
    if (!st.hand.length) { deal(); save(); }
    var left = SLOTS - used();
    var rows = SUBJ.map(function (s) {
      var n = st.plan[s.k], lv = Math.round(st.skill[s.k]);
      return '<div class="pl-row"><span class="pl-e" aria-hidden="true">' + s.e + '</span><div class="pl-name"><b>' + esc(subjName(s)) + '</b><span class="pl-skill"><i style="--v:' + Math.round(lv / 80 * 100) + '%"></i>실력 ' + lv + "</span></div>" +
        '<div class="pl-step"><button type="button" data-k="' + s.k + '" data-d="-1" aria-label="' + esc(subjName(s)) + ' 줄이기"' + (n ? "" : " disabled") + '>−</button><output aria-live="polite">' + n * 2 + '시간</output><button type="button" data-k="' + s.k + '" data-d="1" aria-label="' + esc(subjName(s)) + ' 늘리기"' + (left > 0 ? "" : " disabled") + ">+</button></div></div>";
    }).join("");
    var rest = '<div class="pl-row pl-rest"><span class="pl-e" aria-hidden="true">👣</span><div class="pl-name"><b>쉬기 · 맨발 트랙 산책</b><span class="pl-skill pl-note">체력을 채우고 스트레스를 풀어요</span></div><div class="pl-step"><button type="button" data-k="rest" data-d="-1" aria-label="쉬는 시간 줄이기"' + (st.plan.rest ? "" : " disabled") + '>−</button><output>' + st.plan.rest * 2 + '시간</output><button type="button" data-k="rest" data-d="1" aria-label="쉬는 시간 늘리기"' + (left > 0 ? "" : " disabled") + ">+</button></div></div>";
    var cards = st.hand.map(function (id) {
      var c = card(id), on = st.acts.indexOf(id) >= 0, dis = !on && (left < 2 || st.acts.length >= 2);
      return '<button class="g-card' + (on ? " on" : "") + (id.indexOf("j_") === 0 ? " g-jclub" : "") + '" data-id="' + id + '"' + (dis ? " disabled" : "") + ' aria-pressed="' + on + '"><span class="g-e" aria-hidden="true">' + c.e + "</span><b>" + esc(c.n) + '</b><span class="g-p">' + esc(c.p) + ' · 4시간</span><span class="g-fx">' + fxText(c) + "</span></button>";
    }).join("");
    root.innerHTML = hud() + mapHTML() +
      '<section class="g-play"><h2>' + periodLabel(st.p) + '까지<small>방과후·자습 시간 20시간을 나눠 쓰세요. 남은 시간 <b>' + left * 2 + "시간</b> · " + condText() + "</small></h2>" +
      (st.en <= 2.5 ? '<p class="g-warn">체력이 바닥이에요. 이대로면 시험 때 실수가 많아져요. 쉬는 시간을 넣어 보세요.</p>' : st.sr >= 70 ? '<p class="g-warn">스트레스가 너무 높아요. 공부 효율이 떨어지고 있어요.</p>' : "") +
      '<div class="pl-grid"><div class="pl-box"><h3>공부 시간표</h3>' + rows + rest + '<p class="pl-hint">한 번도 공부하지 않은 과목은 실력이 조금씩 떨어져요.</p></div>' +
      '<div class="pl-box"><h3>동아리 · 활동</h3>' + clubLine() + '<p class="pl-sub">방과후 활동 <small>최대 2개 · 하나에 4시간</small></p><div class="g-cards g-cards-sm">' + cards + "</div></div></div>" +
      '<div class="g-actions"><button class="btn btn-primary" id="gNext"' + (used() ? "" : " disabled") + '>이 계획으로 보내고 시험 보기</button><button class="btn btn-ghost btn-small" id="gAuto">계획 비우기</button><button class="btn btn-ghost btn-small" id="gReset">처음부터</button></div></section>';
    root.querySelectorAll(".pl-step button").forEach(function (b) {
      b.onclick = function () { var k = b.dataset.k, d = +b.dataset.d; if (d > 0 && SLOTS - used() <= 0) return; st.plan[k] = clamp(st.plan[k] + d, 0, SLOTS); save(); render(); var nb = root.querySelector('.pl-step button[data-k="' + k + '"][data-d="' + d + '"]'); if (nb && !nb.disabled) nb.focus(); };
    });
    root.querySelectorAll(".g-card").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.id, i = st.acts.indexOf(id);
        if (i >= 0) st.acts.splice(i, 1); else st.acts.push(id);
        save(); render();
        if (i < 0) moveTo(locOf(id), card(id).e + " " + card(id).n, "");
      };
    });
    root.querySelector("#gNext").onclick = runPeriod;
    root.querySelector("#gAuto").onclick = function () { st.plan = { ko: 0, ma: 0, en: 0, ta: 0, rest: 0 }; st.acts = []; save(); render(); };
    root.querySelector("#gReset").onclick = function () { var c = st.color; st = fresh(st.name); st.color = c; deal(); save(); render(); };
  }

  function clubLine() {
    var c = myClub(); if (!c) return "";
    return '<div class="pl-club"><span class="pl-e" aria-hidden="true">' + c.e + '</span><div><b>' + esc(c.n) + ' <em>정규 동아리</em></b><span>창체 동아리 시간에 자동으로 활동해요 (방과후 시간 안 씀) · ' + fxText(c) + "</span></div></div>";
  }
  function runPeriod() {
    busy = true;
    root.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    var mc = myClub(); if (mc) moveTo(mc.at, mc.e + " 동아리 시간: " + mc.n, popText(mc));
    SUBJ.forEach(function (s) { if (st.plan[s.k]) moveTo(s.where, s.e + " " + subjName(s).split(" ")[0] + " " + st.plan[s.k] * 2 + "시간", ""); });
    st.acts.forEach(function (id) { var c = card(id); moveTo(locOf(id), c.e + " " + c.n, popText(c)); });
    if (st.plan.rest) moveTo("track", "👣 푹 쉬기 " + st.plan.rest * 2 + "시간", "");
    moveTo("classroom", "📝 " + (st.p % 2 ? "기말고사" : "중간고사") + "!", "");
    walkQ.then(function () { return new Promise(function (r) { setTimeout(r, 400); }); }).then(function () {
      var ex = simulate(); save();
      showReport(ex);
    });
  }

  function comment(ex) {
    var prev = st.exams[st.exams.length - 2];
    var low = ex.subj.slice().sort(function (a, b) { return b.grade - a.grade; })[0];
    if (st.en < 3) return "체력이 바닥난 채로 시험을 봤어요. 다음에는 쉬는 시간도 계획에 넣어 보세요.";
    if (st.sr > 75) return "스트레스가 너무 높아 실력을 다 못 보여 줬어요. 쉬기와 활동으로 숨을 돌려 보세요.";
    if (prev && ex.avg <= prev.avg - 0.7) return "지난 시험보다 크게 올랐어요! 지금 공부 방법이 잘 맞고 있어요.";
    if (prev && ex.avg >= prev.avg + 0.7) return "지난 시험보다 내려갔어요. " + low.name + " 공부 시간을 늘려 보면 어떨까요?";
    if (ex.avg <= 1.8) return "최상위권 성적이에요. 이제 활동으로 진로 이야기를 채워 볼까요?";
    if (low.grade >= 4) return low.name + "이(가) 약점이에요. 다음 기간에는 이 과목에 시간을 더 써 보세요.";
    return "꾸준히 하고 있어요. 공부와 활동, 휴식의 균형을 잘 맞춰 보세요.";
  }
  function showReport(ex) {
    var bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = '<div class="modal g-ev g-report" role="dialog" aria-modal="true" aria-labelledby="rpT"><p class="g-ev-k">' + esc(st.name) + ' 학생 성적표</p><h2 id="rpT">' + esc(ex.label) + "</h2>" +
      '<table class="rp"><thead><tr><th>과목</th><th>공부</th><th>점수</th><th>등급</th><th>석차</th></tr></thead><tbody>' + ex.subj.map(function (s) {
        var d = s.prev == null ? "" : s.score > s.prev ? '<em class="up">▲' + (s.score - s.prev) + "</em>" : s.score < s.prev ? '<em class="dn">▼' + (s.prev - s.score) + "</em>" : '<em>-</em>';
        return "<tr><td>" + esc(s.name) + "</td><td>" + s.h + "시간</td><td><b>" + s.score + "</b> " + d + '</td><td><span class="gr gr' + s.grade + '">' + s.grade + "등급</span></td><td>" + s.rank + "/" + CLASS + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<p class="rp-avg">평균 <b>' + ex.avg.toFixed(1) + '등급</b> · 체력 ' + Math.round(st.en) + " · 스트레스 " + st.sr + '</p><p class="rp-c">💬 ' + esc(comment(ex)) + '</p><div class="g-ev-a"><button class="btn btn-primary" id="rpOk">확인</button></div></div>';
    document.body.appendChild(bg);
    var ok = bg.querySelector("#rpOk"); ok.focus();
    ok.onclick = function () { bg.remove(); afterExam(); };
  }
  function afterExam() {
    st.plan = { ko: 0, ma: 0, en: 0, ta: 0, rest: 0 }; st.acts = []; st.hand = [];
    st.p++;
    if (st.p >= PERIODS) { st.done = true; busy = false; save(); render(); return; }
    if (Math.random() < 0.6) { var ev = EVENTS[Math.floor(Math.random() * EVENTS.length)]; showEvent(ev); }
    else { busy = false; save(); render(); }
  }
  function showEvent(ev) {
    var bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = '<div class="modal g-ev" role="dialog" aria-modal="true" aria-labelledby="evT"><p class="g-ev-k">학교생활 이야기</p><h2 id="evT">' + esc(ev.t) + '</h2><div class="g-ev-a">' +
      ev.a.map(function (a, i) { return '<button class="btn ' + (i ? "btn-ghost" : "btn-primary") + '" data-i="' + i + '">' + esc(a.n) + "<small>" + fxText(a) + "</small></button>"; }).join("") + "</div></div>";
    document.body.appendChild(bg);
    bg.querySelectorAll("[data-i]").forEach(function (b) {
      b.onclick = function () {
        var a = ev.a[+b.dataset.i];
        Object.keys(a.fx || {}).forEach(function (k) { st.st[k] += a.fx[k]; });
        if (a.skill) SUBJ.forEach(function (s) { st.skill[s.k] = clamp(st.skill[s.k] + a.skill, 0, 80); });
        st.en = clamp(st.en + (a.en || 0), 0, 10); st.sr = clamp(st.sr + (a.sr || 0), 0, 100);
        busy = false; save(); bg.remove(); render(); window.scrollTo({ top: root.offsetTop - 70, behavior: "smooth" });
      };
    });
    bg.querySelector("[data-i]").focus();
  }

  /* ───── 화면: 시작 · 과목 선택 ───── */
  function renderStart() {
    var id = null; try { id = JSON.parse(sessionStorage.getItem("yd_id") || "null"); } catch (e) {}
    var saved = load();
    root.innerHTML = '<section class="g-start"><div class="g-start-art" aria-hidden="true"><div class="g-start-ch">' + charSVG(COLORS[0].c) + "</div>" + SEM.map(function (s, i) { return '<span style="--i:' + i + '">' + s + "</span>"; }).join("") + "</div>" +
      '<div><h2>예당고 3년, 미리 살아 보기</h2><p>2027년 3월, 예당고에 입학했어요. 시험 기간마다 방과후·자습 20시간을 공부, 동아리, 휴식에 어떻게 나눌지 정해 보세요. 공부한 만큼 시험 점수와 등급이 나오고, 활동이 쌓여 졸업할 때 나에게 맞는 진로가 나타나요.</p>' +
      '<ul class="g-rules"><li>3년 동안 시험 12번(학기마다 중간·기말). 54명 중 석차와 5등급제 등급이 나와요.</li><li>공부를 많이 하면 실력이 오르지만 체력이 줄고 스트레스가 쌓여요.</li><li>지치면 공부 효율도 시험 점수도 떨어져요. 쉬는 것도 실력이에요.</li><li>학년마다 예당고 실제 동아리 중 하나를 골라 활동해요.</li></ul>' +
      '<div class="g-prize"><b>끝까지 졸업하면 상품이 있어요!</b><span>완주 기념품을 드리고, 응모한 학생 중 추첨해 문화상품권도 드려요.</span></div>' +
      '<form id="gStart" class="g-form"><fieldset class="g-colors"><legend>내 캐릭터 고르기</legend><div class="g-color-row">' + COLORS.map(function (c, i) { return '<label class="g-color"><input type="radio" name="gColor" value="' + c.c + '"' + (i === 0 ? " checked" : "") + '><span class="g-color-ch">' + charSVG(c.c) + "</span><em>" + c.n + "</em></label>"; }).join("") + '</div></fieldset><label for="gName">이름</label>' +
      '<div class="g-row"><input id="gName" maxlength="12" placeholder="이름 또는 별명" value="' + esc((id && id.name) || "") + '"><button class="btn btn-primary" type="submit">입학하기</button></div></form>' +
      (saved && saved.name && !saved.done ? '<button class="btn btn-ghost btn-small" id="gCont">' + esc(saved.name) + " 학생, " + periodLabel(saved.p) + "부터 이어 하기</button>" : "") + "</div></section>";
    root.querySelector("#gStart").onsubmit = function (e) {
      e.preventDefault();
      var n = root.querySelector("#gName").value.trim() || "예당이"; st = fresh(n);
      var col = root.querySelector('input[name="gColor"]:checked'); if (col) st.color = col.value;
      deal(); save(); render();
      setTimeout(function () { moveTo("classroom", "입학 첫날! 첫 시험까지 계획을 세워 볼까?", ""); }, 300);
    };
    var c = root.querySelector("#gCont"); if (c) c.onclick = function () { st = fixState(saved); render(); };
  }
  function renderClub() {
    var y = yearOf(st.p), prev = y ? st.club[y - 1] : null, prevJ = y ? st.jclub[y - 1] : null;
    var pick = prev, pickJ = prevJ;
    function clubBtn(c, kind, on) {
      return '<button type="button" class="g-card g-club' + (on ? " on" : "") + '" data-kind="' + kind + '" data-k="' + c.k + '" aria-pressed="' + on + '"><span class="g-e" aria-hidden="true">' + c.e + "</span><b>" + esc(c.n) + '</b><span class="g-p">' + esc(clubDesc(c.k)) + '</span><span class="g-fx">' + fxText(c) + "</span></button>";
    }
    function draw() {
      root.innerHTML = hud() + '<section class="g-play"><h2>' + (y + 1) + '학년 동아리 고르기<small>예당고에 실제로 있는 동아리예요. ' + (y ? "작년 동아리를 이어 가도 되고, 새로 골라도 돼요." : "정규 동아리 하나는 꼭 골라야 해요.") + "</small></h2>" +
        '<h3 class="g-h3">정규 동아리 <small>하나 고르기 · 창체 시간에 매 기간 활동</small></h3><div class="g-cards g-clubs">' + CLUB.map(function (c) { return clubBtn(c, "c", pick === c.k); }).join("") + "</div>" +
        '<h3 class="g-h3">자율동아리 <small>선택 · 가입하면 방과후 활동 목록에 늘 나와요</small></h3><div class="g-cards g-clubs">' + JCLUB.map(function (c) { return clubBtn(c, "j", pickJ === c.k); }).join("") +
        '<button type="button" class="g-card g-club' + (pickJ ? "" : " on") + '" data-kind="j" data-k="" aria-pressed="' + !pickJ + '"><span class="g-e" aria-hidden="true">🙅</span><b>가입하지 않기</b><span class="g-p">방과후 시간을 공부와 다른 활동에 써요.</span></button></div>' +
        '<div class="g-actions"><button class="btn btn-primary" id="gClubOk"' + (pick ? "" : " disabled") + ">" + (pick ? esc(CLUB.find(function (c) { return c.k === pick; }).n) + "(으)로 " + (y + 1) + "학년 시작" : "정규 동아리를 골라 주세요") + "</button></div></section>";
      root.querySelectorAll(".g-club").forEach(function (b) {
        b.onclick = function () { if (b.dataset.kind === "c") pick = b.dataset.k; else pickJ = b.dataset.k || null; draw(); var nb = root.querySelector('.g-club[data-kind="' + b.dataset.kind + '"][data-k="' + b.dataset.k + '"]'); if (nb) nb.focus(); };
      });
      root.querySelector("#gClubOk").onclick = function () {
        st.club[y] = pick; st.jclub[y] = pickJ; st.hand = []; deal(); save(); render();
        var c = card("c_" + pick); setTimeout(function () { moveTo(c.at, c.e + " " + c.n + " 동아리에 들어왔어!", ""); }, 300);
      };
    }
    draw();
  }
  function renderTrack() {
    root.innerHTML = hud() + '<section class="g-play"><h2>2학년 과목 선택<small>고교학점제! 2학년부터는 듣고 싶은 과목을 직접 골라요. 고른 과목이 시험 과목이 됩니다.</small></h2><div class="g-cards">' +
      TRACKS.map(function (t, i) { return '<button class="g-card" data-i="' + i + '"><span class="g-e" aria-hidden="true">🗂️</span><b>' + esc(t.n) + '</b><span class="g-p">' + esc(t.d) + '</span><span class="g-fx">' + fxText({ fx: t.fx }) + " · 관련 과목 적성 조금 상승</span></button>"; }).join("") + "</div></section>";
    root.querySelectorAll(".g-card").forEach(function (b) {
      b.onclick = function () {
        var t = TRACKS[+b.dataset.i]; st.track = t.n;
        Object.keys(t.fx).forEach(function (k) { st.st[k] += t.fx[k]; });
        Object.keys(t.talent).forEach(function (k) { st.talent[k] = Math.round((st.talent[k] + t.talent[k]) * 100) / 100; });
        deal(); save(); render();
      };
    });
  }

  /* ───── 화면: 졸업 ───── */
  function match() {
    var v = STATS.map(function (x) { return st.st[x.k]; });
    var mean = v.reduce(function (a, b) { return a + b; }, 0) / 6;
    var vc = v.map(function (x) { return x - mean; });
    return window.YD.FIELDS.map(function (f) {
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
    return '<svg viewBox="0 0 300 290" role="img" aria-label="진로 능력치 그래프">' + grid + poly + labels + "</svg>";
  }
  function gradeChart() {
    var ex = st.exams, W = 600, H = 220, L = 46, R = 14, T = 16, B = 34;
    if (!ex.length) return "";
    function x(i) { return L + (W - L - R) * (ex.length === 1 ? 0.5 : i / (ex.length - 1)); }
    function y(g) { return T + (H - T - B) * (g - 1) / 4; }
    var grid = [1, 2, 3, 4, 5].map(function (g) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="#DFE6DE"/><text x="' + (L - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" font-size="12" fill="#5A665E">' + g + "등급</text>"; }).join("");
    var pts = ex.map(function (e, i) { return x(i) + "," + y(e.avg); }).join(" ");
    var dots = ex.map(function (e, i) { return '<circle cx="' + x(i) + '" cy="' + y(e.avg) + '" r="4.5" fill="#143A2B"><title>' + e.label + " 평균 " + e.avg.toFixed(1) + "등급</title></circle>"; }).join("");
    var xl = ex.map(function (e, i) { return i % 2 ? "" : '<text x="' + x(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11.5" fill="#5A665E">' + (Math.floor(i / 4) + 1) + "-" + (Math.floor(i / 2) % 2 + 1) + "</text>"; }).join("");
    return '<svg class="g-chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="시험별 평균 등급 그래프">' + grid + '<polyline points="' + pts + '" fill="none" stroke="#2C7350" stroke-width="3" stroke-linejoin="round"/>' + dots + xl + "</svg>";
  }
  var BADGES = [
    { n: "전교 1등", d: "한 과목이라도 석차 1등", test: function () { return st.exams.some(function (e) { return e.subj.some(function (s) { return s.rank === 1; }); }); } },
    { n: "꾸준한 공부", d: "모든 시험 평균 3등급 이내", test: function () { return st.exams.length && st.exams.every(function (e) { return e.avg <= 3; }); } },
    { n: "역전의 명수", d: "첫 시험보다 평균 1.5등급 이상 상승", test: function () { var a = st.exams[0], b = Math.min.apply(null, st.exams.map(function (e) { return e.avg; })); return a && a.avg - b >= 1.5; } },
    { n: "건강 지킴이", d: "3년 내내 체력 4 이상 유지", test: function () { return st.minEn >= 4; } },
    { n: "책벌레", d: "독서 활동 3번", test: function () { return cnt(["lib", "write", "c_dadok", "c_bookbang"]) >= 3; } },
    { n: "AI 개척자", d: "AI 활동 3번", test: function () { return cnt(["vibe", "indie", "yunghap", "c_aimidia", "j_aiclub", "j_aikkum", "j_robit"]) >= 3; } },
    { n: "밤샘 연구자", d: "1인 1탐구·R&E·소논문 2번", test: function () { return cnt(["rne", "onetamgu", "ee"]) >= 2; } },
    { n: "따뜻한 마음", d: "봉사·멘토링·캠페인 4번", test: function () { return cnt(["donghaeng", "nanum", "c_gyohak", "c_nightingale", "j_maeum"]) >= 4; } },
    { n: "동아리 한 우물", d: "3년 내내 같은 정규 동아리", test: function () { return st.club && st.club[0] && st.club[0] === st.club[1] && st.club[1] === st.club[2]; } },
    { n: "반도체 꿈나무", d: "미니 팹 실습 2번", test: function () { return cnt(["fab"]) >= 2; } }
  ];
  function cnt(ids) { return st.log.filter(function (l) { return ids.indexOf(l) >= 0; }).length; }
  function renderEnd() {
    var m = match(), best = m[0].f, alts = [m[1].f, m[2].f];
    var acts = []; st.log.forEach(function (id) { var c = card(id); if (c && c.tag && acts.indexOf(c.tag) < 0) acts.push(c.tag); });
    var badges = BADGES.filter(function (b) { return b.test(); });
    var clubHist = (st.club || []).map(function (k, i) { var c = card("c_" + k), j = st.jclub && st.jclub[i] ? card("j_" + st.jclub[i]) : null; return c ? (i + 1) + "학년 " + c.n + (j ? " · 자율 " + j.n.replace(" (자율)", "") : "") : ""; }).filter(Boolean).join(" / ");
    var top2 = STATS.slice().sort(function (a, b) { return st.st[b.k] - st.st[a.k]; }).slice(0, 2);
    var all = st.exams.length ? Math.round(st.exams.reduce(function (a, e) { return a + e.avg; }, 0) / st.exams.length * 10) / 10 : 0;
    var bestRank = Math.min.apply(null, st.exams.map(function (e) { return Math.min.apply(null, e.subj.map(function (s) { return s.rank; })); }));
    try { localStorage.setItem("yd_game_last", JSON.stringify({ name: st.name, field: best.id, avg: all, at: Date.now() })); } catch (e) {}
    root.innerHTML = '<section class="g-end"><div class="g-end-head"><div><p class="g-ev-k">' + esc(st.name) + ' 학생의 예당고 3년</p><h2>졸업을 축하해요!</h2><p>3년 내신 평균 <b style="color:#C9EA6A">' + all.toFixed(1) + "등급</b>, 최고 석차 " + bestRank + "등. " + esc(top2[0].name) + "과 " + esc(top2[1].name) + " 능력이 가장 많이 자랐어요. 이 모양과 가장 닮은 진로는</p>" +
      '<div class="g-best"><span aria-hidden="true">' + best.emoji + "</span><b>" + esc(best.name) + '</b></div><p class="g-sub">' + esc(best.tagline) + "</p>" +
      '<div class="g-end-btns"><a class="btn btn-sprout" href="#/f/' + best.id + '/1">이 진로 로드맵 보기</a><a class="btn btn-ghost g-light" href="#/booking?f=' + best.id + '">이 결과로 상담 신청</a></div></div>' +
      '<div class="g-radar"><div class="g-end-ch">' + charSVG(st.color || COLORS[0].c) + "</div>" + radar() + "</div></div>" +
      '<div class="g-end-chart"><h3>시험별 평균 등급</h3>' + gradeChart() + "</div>" +
      '<div class="g-end-body"><div><h3>이런 진로도 어울려요</h3><ul class="g-alts">' + alts.map(function (f) { return '<li><a href="#/f/' + f.id + '/1">' + f.emoji + " " + esc(f.name) + "</a></li>"; }).join("") + "</ul>" +
      "<h3>얻은 배지</h3>" + (badges.length ? '<ul class="g-badges">' + badges.map(function (b) { return "<li><b>" + esc(b.n) + "</b><span>" + esc(b.d) + "</span></li>"; }).join("") + "</ul>" : '<p class="g-muted">이번엔 배지가 없어요. 다른 계획으로 다시 도전해 보세요.</p>') +
      '<p class="g-muted">2학년 과목: ' + esc(st.track || "-") + "</p></div>" +
      '<div><h3>내 생활기록부에 남을 이야기</h3>' + (clubHist ? '<p class="g-clubhist">🏷️ 동아리 ' + esc(clubHist) + "</p>" : "") + (acts.length ? '<ul class="ul">' + acts.slice(-8).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : '<p class="g-muted">동아리·활동을 하지 않아 기록할 이야기가 없어요. 대학은 성적과 함께 활동 이야기도 봐요!</p>') + "</div></div>" +
      prizeHTML(best) +
      '<div class="g-actions"><button class="btn btn-primary" id="gAgain">다른 3년 살아 보기</button><button class="btn btn-ghost" id="gShare">결과 저장</button></div>' +
      '<p class="src">게임 결과는 재미로 보는 참고용이에요. 진짜 성적과 진로는 직접 공부하고 활동해 보며 만들어 가는 거예요.</p></section>';
    bindPrize(best);
    root.querySelector("#gAgain").onclick = function () { var c = st.color; st = fresh(st.name); st.color = c; deal(); save(); render(); window.scrollTo(0, 0); };
    root.querySelector("#gShare").onclick = function () {
      var t = ["예당고 3년 미리 살기 결과", "이름: " + st.name, "3년 내신 평균: " + all.toFixed(1) + "등급", "추천 진로: " + best.name, "어울리는 진로: " + alts.map(function (f) { return f.name; }).join(", "), "진로 능력치: " + STATS.map(function (x) { return x.name + " " + st.st[x.k]; }).join(", "), "배지: " + (badges.map(function (b) { return b.n; }).join(", ") || "-"), "", "시험 결과:"]
        .concat(st.exams.map(function (e) { return "- " + e.label + ": 평균 " + e.avg.toFixed(1) + "등급 (" + e.subj.map(function (s) { return s.name + " " + s.score + "점 " + s.grade + "등급"; }).join(", ") + ")"; }))
        .concat(clubHist ? ["", "동아리: " + clubHist] : []).concat(["", "생활기록부 이야기:"]).concat(acts.map(function (a) { return "- " + a; })).join("\n");
      var blob = new Blob([t], { type: "text/plain;charset=utf-8" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "예당고_3년미리살기_" + st.name + ".txt"; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 200);
    };
  }

  /* ───── 완주 상품 ───── */
  function prizeHTML(best) {
    var id = null; try { id = JSON.parse(sessionStorage.getItem("yd_id") || "null"); } catch (e) {}
    var done = null; try { done = JSON.parse(localStorage.getItem("yd_raffle_done") || "null"); } catch (e) {}
    var d = new Date(), date = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
    return '<section class="g-prize-end"><div class="g-cert"><p class="g-cert-k">예당고 3년 미리 살기</p><h3>졸업장</h3><p class="g-cert-n">' + esc(st.name) + '</p><p>위 학생은 예당고등학교 6학기를 끝까지 마치고<br>' + esc(best.name) + ' 진로를 발견했기에 이 졸업장을 드립니다.</p><p class="g-cert-d">' + date + ' · 예당고등학교</p></div>' +
      '<div class="g-prize-box"><h3>졸업 축하 상품</h3><ol class="g-prize-steps"><li><b>완주 기념품</b> 이 졸업장 화면을 신입생 설명회나 개인 상담 때 선생님께 보여 주면 기념품을 드려요.</li><li><b>문화상품권 추첨</b> 아래에서 응모하면 추첨을 통해 문화상품권을 드려요. 당첨되면 적어 준 번호로 연락드려요.</li></ol>' +
      (done ? '<p class="g-raffle-ok">' + esc(done.name) + ' 학생, 추첨 응모가 완료됐어요. 다시 응모하면 최신 정보로 바뀌어요.</p>' : "") +
      '<form class="g-raffle" id="gRaffle" novalidate><div class="g-row2"><div class="f"><label for="rfName">이름</label><input id="rfName" maxlength="20" value="' + esc((id && id.name) || st.name) + '"></div><div class="f"><label for="rfSchool">중학교</label><input id="rfSchool" maxlength="30" value="' + esc((id && id.school) || "") + '"></div></div>' +
      '<div class="f"><label for="rfPhone">휴대폰 번호 (당첨 연락용)</label><input id="rfPhone" inputmode="tel" maxlength="20" placeholder="010-0000-0000" value="' + esc((id && id.phone) || "") + '"></div>' +
      '<input class="hp" tabindex="-1" autocomplete="off" id="rfWeb" aria-hidden="true">' +
      '<label class="g-agree"><input type="checkbox" id="rfAgree"> 경품 추첨과 당첨 연락을 위해 이름·학교·휴대폰 번호를 모으는 데 동의해요. (추첨·지급 후 2027년 3월 말까지 파기)</label>' +
      '<div class="g-actions" style="margin-top:10px"><button class="btn btn-sprout" type="submit">' + (done ? "다시 응모하기" : "추첨 응모하기") + '</button><span class="err" id="rfErr" role="alert"></span></div></form></div></section>';
  }
  function bindPrize(best) {
    var f = root.querySelector("#gRaffle"); if (!f) return;
    f.onsubmit = function (e) {
      e.preventDefault();
      var err = root.querySelector("#rfErr"); err.textContent = "";
      var body = { name: root.querySelector("#rfName").value.trim(), school: root.querySelector("#rfSchool").value.trim(), phone: root.querySelector("#rfPhone").value.trim(), field: best.name, agree: root.querySelector("#rfAgree").checked, website: root.querySelector("#rfWeb").value };
      if (!body.name || !body.school) { err.textContent = "이름과 중학교를 적어 주세요."; return; }
      if (body.phone.replace(/\D/g, "").length < 10) { err.textContent = "휴대폰 번호를 적어 주세요."; return; }
      if (!body.agree) { err.textContent = "동의에 체크해 주세요."; return; }
      var btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "응모하는 중…";
      fetch("/api/raffle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) { err.textContent = res.d.error || "응모하지 못했어요."; btn.disabled = false; btn.textContent = "추첨 응모하기"; return; }
          try { localStorage.setItem("yd_raffle_done", JSON.stringify({ name: body.name, at: Date.now() })); } catch (e2) {}
          f.outerHTML = '<p class="g-raffle-ok" role="status">' + esc(body.name) + " 학생, 추첨 응모가 완료됐어요! 당첨되면 " + esc(body.phone) + "(으)로 연락드릴게요.</p>";
        })
        .catch(function () { err.textContent = "인터넷 연결을 확인하고 다시 시도해 주세요."; btn.disabled = false; btn.textContent = "추첨 응모하기"; });
    };
  }

  window.YD.game = {
    charSVG: charSVG,
    mount: function (el) { root = el; busy = false; st = load(); if (st && st.done) st = null; render(); }
  };
})();
