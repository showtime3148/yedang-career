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
  var KEY = "yd_game_v1", st;
  function fresh(name) { var o = { name: name || "", color: COLORS[0].c, pos: "gate", sem: 0, st: {}, g: 50, en: 8, log: [], track: null, picked: [], hand: [], done: false, events: [] }; STATS.forEach(function (x) { o.st[x.k] = 1; }); return o; }
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
      mapHTML() + '<section class="g-play"><h2>' + SEM[st.sem] + '<small>이번 학기에 할 일을 골라 주세요. 시간 칸 <b>' + left + "</b>개 남음</small></h2>" +
      (st.en <= 2 ? '<p class="g-warn">체력이 바닥났어요. 쉬는 활동을 하나 넣어 보세요.</p>' : "") +
      '<div class="g-cards">' + st.hand.map(function (id) {
        var c = card(id), on = st.picked.indexOf(id) >= 0, dis = !on && c.cost > left;
        return '<button class="g-card' + (on ? " on" : "") + '" data-id="' + id + '"' + (dis ? " disabled" : "") + ' aria-pressed="' + on + '"><span class="g-e" aria-hidden="true">' + c.e + "</span><b>" + esc(c.n) + '</b><span class="g-p">' + esc(c.p) + (c.cost > 1 ? " · 시간 2칸" : "") + '</span><span class="g-fx">' + fxText(c) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="g-actions"><button class="btn btn-primary" id="gNext"' + (st.picked.length ? "" : " disabled") + ">" + (st.sem === 5 ? "졸업하기" : "이번 학기 마치기") + '</button><button class="btn btn-ghost btn-small" id="gReset">처음부터</button></div></section>';
    root.querySelectorAll(".g-card").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.id, i = st.picked.indexOf(id), c = card(id);
        if (i >= 0) { st.picked.splice(i, 1); } else { st.picked.push(id); }
        var keepPos = st.pos; save(); render();
        if (i < 0) { st.pos = keepPos; moveTo(LOC[id] || "classroom", c.e + " " + NODES[LOC[id] || "classroom"].n + "(으)로!", ""); save(); }
      };
    });
    root.querySelector("#gNext").onclick = endSemester;
    root.querySelector("#gReset").onclick = function () { st = fresh(st.name); save(); render(); };
  }

  function renderStart() {
    var id = null; try { id = JSON.parse(sessionStorage.getItem("yd_id") || "null"); } catch (e) {}
    var saved = load();
    root.innerHTML = '<section class="g-start"><div class="g-start-art" aria-hidden="true"><div class="g-start-ch">' + charSVG(COLORS[0].c) + '</div>' + SEM.map(function (s, i) { return '<span style="--i:' + i + '">' + s + "</span>"; }).join("") + "</div>" +
      '<div><h2>예당고 3년, 미리 살아 보기</h2><p>2027년 3월, 예당고에 입학했어요. 6학기 동안 동아리·탐구·봉사·공부·휴식 가운데 무엇을 할지 고르세요. 고른 활동이 쌓여 졸업할 때 나에게 맞는 진로가 나타납니다.</p>' +
      '<ul class="g-rules"><li>학기마다 시간 칸 3개를 씁니다.</li><li>활동마다 만들기·탐구·표현·소통·도전·꼼꼼 능력치가 오릅니다.</li><li>공부를 안 하면 성적이, 쉬지 않으면 체력이 떨어져요.</li></ul>' +
      '<div class="g-prize"><b>끝까지 졸업하면 상품이 있어요!</b><span>완주 기념품을 드리고, 응모한 학생 중 추첨해 문화상품권도 드려요.</span></div>' +
      '<form id="gStart" class="g-form"><fieldset class="g-colors"><legend>내 캐릭터 고르기</legend><div class="g-color-row">' + COLORS.map(function (c, i) { return '<label class="g-color"><input type="radio" name="gColor" value="' + c.c + '"' + (i === 0 ? " checked" : "") + '><span class="g-color-ch">' + charSVG(c.c) + "</span><em>" + c.n + "</em></label>"; }).join("") + '</div></fieldset><label for="gName">이름</label><div class="g-row"><input id="gName" maxlength="12" placeholder="이름 또는 별명" value="' + esc((id && id.name) || "") + '"><button class="btn btn-primary" type="submit">입학하기</button></div></form>' +
      (saved && saved.name && !saved.done ? '<button class="btn btn-ghost btn-small" id="gCont">' + esc(saved.name) + " 학생, " + SEM[saved.sem] + "부터 이어 하기</button>" : "") + "</div></section>";
    root.querySelector("#gStart").onsubmit = function (e) { e.preventDefault(); var n = root.querySelector("#gName").value.trim() || "예당이"; st = fresh(n); var col = root.querySelector('input[name="gColor"]:checked'); if (col) st.color = col.value; deal(); save(); render(); setTimeout(function () { moveTo("classroom", "입학 첫날! 본관으로 가 볼까?", ""); save(); }, 300); };
    var c = root.querySelector("#gCont"); if (c) c.onclick = function () { st = saved; render(); };
  }

  function renderTrack() {
    root.innerHTML = hud() + '<section class="g-play"><h2>2학년 과목 선택<small>고교학점제! 2학년부터는 듣고 싶은 과목을 직접 고릅니다.</small></h2><div class="g-cards">' +
      TRACKS.map(function (t, i) { return '<button class="g-card" data-i="' + i + '"><span class="g-e" aria-hidden="true">🗂️</span><b>' + esc(t.n) + '</b><span class="g-p">' + esc(t.d) + '</span><span class="g-fx">' + fxText({ fx: t.fx }) + "</span></button>"; }).join("") + "</div></section>";
    root.querySelectorAll(".g-card").forEach(function (b) { b.onclick = function () { var t = TRACKS[+b.dataset.i]; st.track = t.n; apply(t.fx, 0, 0); deal(); save(); render(); }; });
  }

  function endSemester() {
    var btn = root.querySelector("#gNext"); if (btn) btn.disabled = true;
    root.querySelectorAll(".g-card").forEach(function (b) { b.disabled = true; });
    st.picked.forEach(function (id) { var c = card(id); moveTo(LOC[id] || "classroom", c.e + " " + c.n, popText(c)); });
    walkQ.then(function () { return new Promise(function (r) { setTimeout(r, 500); }); }).then(finishSemester);
  }
  function finishSemester() {
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
      '<div class="g-radar"><div class="g-end-ch">' + charSVG(st.color || COLORS[0].c) + "</div>" + radar() + "</div></div>" +
      '<div class="g-end-body"><div><h3>이런 진로도 어울려요</h3><ul class="g-alts">' + alts.map(function (f) { return '<li><a href="#/f/' + f.id + '/1">' + f.emoji + " " + esc(f.name) + "</a></li>"; }).join("") + "</ul>" +
      "<h3>얻은 배지</h3>" + (badges.length ? '<ul class="g-badges">' + badges.map(function (b) { return "<li><b>" + esc(b.n) + "</b><span>" + esc(b.d) + "</span></li>"; }).join("") + "</ul>" : '<p class="g-muted">이번엔 배지가 없어요. 다른 활동 조합으로 다시 도전해 보세요.</p>') +
      "<p class=\"g-muted\">최종 성적: " + gradeLabel(st.g) + " · 2학년 과목: " + esc(st.track || "-") + "</p></div>" +
      '<div><h3>내 생활기록부에 남을 이야기</h3><ul class="ul">' + acts.slice(-8).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div>" +
      prizeHTML(best) +
      '<div class="g-actions"><button class="btn btn-primary" id="gAgain">다른 3년 살아 보기</button><button class="btn btn-ghost" id="gShare">결과 저장</button></div>' +
      '<p class="src">게임 결과는 재미로 보는 참고용이에요. 진짜 진로는 활동을 해 보며 조금씩 찾아가는 거예요.</p></section>';
    bindPrize(best);
    root.querySelector("#gAgain").onclick = function () { st = fresh(st.name); deal(); save(); render(); window.scrollTo(0, 0); };
    root.querySelector("#gShare").onclick = function () {
      var t = ["예당고 3년 미리 살기 결과", "이름: " + st.name, "추천 진로: " + best.name, "어울리는 진로: " + alts.map(function (f) { return f.name; }).join(", "), "능력치: " + STATS.map(function (x) { return x.name + " " + st.st[x.k]; }).join(", "), "배지: " + (badges.map(function (b) { return b.n; }).join(", ") || "-"), "", "생활기록부 이야기:"].concat(acts.map(function (a) { return "- " + a; })).join("\n");
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
    mount: function (el) { root = el; st = load(); if (st && st.done) st = null; render(); }
  };
})();
