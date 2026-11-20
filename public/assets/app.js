/* 예당고 진로 내비 — 화면 로직 (프레임워크 없이 동작) */
(function () {
  "use strict";
  var B = window.YD.base, FIELDS = window.YD.FIELDS, ADM = window.YD.ADMISSIONS;
  var FAC = B.FACILITIES || [], SCHOOL = B.SCHOOL, S = B.S, CLUBS = B.CLUBS, PROGRAMS = B.PROGRAMS, CONTESTS = B.CONTESTS, GROUPS = B.GROUPS, GC = B.GRADE_COMMON;
  var main = document.getElementById("main");
  var GROUP = {}; GROUPS.forEach(function (g) { GROUP[g.id] = g; });
  var FIELD = {}; FIELDS.forEach(function (f) { FIELD[f.id] = f; });

  /* ───── 유틸 ───── */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return v === undefined ? null : false; } }
  function sstore(k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || "null"); sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function ul(items, keyCount) { keyCount = keyCount || 0; return '<ul class="ul">' + items.map(function (x, i) { return '<li' + (i < keyCount ? ' class="key"' : "") + ">" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function act(a) { if (a.indexOf("P:") === 0) return PROGRAMS[a.slice(2)] || a; if (a.indexOf("C:") === 0) return CONTESTS[a.slice(2)] || a; return a; }
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];
  function fmtDate(d) { var x = new Date(d + "T00:00:00"); return (x.getMonth() + 1) + "월 " + x.getDate() + "일 (" + DOW[x.getDay()] + ")"; }
  function addMin(t, m) { var p = t.split(":").map(Number), v = p[0] * 60 + p[1] + m; return String(Math.floor(v / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0"); }

  var ICONS = {
    ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.3 6.3l2 2M15.7 15.7l2 2M6.3 17.7l2-2M15.7 8.3l2-2"/><circle cx="12" cy="12" r="3.2"/>',
    spark: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.8 2.6 14.2 0 17M12 3.5c-2.6 2.8-2.6 14.2 0 17"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    room: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>',
    path: '<path d="M5 19c3-6 11-2 14-9"/><circle cx="5" cy="19" r="1.8"/><circle cx="19" cy="10" r="1.8"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    flask: '<path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + "</svg>"; }

  /* ───── 학생 정보 (진로 결과 보기 전 1회 입력) ───── */
  function identity() { return sstore("yd_id") || null; }
  function identityOK(id) { return id && id.name && id.school && (id.phone || "").replace(/\D/g, "").length >= 8; }
  function askIdentity(onDone, onCancel) {
    var id = identity() || {};
    var bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="idTitle">' +
      '<h2 id="idTitle">시작하기 전에 알려 주세요</h2>' +
      '<p class="m-sub">결과에 이름이 함께 표시되고, 상담을 신청할 때 자동으로 채워집니다. 입력한 정보는 이 브라우저에만 남습니다.</p>' +
      '<form class="form" id="idForm" novalidate>' +
      '<div class="f"><label for="idName">학생 이름<i>*</i></label><input id="idName" autocomplete="name" maxlength="20" value="' + esc(id.name || "") + '" required></div>' +
      '<div class="f"><label for="idSchool">다니는 중학교<i>*</i></label><input id="idSchool" placeholder="예: 예당중학교" maxlength="30" value="' + esc(id.school || "") + '" required></div>' +
      '<div class="f"><label for="idPhone">연락처<i>*</i></label><input id="idPhone" inputmode="tel" placeholder="010-1234-5678" maxlength="20" value="' + esc(id.phone || "") + '" required><div class="help">학생 또는 보호자 번호</div></div>' +
      '<div class="err" id="idErr" role="alert"></div>' +
      '<div class="row"><button type="button" class="btn btn-ghost" id="idCancel">취소</button><button class="btn btn-primary" type="submit">결과 보기</button></div>' +
      "</form></div>";
    document.body.appendChild(bg);
    var prevFocus = document.activeElement;
    setTimeout(function () { $("#idName", bg).focus(); }, 30);
    function close() { bg.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }
    $("#idCancel", bg).onclick = function () { close(); onCancel && onCancel(); };
    bg.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); onCancel && onCancel(); } });
    $("#idForm", bg).onsubmit = function (e) {
      e.preventDefault();
      var v = { name: $("#idName", bg).value.trim(), school: $("#idSchool", bg).value.trim(), phone: $("#idPhone", bg).value.trim() };
      if (!identityOK(v)) { $("#idErr", bg).textContent = "이름, 중학교, 연락처(숫자 8자리 이상)를 모두 입력해 주세요."; return; }
      sstore("yd_id", v);
      close();
      onDone && onDone(v);
    };
  }

  /* ───── 검색 매칭 ───── */
  function norm(s) { return String(s || "").toLowerCase().replace(/[\s·,./|()\[\]<>~!?"'\-]/g, ""); }
  function score(f, input) {
    var q = norm(input); if (!q) return 0;
    var sc = 0, nm = norm(f.name);
    if (nm.indexOf(q) >= 0) sc += 40;
    f.keywords.forEach(function (kw) {
      var k = norm(kw); if (!k) return;
      if (q === k) sc += 30 + k.length;
      else if (q.indexOf(k) >= 0) sc += Math.max(6, k.length * 2);
      else if (k.indexOf(q) >= 0 && q.length >= 2) sc += q.length + 2;
    });
    f.jobs.forEach(function (j) { var jn = norm(j.name); if (jn.indexOf(q) >= 0 && q.length >= 2) sc += 12; });
    if (norm(f.examples).indexOf(q) >= 0 && q.length >= 2) sc += 8;
    return sc;
  }
  function rank(input) { return FIELDS.map(function (f) { return { f: f, s: score(f, input) }; }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }); }

  /* ───── 라우터 ───── */
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    var q = {}; var qi = h.indexOf("?");
    if (qi >= 0) { h.slice(qi + 1).split("&").forEach(function (p) { var kv = p.split("="); q[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ""); }); h = h.slice(0, qi); }
    return { parts: h.split("/").filter(Boolean), q: q };
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function setNav(key) { $$(".nav a").forEach(function (a) { if (a.dataset.nav === key) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); }); $("#nav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
  function route() {
    var r = parseHash(), p = r.parts;
    window.scrollTo(0, 0);
    if (p[0] === "f" && FIELD[p[1]]) return viewResult(FIELD[p[1]], Math.min(3, Math.max(1, +p[2] || 1)), r.q.q || "");
    if (p[0] === "fields") return viewFields();
    if (p[0] === "school") return viewSchool();
    if (p[0] === "campus") return viewCampus(p[1] || "");
    if (p[0] === "game") return viewGame();
    if (p[0] === "booking") return viewBooking(r.q.f ? FIELD[r.q.f] : null, r.q.q || "");
    if (p[0] === "check") return viewCheck(r.q.id || "");
    return viewHome();
  }
  window.addEventListener("hashchange", route);
  $("#menuBtn").onclick = function () { var n = $("#nav"), open = !n.classList.contains("open"); n.classList.toggle("open", open); this.setAttribute("aria-expanded", String(open)); };

  /* ───── 공통 블록 ───── */
  function terraces() {
    var lines = "", W = 1440, H = 420;
    for (var i = 0; i < 9; i++) {
      var y = 40 + i * 44, a = 60 + i * 6, op = (0.18 + i * 0.07).toFixed(2);
      var col = i > 5 ? "#C9EA6A" : "#7FB88F";
      lines += '<path style="--d:' + (i * 90) + 'ms" d="M-20 ' + (y + a) + " C 260 " + (y - a * 0.6) + ", 520 " + (y + a * 0.9) + ", 760 " + (y + 8) + " S 1180 " + (y - a * 0.7) + ", 1460 " + (y + a * 0.4) + '" stroke="' + col + '" stroke-opacity="' + op + '"/>';
    }
    return '<svg class="terraces" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" aria-hidden="true">' + lines + "</svg>";
  }
  function groupsHTML() {
    return '<div class="groups">' + GROUPS.map(function (g) {
      var list = FIELDS.filter(function (f) { return f.group === g.id; });
      return '<div class="group"><h3><i style="background:' + g.color + '"></i>' + esc(g.name) + "</h3><ul>" + list.map(function (f) {
        return '<li><a href="#/f/' + f.id + '/1"><span class="e" aria-hidden="true">' + f.emoji + "</span><b>" + esc(f.name) + "</b><span>" + esc(f.tagline) + "</span></a></li>";
      }).join("") + "</ul></div>";
    }).join("") + "</div>";
  }
  function schoolHTML() {
    return '<div class="school-grid"><ul class="hl-list">' + SCHOOL.highlights.map(function (h) {
      return '<li><span class="hl-ico">' + icon(h.icon) + "</span><div><b>" + esc(h.title) + "</b><p>" + esc(h.desc) + "</p></div></li>";
    }).join("") + '</ul><aside class="aside-card"><h3>진로와 상관없이 모두 함께해요</h3>' + ul(SCHOOL.commonPrograms) +
      '<p class="src" style="margin-top:18px">자료: 2026학년도 예당고 교육계획서와 2026년 11월 학교 현황. 추진 중인 사업은 일정이 바뀔 수 있습니다.</p></aside></div>';
  }
  function newsHTML() {
    var n = SCHOOL.news; if (!n) return "";
    var passed = n.status === "합격";
    return '<div class="news"><div class="news-l"><span class="news-y">' + n.year + '학년도 ' + esc(n.title) + '</span><b>' + n.unis.map(esc).join(" · ") + " " + esc(n.dept) + '</b></div>' +
      '<div class="news-r"><span class="news-badge">' + (passed ? "합격" : "수능 최저 모두 충족") + '</span><p>' + esc(passed ? n.year + "학년도 수시에서 " + n.unis.join("·") + " " + n.dept + "에 합격했습니다." : n.note) + "</p></div></div>";
  }
  function resultsHTML() {
    return newsHTML() + '<div class="results">' + SCHOOL.results.map(function (r) {
      return '<article class="res-year"><h3>' + r.year + '학년도</h3>' +
        '<p class="res-k">서울 · 수도권</p><p class="res-v">' + r.metro.map(esc).join(", ") + ' 등</p>' +
        '<p class="res-k">교육대 · 사관학교</p><p class="res-v">' + r.special.map(esc).join(", ") + '</p>' +
        '<p class="res-k">지방 국공립 · 사립</p><p class="res-v">' + esc(r.local) + '</p></article>';
    }).join("") + '</div><p class="src">출처: 예당고등학교 학년도별 대학 진학 결과. 대학 이름은 합격 기준이며 수도권 대학은 주요 대학만 적었습니다.</p>';
  }
  function resultsSection() {
    return '<section class="block"><div class="wrap"><h2 class="h2">선배들은 이 대학에 갔어요</h2><p class="sub">최근 3년(2024~2026학년도) 예당고 졸업생의 대학 진학 결과입니다.</p>' + resultsHTML() + "</div></section>";
  }
  function changesHTML() {
    return '<div class="changes">' + ADM.changes.map(function (c) { return "<div><b>" + esc(c.t) + "</b><p>" + esc(c.d) + "</p></div>"; }).join("") + "</div>";
  }
  function ctaBand(fieldId) {
    return '<section class="cta-band"><div class="wrap"><div style="flex:1 1 420px"><h2>결과를 들고 선생님과 직접 이야기해 보세요</h2><p>12월부터 2월까지 평일 오후와 토요일 오전에 개인 상담을 합니다. 부모님과 함께 오시면 학부모 상담도 이어서 진행합니다. 상담을 끝까지 받은 학생은 추첨으로 문화상품권을 드려요.</p></div><a class="btn btn-primary" href="#/booking' + (fieldId ? "?f=" + fieldId : "") + '">개인 상담 신청</a></div></section>';
  }

  /* ───── 처음 화면 ───── */
  var SAMPLE = ["의사", "간호사", "반도체 엔지니어", "AI 개발자", "게임 개발자", "조종사", "경찰", "초등교사", "변호사", "웹툰 작가", "유튜버", "수의사", "셰프", "축구선수", "상담심리사", "건축가"];
  function viewHome() {
    setNav("home");
    var jobsCount = FIELDS.reduce(function (n, f) { return n + f.jobs.length; }, 0);
    main.innerHTML =
      '<section class="hero">' + terraces() +
      '<div class="wrap"><h1>꿈을 적으면, 예당고 3년이 보입니다</h1>' +
      '<p class="lead">장래희망 하나로 1·2·3학년에 들을 과목, 해 볼 활동, 생활기록부에 남길 내용, 갈 수 있는 대학까지 한 번에 정리해 드려요.</p>' +
      '<form class="search" id="searchForm" role="search" autocomplete="off"><label for="q">되고 싶은 것, 좋아하는 분야, 가고 싶은 학과 무엇이든</label>' +
      '<div class="search-wrap"><div class="field"><input id="q" name="q" placeholder="예: 반도체 엔지니어" aria-autocomplete="list" aria-controls="suggest" aria-expanded="false"><button class="go" type="submit">결과 보기</button></div>' +
      '<ul class="suggest" id="suggest" role="listbox"></ul></div>' +
      '<div class="chips" aria-label="예시">' + SAMPLE.map(function (s) { return '<button type="button" class="chip" data-q="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div></form>" +
      '<div class="hero-facts"><span><b>' + FIELDS.length + "개</b>진로 분야</span><span><b>" + jobsCount + "개</b>대표 직업 정보</span><span><b>2028</b>대입 기준</span></div>" +
      "</div></section>" + quickMenu() +
      '<section class="block" id="fields"><div class="wrap"><h2 class="h2">분야를 골라 둘러보기</h2><p class="sub">아직 장래희망이 없어도 괜찮아요. 끌리는 분야를 눌러 보세요.</p>' + groupsHTML() + "</div></section>" +
      campusTeaser() + resultsSection() + ctaBand() +
      '<section class="block"><div class="wrap"><h2 class="h2">예당고는 이런 학교예요</h2><p class="sub">보성 득량에 있는 기숙형 일반고. AI와 IB로 수업 방식을 바꾸고 있습니다.</p>' + schoolHTML() + "</div></section>" +
      '<section class="block"><div class="wrap"><h2 class="h2">2028 대입, 이것만은 알아 두세요</h2><p class="sub">지금 중3이 치르는 대입에서 달라지는 점입니다.</p>' + changesHTML() + "</div></section>" +
      savedHTML();
    bindSearch();
    bindSaved();
  }

  function bindSearch() {
    var form = $("#searchForm"), q = $("#q"), sg = $("#suggest"), sel = -1, items = [];
    function close() { sg.classList.remove("on"); q.setAttribute("aria-expanded", "false"); sel = -1; }
    function render() {
      var v = q.value.trim();
      items = v ? rank(v).slice(0, 5) : [];
      if (!items.length) return close();
      sg.innerHTML = items.map(function (x, i) { return '<li><button type="button" role="option" data-id="' + x.f.id + '" aria-selected="' + (i === sel) + '"><span aria-hidden="true">' + x.f.emoji + "</span>" + esc(x.f.name) + '<span class="g">' + esc(GROUP[x.f.group].name) + "</span></button></li>"; }).join("");
      sg.classList.add("on"); q.setAttribute("aria-expanded", "true");
    }
    q.addEventListener("input", function () { sel = -1; render(); });
    q.addEventListener("keydown", function (e) {
      if (!items.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % items.length; render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; render(); }
      else if (e.key === "Escape") close();
      else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); openField(items[sel].f, q.value.trim()); }
    });
    q.addEventListener("blur", function () { setTimeout(close, 150); });
    sg.addEventListener("mousedown", function (e) { var b = e.target.closest("button"); if (b) { e.preventDefault(); openField(FIELD[b.dataset.id], q.value.trim()); } });
    form.onsubmit = function (e) { e.preventDefault(); search(q.value.trim()); };
    $$(".chip", form).forEach(function (c) { c.onclick = function () { q.value = c.dataset.q; search(c.dataset.q); }; });
  }
  function search(v) {
    if (!v) { $("#q").focus(); return; }
    var r = rank(v);
    if (!r.length) {
      toast("딱 맞는 분야를 찾지 못했어요. 아래에서 가까운 분야를 골라 보세요.");
      document.getElementById("fields").scrollIntoView({ behavior: "smooth" });
      return;
    }
    openField(r[0].f, v);
  }
  function openField(f, q) {
    var target = "#/f/" + f.id + "/1" + (q ? "?q=" + encodeURIComponent(q) : "");
    if (identityOK(identity())) return go(target);
    askIdentity(function () { go(target); });
  }

  /* ───── 3년 미리 살기 (게임) ───── */
  function viewGame() {
    setNav("game");
    main.innerHTML = '<div class="g-wrap"><div class="wrap" id="gameRoot"></div></div>' + ctaBand();
    window.YD.game.mount(document.getElementById("gameRoot"));
  }
  function quickMenu() {
    var last = store("yd_game_last"), f = last && FIELD[last.field];
    var ch = window.YD.game && window.YD.game.charSVG ? window.YD.game.charSVG("#2C7350") : "";
    var small = [
      { h: "#/fields", e: "🧭", t: "분야 둘러보기", d: FIELDS.length + "개 진로 분야" },
      { h: "#/campus", e: "🏫", t: "시설 둘러보기", d: "교실·기숙사·도서관 사진" },
      { h: "#/school", e: "🍃", t: "예당고 소개", d: "AI·IB·진학 실적" },
      { h: "#/booking", e: "🗓️", t: "개인 상담 신청", d: "12월~2월, 부모님 함께 가능" }
    ];
    return '<nav class="qm" aria-label="바로가기 메뉴"><div class="wrap qm-grid">' +
      '<a class="qm-game" href="#/game"><span class="qm-badge">게임</span><span class="qm-ch ch walk" aria-hidden="true">' + ch + '</span>' +
      '<span class="qm-gt"><b>3년 미리 살기</b><span>공부 시간표를 짜고 시험 12번, 동아리까지. 예당고 학생이 되어 3년을 살아 보세요.' + (f ? " 지난 결과: " + f.emoji + " " + esc(f.name) : "") + '</span><em>' + (f ? "다시 도전하기" : "게임 시작하기") + ' ▶</em><small>졸업하면 완주 기념품 + 문화상품권 추첨</small></span></a>' +
      small.map(function (m) { return '<a class="qm-item" href="' + m.h + '"><span class="qm-e" aria-hidden="true">' + m.e + "</span><b>" + m.t + "</b><span>" + m.d + "</span></a>"; }).join("") +
      "</div></nav>";
  }
  function gameBand() {
    var last = store("yd_game_last"), f = last && FIELD[last.field];
    return '<section class="game-band"><div class="wrap"><div class="gb-steps" aria-hidden="true">' + ["1-1", "1-2", "2-1", "2-2", "3-1", "3-2"].map(function (x, i) { return '<span style="--i:' + i + '">' + x + "</span>"; }).join("") + '</div><div class="gb-txt"><h2>게임으로 미리 살아 보는 예당고 3년</h2><p>시험 기간마다 공부 시간표를 짜고, 중간·기말고사 12번을 치르며 성적표를 받아 보세요. 동아리와 휴식도 챙겨야 해요. 졸업할 때 내 진로가 나타나고, 끝까지 졸업하면 완주 기념품과 문화상품권 추첨이 기다려요!' + (f ? " 지난번 결과는 " + f.emoji + " " + esc(f.name) + "였어요." : "") + '</p><a class="btn btn-sprout" href="#/game">' + (f ? "다시 도전하기" : "게임 시작") + "</a></div></div></section>";
  }

  /* ───── 시설 둘러보기 ───── */
  function photoURL(k) { return (B.PHOTO_SRC || {})[k] || ""; }
  function allFacilities() { var a = []; FAC.forEach(function (g) { g.items.forEach(function (it) { a.push(it); }); }); return a; }
  function campusTeaser() {
    var picks = ["agora", "library", "dorm", "airoom", "gym"].map(function (id) { return allFacilities().find(function (f) { return f.id === id; }); }).filter(Boolean);
    if (!picks.length) return "";
    return '<section class="block"><div class="wrap"><div class="teaser-head"><div><h2 class="h2">학교를 미리 둘러보세요</h2><p class="sub">교실, 도서관, 기숙사, 체육관까지. 사진을 누르면 크게 볼 수 있어요.</p></div><a class="btn btn-ghost" href="#/campus">시설 전체 보기</a></div>' +
      '<div class="teaser">' + picks.map(function (f, i) {
        return '<a class="tz' + (i === 0 ? " big" : "") + '" href="#/campus/' + f.id + '"><img loading="lazy" src="' + photoURL(f.photos[0]) + '" alt="' + esc(f.name) + '"><span>' + esc(f.name) + "</span></a>";
      }).join("") + "</div></div></section>";
  }
  function viewCampus(openId) {
    setNav("campus");
    var total = allFacilities().reduce(function (n, f) { return n + f.photos.length; }, 0);
    main.innerHTML = '<div class="wrap page-head"><h1>시설 둘러보기</h1><p>예당고의 교실과 생활 공간 ' + allFacilities().length + "곳, 사진 " + total + "장. 카드를 누르면 사진을 넘겨 볼 수 있어요.</p></div>" +
      '<div class="wrap campus">' + FAC.map(function (g) {
        return '<section class="fac-group"><h2>' + esc(g.group) + '</h2><div class="fac-grid">' + g.items.map(function (f) {
          return '<button class="fac" data-id="' + f.id + '" aria-label="' + esc(f.name) + " 사진 " + f.photos.length + '장 보기"><span class="fac-img"><img loading="lazy" decoding="async" src="' + photoURL(f.photos[0]) + '" alt=""><em>' + f.photos.length + '장</em></span><b>' + esc(f.name) + "</b><span>" + esc(f.desc) + "</span></button>";
        }).join("") + "</div></section>";
      }).join("") + '<p class="src">사진: 예당고등학교 홈페이지 「시설둘러보기」</p></div>' + ctaBand();
    $$(".fac").forEach(function (b) { b.onclick = function () { openGallery(b.dataset.id, 0); }; });
    if (openId) openGallery(openId, 0);
  }
  function openGallery(id, start) {
    var f = allFacilities().find(function (x) { return x.id === id; }); if (!f) return;
    var i = start || 0, prev = document.activeElement;
    var bg = document.createElement("div");
    bg.className = "lb"; bg.setAttribute("role", "dialog"); bg.setAttribute("aria-modal", "true"); bg.setAttribute("aria-label", f.name + " 사진");
    bg.innerHTML = '<div class="lb-top"><div><b>' + esc(f.name) + '</b><span class="lb-n"></span></div><button class="lb-x" aria-label="닫기">✕</button></div>' +
      '<div class="lb-stage"><button class="lb-nav prev" aria-label="이전 사진">‹</button><img class="lb-img" alt=""><button class="lb-nav next" aria-label="다음 사진">›</button></div>' +
      '<p class="lb-desc">' + esc(f.desc) + '</p><div class="lb-thumbs">' + f.photos.map(function (k, n) { return '<button data-n="' + n + '" aria-label="' + (n + 1) + '번째 사진"><img loading="lazy" src="' + photoURL(k) + '" alt=""></button>'; }).join("") + "</div>";
    document.body.appendChild(bg); document.body.style.overflow = "hidden";
    function show(n) {
      i = (n + f.photos.length) % f.photos.length;
      $(".lb-img", bg).src = photoURL(f.photos[i]);
      $(".lb-img", bg).alt = f.name + " 사진 " + (i + 1);
      $(".lb-n", bg).textContent = (i + 1) + " / " + f.photos.length;
      $$(".lb-thumbs button", bg).forEach(function (b, n) { b.setAttribute("aria-current", n === i ? "true" : "false"); if (n === i) b.scrollIntoView({ block: "nearest", inline: "center" }); });
      var multi = f.photos.length > 1; $$(".lb-nav", bg).forEach(function (b) { b.hidden = !multi; });
    }
    function close() { bg.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", key); if (prev && prev.focus) prev.focus(); if (/^#\/campus\//.test(location.hash)) history.replaceState(null, "", "#/campus"); }
    function key(e) { if (e.key === "Escape") close(); if (e.key === "ArrowRight") show(i + 1); if (e.key === "ArrowLeft") show(i - 1); }
    $(".lb-x", bg).onclick = close;
    $(".prev", bg).onclick = function () { show(i - 1); };
    $(".next", bg).onclick = function () { show(i + 1); };
    $$(".lb-thumbs button", bg).forEach(function (b) { b.onclick = function () { show(+b.dataset.n); }; });
    bg.addEventListener("click", function (e) { if (e.target === bg || e.target.classList.contains("lb-stage")) close(); });
    var sx = null; var st = $(".lb-stage", bg);
    st.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    st.addEventListener("touchend", function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1); sx = null; });
    document.addEventListener("keydown", key);
    show(i); $(".lb-x", bg).focus();
  }

  /* ───── 분야 / 학교 화면 ───── */
  function viewFields() {
    setNav("fields");
    main.innerHTML = '<div class="wrap page-head"><h1>분야 둘러보기</h1><p>' + FIELDS.length + "개 진로 분야를 7개 묶음으로 나눴어요. 분야를 누르면 직업 정보와 3년 로드맵이 열립니다.</p></div>" +
      '<section class="block" style="padding-top:8px"><div class="wrap">' + groupsHTML() + "</div></section>" + ctaBand();
  }
  function viewSchool() {
    setNav("school");
    main.innerHTML = '<div class="wrap page-head"><h1>예당고는 이런 학교예요</h1><p>' + esc(SCHOOL.location) + ". 기숙사가 있는 농어촌 자율학교로, AI 중점학교와 IB를 함께 준비하고 있습니다.</p></div>" +
      '<section class="block" style="padding-top:8px"><div class="wrap">' + schoolHTML() + "</div></section>" + campusTeaser() + resultsSection() +
      '<section class="block"><div class="wrap"><h2 class="h2">2028 대입, 이것만은 알아 두세요</h2><p class="sub">지금 중3이 치르는 대입에서 달라지는 점입니다.</p>' + changesHTML() + "</div></section>" + ctaBand();
  }

  /* ───── 결과 화면 ───── */
  function outlookBadge(j) {
    var map = { "증가": "ol-up", "다소 증가": "ol-up2", "유지": "ol-keep", "다소 감소": "ol-down" };
    if (j.outlook) return '<span class="ol ' + map[j.outlook] + '">10년 전망 ' + esc(j.outlook) + "</span>";
    return '<span class="ol ol-trend">산업 동향</span>';
  }
  function subjectsFor(f, g) {
    var list = f.subjects.map(function (k) { return S[k]; }).filter(Boolean);
    if (g === 1) {
      var common = list.filter(function (s) { return s.type === "공통"; });
      if (common.length) return common;
      var G1 = { med: ["tonggwahak", "gwatamsil", "suong"], eng: ["suong", "tonggwahak", "gwatamsil"], sci: ["suong", "tonggwahak", "gwatamsil"], soc: ["tongsahoe", "gukong", "hanguksa"], edu: ["tongsahoe", "gukong", "yeongong"], life: ["tongsahoe", "yeongong", "cheyuk"], art: ["gukong", "tongsahoe", "cheyuk"] };
      return (G1[f.group] || []).map(function (k) { return S[k]; });
    }
    if (g === 2) return list.filter(function (s) { return s.type === "일반"; });
    return list.filter(function (s) { return s.type === "진로" || s.type === "융합"; });
  }
  function subjectsHTML(subs, g) {
    if (!subs.length) {
      return '<div class="empty-box">' + (g === 1 ? "1학년은 모두 같은 공통과목을 배웁니다. 통합사회·통합과학·공통국어 안에서 이 분야와 이어지는 주제를 골라 탐구하세요." : "이 학년에 따로 지정한 선택과목은 없어요. 다른 학년을 함께 보세요.") + "</div>";
    }
    var by = {}; subs.forEach(function (s) { (by[s.area] = by[s.area] || []).push(s); });
    return '<div class="subjects">' + Object.keys(by).map(function (a) {
      return '<div class="subj-area">' + esc(a) + "</div>" + by[a].map(function (s) { return '<span class="subj">' + esc(s.name) + '<em class="t-' + s.type + '">' + s.type + "</em></span>"; }).join("");
    }).join("") + "</div>";
  }
  function gradeHTML(f, g) {
    var gc = GC[g], rm = f.roadmap[g] || { j: [], r: [] };
    var clubs = (f.clubs || []).map(function (k) { return CLUBS[k]; }).filter(Boolean);
    var html = '<p class="focus">' + esc(gc.focus) + "</p>";
    html += '<div class="gp-sec"><h3><span class="dot"></span>' + (g === 1 ? "특히 힘을 줄 공통과목" : "들으면 좋은 과목") + '</h3>' + subjectsHTML(subjectsFor(f, g), g) + '<p class="hint">' + esc(gc.subjectNote) + "</p></div>";
    html += '<div class="gp-sec"><h3><span class="dot"></span>교과 연계 탐구 주제</h3>' + ul(f.topics[g] || []) + '<p class="hint">「 」 안은 관련 과목이에요. 수행평가·세특·주제탐구의 소재로 쓰세요.</p></div>';
    html += '<div class="gp-sec"><h3><span class="dot"></span>창의적 체험활동</h3>' +
      '<p class="gp-sub">동아리</p>' + (clubs.length ? ul(clubs) + '<p class="hint">' + esc(gc.clubHow) + "</p>" : '<div class="empty-box">이 진로에 꼭 맞는 상설 동아리가 없다면 뜻이 맞는 친구들과 자율동아리를 직접 만들 수 있어요. ' + esc(gc.clubHow) + "</div>") +
      '<p class="gp-sub">진로활동</p>' + ul((rm.j || []).concat(gc.jinro), (rm.j || []).length) +
      '<p class="gp-sub">자율활동</p>' + ul(gc.jayul) + '<p class="hint">굵게 표시한 항목은 ' + esc(f.name) + " 진로와 특히 이어지는 활동이에요.</p></div>";
    html += '<div class="gp-sec"><h3><span class="dot"></span>예당고에서 해 볼 활동</h3>' + ul(f.acts.map(act)) + '<p class="hint">' + esc(gc.schoolHow) + "</p></div>";
    html += '<div class="gp-sec"><h3><span class="dot"></span>읽어 볼 책과 글</h3>' + ul(f.reading) + '<p class="hint">' + esc(gc.readingHow) + "</p></div>";
    html += '<div class="gp-sec"><h3><span class="dot"></span>생활기록부에 남길 내용</h3>' + ul((rm.r || []).concat(gc.record), (rm.r || []).length) + "</div>";
    return html;
  }
  function admHTML(f) {
    var a = f.adm, U = ADM.universities, by = {};
    a.uni.forEach(function (n) { var u = U[n]; if (u) (by[u.group] = by[u.group] || []).push({ n: n, u: u }); });
    var unis = '<div class="uni-groups">' + ADM.groupOrder.filter(function (g) { return by[g]; }).map(function (g) {
      return '<div class="uni-g"><b class="gn">' + esc(g) + "</b>" + by[g].map(function (x) { return '<p class="uni"><strong>' + esc(x.n) + "</strong> " + esc(x.u.region) + "<span>" + esc(x.u.note) + "</span></p>"; }).join("") + "</div>";
    }).join("") + "</div>";
    return '<div class="adm"><p class="stream">' + esc(a.stream) + "</p>" +
      '<div class="adm-grid"><div><h3>대학이 원하는 이수 과목</h3>' + ul(a.want) + '<h3 style="margin-top:20px">대학이 학생부에서 보는 것</h3>' + ul(a.focus) + "</div>" +
      "<div><h3>살펴볼 대학</h3>" + unis + "</div></div>" +
      (a.note ? '<div class="callout">' + esc(a.note) + "</div>" : "") +
      '<details class="more"><summary>전형 유형별 준비 방법</summary><ul>' + ADM.tracks.map(function (t) { return "<li><b>" + esc(t.name) + "</b> — " + esc(t.tip) + "</li>"; }).join("") + "</ul></details>" +
      '<p class="src">' + esc(ADM.disclaimer) + "<br>출처: " + esc(ADM.source) + "</p></div>";
  }
  function viewResult(f, g, q) {
    setNav("");
    var id = identity();
    if (!identityOK(id)) {
      main.innerHTML = '<div class="wrap page-head"><h1>' + esc(f.name) + "</h1><p>학생 정보를 입력하면 결과가 열립니다.</p></div>";
      askIdentity(function () { route(); }, function () { go("#/"); });
      return;
    }
    var grp = GROUP[f.group];
    var r = q ? rank(q) : [];
    var second = r.length > 1 && r[0].f.id === f.id && r[1].s >= r[0].s * 0.55 ? r[1].f : null;
    main.innerHTML =
      '<section class="r-head"><div class="wrap">' +
      '<div class="crumbs"><a href="#/fields">분야 둘러보기</a><span aria-hidden="true">/</span><i style="background:' + grp.color + '"></i>' + esc(grp.name) + "</div>" +
      '<h1><span class="e" aria-hidden="true">' + f.emoji + "</span>" + esc(f.name) + "</h1>" +
      '<p class="tl">' + esc(f.tagline) + "</p>" +
      '<p class="who">' + esc(id.name) + " 학생 (" + esc(id.school) + ")" + (q ? ", 입력한 꿈: " + esc(q) : "") + "</p>" +
      (second ? '<p class="maybe">혹시 <a href="#/f/' + second.id + "/1?q=" + encodeURIComponent(q) + '">' + second.emoji + " " + esc(second.name) + "</a> 쪽인가요?</p>" : "") +
      '<div class="r-actions"><button class="btn btn-sprout btn-small" id="saveBtn">결과 저장</button><button class="btn btn-ghost btn-small" id="printBtn">인쇄 · PDF</button><button class="btn btn-ghost btn-small" id="dlBtn">텍스트로 내려받기</button></div>' +
      "</div></section>" +
      '<div class="wrap r-body"><div>' +
      '<section class="sec"><h2>어떤 일을 하나요</h2><p class="note">관련 직업: ' + esc(f.examples) + "</p>" +
      '<div class="jobs">' + f.jobs.map(function (j) {
        return '<article class="job">' + outlookBadge(j) + "<h3>" + esc(j.name) + "</h3><p>" + esc(j.does) + "</p>" + (j.trend ? '<p class="trend">' + esc(j.trend) + "</p>" : "") + '<p class="path"><b>되는 길</b> ' + esc(j.path) + "</p></article>";
      }).join("") + "</div>" +
      '<p class="src">10년 전망: 한국고용정보원 「2025~2035 정성적 일자리 전망」(2026.5). 이 보고서는 보건·의료, 경영·금융, 예술·방송·스포츠, 여행·음식 등 4개 직군만 분석해서, 그 밖의 직업은 산업 동향으로 안내합니다.</p></section>' +
      '<section class="sec"><h2>1 · 2 · 3학년 로드맵</h2><p class="note">학년을 누르면 그 학년에 할 일이 펼쳐져요.</p>' +
      '<div class="terrace-tabs" role="tablist" aria-label="학년 선택">' + [1, 2, 3].map(function (n) {
        return '<button class="tt" role="tab" id="tab' + n + '" aria-controls="gradePanel" aria-selected="' + (n === g) + '" tabindex="' + (n === g ? 0 : -1) + '" data-g="' + n + '"><span class="g">' + GC[n].label + '</span><span class="t">' + esc(GC[n].title) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="grade-panel" id="gradePanel" role="tabpanel" aria-labelledby="tab' + g + '">' + gradeHTML(f, g) + "</div>" +
      '<div class="print-only">' + [1, 2, 3].filter(function (n) { return n !== g; }).map(function (n) { return '<div class="print-grade"><h2>' + GC[n].label + " · " + esc(GC[n].title) + "</h2>" + gradeHTML(f, n) + "</div>"; }).join("") + "</div>" +
      "</section>" +
      '<section class="sec"><h2>갈 수 있는 대학과 전형</h2><p class="note">2028학년도 대입 기준의 큰 방향이에요.</p>' + admHTML(f) + "</section>" +
      "</div>" +
      '<aside class="r-side">' +
      '<div class="side-card cta"><h3>이 진로로 상담받기</h3><p>결과를 보며 선생님과 개인 상담. 부모님과 함께 오시면 학부모 상담도 이어서 해요.</p><a class="btn btn-sprout" href="#/booking?f=' + f.id + (q ? "&q=" + encodeURIComponent(q) : "") + '">개인 상담 신청</a></div>' +
      '<div class="side-card"><h3>예당고에서는</h3><p class="yd">' + esc(f.yedang) + "</p></div>" +
      '<div class="side-card"><h3>다른 분야도 보기</h3><p>' + FIELDS.filter(function (x) { return x.group === f.group && x.id !== f.id; }).map(function (x) { return '<a href="#/f/' + x.id + '/1">' + x.emoji + " " + esc(x.name) + "</a>"; }).join("<br>") + "</p></div>" +
      "</aside></div>" + ctaBand(f.id);

    // 학년 탭 (키보드 좌우 이동 포함)
    var tabs = $$(".tt");
    function select(n, focus) {
      tabs.forEach(function (t) { var on = +t.dataset.g === n; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      var panel = $("#gradePanel"); panel.innerHTML = gradeHTML(f, n); panel.setAttribute("aria-labelledby", "tab" + n);
      history.replaceState(null, "", "#/f/" + f.id + "/" + n + (q ? "?q=" + encodeURIComponent(q) : ""));
    }
    tabs.forEach(function (t) {
      t.onclick = function () { select(+t.dataset.g); };
      t.onkeydown = function (e) { var n = +t.dataset.g; if (e.key === "ArrowRight") select(n % 3 + 1, true); if (e.key === "ArrowLeft") select((n + 1) % 3 + 1, true); };
    });
    $("#saveBtn").onclick = function () { saveResult(f, q || f.name); this.textContent = "저장됨"; };
    $("#printBtn").onclick = function () { window.print(); };
    $("#dlBtn").onclick = function () { download(planText(f, q || f.name), "예당고_진로로드맵_" + id.name + "_" + (q || f.name) + ".txt", "text/plain"); };
  }

  /* ───── 저장 · 내려받기 ───── */
  function planText(f, career) {
    var id = identity() || {}, L = [];
    L.push("예당고등학교 진로 로드맵", "────────────────────────");
    L.push("학생: " + (id.name || "-") + " (" + (id.school || "-") + ")", "입력한 꿈: " + career, "추천 분야: " + f.name, "관련 직업: " + f.examples, "만든 날: " + new Date().toLocaleString("ko-KR"), "");
    L.push("■ 대표 직업");
    f.jobs.forEach(function (j) { L.push("  · " + j.name + (j.outlook ? " [10년 전망 " + j.outlook + "]" : "") + " — " + j.does, "    되는 길: " + j.path); });
    L.push("");
    [1, 2, 3].forEach(function (g) {
      var gc = GC[g], rm = f.roadmap[g] || { j: [], r: [] };
      L.push("■ " + gc.label + " · " + gc.title, "  방향: " + gc.focus);
      L.push("  과목: " + (subjectsFor(f, g).map(function (s) { return s.name; }).join(", ") || "학년 공통과목 중심"));
      L.push("  탐구 주제: " + (f.topics[g] || []).join(" / "));
      L.push("  진로활동: " + (rm.j || []).concat(gc.jinro).join(" / "));
      L.push("  생기부: " + (rm.r || []).concat(gc.record).join(" / "), "");
    });
    L.push("■ 동아리: " + ((f.clubs || []).map(function (k) { return CLUBS[k]; }).join(" / ") || "자율동아리 개설 권장"));
    L.push("■ 예당고 활동: " + f.acts.map(act).join(" / "));
    L.push("■ 읽어 볼 책: " + f.reading.join(" / "), "");
    L.push("■ 대학·전형 (2028 기준)", "  계열: " + f.adm.stream, "  이수 과목: " + f.adm.want.join(" / "), "  살펴볼 대학: " + f.adm.uni.join(", "));
    if (f.adm.note) L.push("  참고: " + f.adm.note);
    L.push("", "※ " + ADM.disclaimer);
    return L.join("\n");
  }
  function download(text, name, type) {
    var blob = new Blob([text], { type: type + ";charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = name.replace(/[\\/:*?"<>|\s]/g, "_");
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }
  function saveResult(f, career) {
    var arr = store("yd_saved_v2") || [], id = identity() || {};
    arr.unshift({ t: Date.now(), when: new Date().toLocaleString("ko-KR"), name: id.name, school: id.school, phone: id.phone, career: career, fieldId: f.id, fieldName: f.name });
    if (store("yd_saved_v2", arr.slice(0, 2000))) toast("저장했어요. 처음 화면 아래 '저장한 결과'에서 다시 볼 수 있어요.");
    else toast("이 브라우저에서는 저장할 수 없어요. 텍스트로 내려받기를 이용하세요.");
  }
  function savedHTML() {
    var arr = store("yd_saved_v2") || [];
    if (!arr.length) return "";
    return '<section class="block"><div class="wrap"><h2 class="h2">저장한 결과</h2><p class="sub">이 컴퓨터의 이 브라우저에만 저장돼요. 설명회처럼 여러 학생이 한 기기를 쓸 때는 CSV로 모아 내려받으세요.</p>' +
      '<div class="saved-list">' + arr.map(function (it, i) {
        return '<div class="saved-item" data-i="' + i + '"><div class="info"><b>' + esc(it.name || "") + " · " + esc(it.career) + "</b><span>" + esc(it.fieldName) + " · " + esc(it.school || "") + " · " + esc(it.when || "") + '</span></div><a class="btn btn-ghost btn-small" href="#/f/' + it.fieldId + "/1?q=" + encodeURIComponent(it.career) + '" data-act="open">열기</a><button class="btn btn-ghost btn-small" data-act="del">삭제</button></div>';
      }).join("") + '</div><div class="submit-row"><button class="btn btn-primary btn-small" id="csvBtn">전체 CSV 내려받기</button></div></div></section>';
  }
  function bindSaved() {
    var list = $(".saved-list"); if (!list) return;
    list.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var i = +b.closest(".saved-item").dataset.i, arr = store("yd_saved_v2") || [], it = arr[i];
      if (b.dataset.act === "del") { arr.splice(i, 1); store("yd_saved_v2", arr); viewHome(); }
      if (b.dataset.act === "open" && it) sstore("yd_id", { name: it.name, school: it.school, phone: it.phone });
    });
    $("#csvBtn").onclick = function () {
      var arr = store("yd_saved_v2") || [];
      function c(v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }
      var rows = [["저장시각", "학생이름", "학교", "연락처", "입력한 꿈", "추천 분야"].map(c).join(",")];
      arr.forEach(function (it) { rows.push([it.when, it.name, it.school, it.phone, it.career, it.fieldName].map(c).join(",")); });
      download("﻿" + rows.join("\r\n"), "예당고_진로결과_" + new Date().toISOString().slice(0, 10) + ".csv", "text/csv");
    };
  }

  /* ───── 상담 예약 ───── */
  var TOPICS = ["진로·진학", "과목 선택(고교학점제)", "IB 과정", "AI 교육", "기숙사·학교생활", "입학 절차", "기타"];
  function viewBooking(field, q) {
    setNav("");
    var id = identity() || {};
    var st = { type: null, month: null, date: null, time: null, avail: null };
    main.innerHTML =
      '<div class="narrow page-head"><h1>개인 진로 상담 신청</h1><p>진로 내비 결과를 바탕으로 예당고 선생님과 1:1로 이야기합니다. 부모님과 함께 오시면 학생 상담에 이어 학부모 상담도 진행해요. 장소는 예당고등학교(' + esc(SCHOOL.location) + ")입니다.</p><p class=\"prize-note\"><b>상담 이벤트</b> 상담을 끝까지 받은 학생 중 추첨해 문화상품권을 드려요.</p></div>" +
      '<div class="narrow steps">' +
      '<section class="step" id="s1"><h2><span class="n">1</span>누가 오시나요?</h2><p class="hint">상담 방식을 골라 주세요.</p><div class="step-body"><div class="types" role="radiogroup" aria-label="상담 방식">' +
      '<button class="type" role="radio" aria-checked="false" data-type="student"><b>학생 혼자</b><span>학생 진로·과목 선택·학교생활 상담</span></button>' +
      '<button class="type" role="radio" aria-checked="false" data-type="family"><b>부모님과 함께</b><span>학생 상담에 이어 학부모 상담 (입학·기숙사·IB·대입 안내 포함)</span></button>' +
      "</div></div></section>" +
      '<section class="step locked" id="s2"><h2><span class="n">2</span>날짜와 시간 고르기</h2><p class="hint">12월~2월 평일 16:00~18:00, 토요일 10:00~12:00. 공휴일은 쉽니다.</p><div class="step-body" id="calBox"><p class="empty-box">상담 방식을 먼저 골라 주세요.</p></div></section>' +
      '<section class="step locked" id="s3"><h2><span class="n">3</span>신청 정보</h2><p class="hint">상담 전날 확인 연락을 드립니다.</p><div class="step-body">' +
      '<form class="form" id="bookForm" novalidate>' +
      '<div class="f"><label for="bName">학생 이름<i>*</i></label><input id="bName" maxlength="20" autocomplete="name" value="' + esc(id.name || "") + '"></div>' +
      '<div class="f"><label for="bSchool">다니는 중학교<i>*</i></label><input id="bSchool" maxlength="30" value="' + esc(id.school || "") + '"></div>' +
      '<div class="f"><label for="bGrade">학년</label><select id="bGrade"><option>중학교 3학년</option><option>중학교 2학년</option><option>중학교 1학년</option><option>기타</option></select></div>' +
      '<div class="f"><label for="bPhone">학생 연락처</label><input id="bPhone" inputmode="tel" maxlength="20" placeholder="010-0000-0000" value="' + esc(id.phone || "") + '"><div class="help">학생 또는 보호자 번호 중 하나는 꼭 적어 주세요.</div></div>' +
      '<div class="parent-box" id="parentBox"><div class="ttl" id="parentTtl">보호자 정보</div>' +
      '<div class="f"><label for="pName">보호자 이름<span id="pReq"></span></label><input id="pName" maxlength="20"></div>' +
      '<div class="f"><label for="pRel">관계</label><select id="pRel"><option>어머니</option><option>아버지</option><option>조부모</option><option>기타</option></select></div>' +
      '<div class="f"><label for="pPhone">보호자 연락처<span id="pReq2"></span></label><input id="pPhone" inputmode="tel" maxlength="20" placeholder="010-0000-0000"></div></div>' +
      '<div class="f full"><label for="bCareer">관심 진로</label><input id="bCareer" maxlength="40" value="' + esc(q || (field ? field.name : "")) + '"></div>' +
      '<fieldset class="f full"><legend>상담받고 싶은 내용 (여러 개 선택)</legend><div class="checks">' + TOPICS.map(function (t, i) { return '<label><input type="checkbox" name="topic" value="' + esc(t) + '"' + (i === 0 ? " checked" : "") + ">" + esc(t) + "</label>"; }).join("") + "</div></fieldset>" +
      '<div class="f full"><label for="bMsg">미리 전하고 싶은 말</label><textarea id="bMsg" maxlength="500" placeholder="궁금한 점이나 고민을 적어 주시면 상담을 준비해 둘게요."></textarea></div>' +
      '<input class="hp" tabindex="-1" autocomplete="off" id="bWeb" aria-hidden="true">' +
      '<div class="agree"><b>개인정보 수집·이용 안내</b><br>수집 항목: 학생·보호자 이름, 학교, 연락처, 상담 희망 내용 / 목적: 상담 일정 안내와 진행 / 보관: 상담 종료 후 2027년 3월 말까지 보관 뒤 파기. 동의하지 않으면 온라인 신청이 어려우니 학교로 전화해 주세요.' +
      '<label><input type="checkbox" id="bAgree">위 내용에 동의합니다</label></div>' +
      '<div class="full submit-row"><button class="btn btn-primary" type="submit" id="bSubmit">상담 신청하기</button><span class="err" id="bErr" role="alert"></span></div>' +
      "</form></div></section></div>";

    $$(".type").forEach(function (b) {
      b.onclick = function () {
        st.type = b.dataset.type; st.time = null;
        $$(".type").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
        $("#s2").classList.remove("locked");
        var fam = st.type === "family";
        $("#parentTtl").textContent = fam ? "함께 오시는 보호자" : "보호자 정보 (선택)";
        $("#pReq").innerHTML = fam ? "<i>*</i>" : ""; $("#pReq2").innerHTML = fam ? "<i>*</i>" : "";
        loadCal();
      };
    });
    $("#bookForm").onsubmit = submit;

    function loadCal() {
      if (st.avail) return renderCal();
      $("#calBox").innerHTML = '<p class="empty-box">상담 가능한 시간을 불러오는 중…</p>';
      fetch("/api/availability" + (st.fresh ? "?t=" + Date.now() : "")).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.days) throw new Error(d.error || "");
        st.avail = d; renderCal();
      }).catch(function (e) {
        $("#calBox").innerHTML = '<p class="empty-box">일정을 불러오지 못했어요. 새로고침하거나 잠시 후 다시 시도해 주세요. ' + esc(e.message || "") + "</p>";
      });
    }
    function slotsOf(day) {
      // 유형에 따라 실제 선택 가능한 시작 시간
      return day.slots.map(function (s, i) {
        var ok = s.status === "open";
        if (ok && st.type === "family") { var nx = day.slots[i + 1]; ok = !!(nx && nx.status === "open"); }
        return { time: s.time, ok: ok, status: s.status };
      });
    }
    function renderCal() {
      var days = st.avail.days, months = [];
      days.forEach(function (d) { var m = d.date.slice(0, 7); if (months.indexOf(m) < 0) months.push(m); });
      if (!st.month) {
        st.month = months.find(function (m) { return days.some(function (d) { return d.date.slice(0, 7) === m && slotsOf(d).some(function (s) { return s.ok; }); }); }) || months[0];
      }
      var mdays = days.filter(function (d) { return d.date.slice(0, 7) === st.month; });
      var first = new Date(mdays[0].date + "T00:00:00").getDay();
      var html = '<div class="months">' + months.map(function (m) { return '<button type="button" data-m="' + m + '" aria-pressed="' + (m === st.month) + '">' + (+m.slice(5)) + "월</button>"; }).join("") + "</div>";
      html += '<div class="cal" role="grid" aria-label="' + (+st.month.slice(5)) + '월 달력">' + DOW.map(function (d, i) { return '<div class="dow' + (i === 0 ? " sun" : i === 6 ? " sat" : "") + '">' + d + "</div>"; }).join("");
      for (var i = 0; i < first; i++) html += '<div class="day blank"></div>';
      mdays.forEach(function (d) {
        var n = slotsOf(d).filter(function (s) { return s.ok; }).length;
        var label = d.closed ? (d.reason || "") : n ? n + "개 가능" : d.slots.length ? "마감" : "";
        var shown = n && !d.closed ? n + '<span class="w">개 가능</span>' : esc(d.closed && d.reason && d.reason.length > 3 ? "휴일" : label);
        html += '<button type="button" class="day" data-d="' + d.date + '"' + (n ? "" : " disabled") + ' aria-pressed="' + (d.date === st.date) + '" aria-label="' + fmtDate(d.date) + " " + (label || "상담 없음") + '">' + (+d.date.slice(8)) + "<small>" + shown + "</small></button>";
      });
      html += "</div>";
      html += '<div id="timeBox"></div><div class="legend"><span>숫자는 선택할 수 있는 시간 수예요.</span>' + (st.type === "family" ? "<span>부모님과 함께 오시는 상담은 바로 다음 시간도 비어 있어야 선택할 수 있어요.</span>" : "") + "</div>";
      $("#calBox").innerHTML = html;
      $$(".months button").forEach(function (b) { b.onclick = function () { st.month = b.dataset.m; st.date = null; st.time = null; renderCal(); lockForm(); }; });
      $$(".day[data-d]").forEach(function (b) { b.onclick = function () { st.date = b.dataset.d; st.time = null; renderCal(); lockForm(); }; });
      renderTimes();
    }
    function renderTimes() {
      var box = $("#timeBox"); if (!box) return;
      if (!st.date) { box.innerHTML = ""; return; }
      var day = st.avail.days.find(function (d) { return d.date === st.date; });
      box.innerHTML = '<div class="times" role="group" aria-label="' + fmtDate(st.date) + ' 시간">' + slotsOf(day).map(function (s) {
        var why = s.status === "taken" ? "예약됨" : s.status === "blocked" ? "상담 없음" : s.status === "past" ? "지난 시간" : !s.ok ? "선택 불가" : "가능";
        return '<button type="button" class="time" data-t="' + s.time + '"' + (s.ok ? "" : " disabled") + ' aria-pressed="' + (s.time === st.time) + '">' + s.time + "<small>" + why + "</small></button>";
      }).join("") + "</div>" + (st.time ? '<p class="picked">' + fmtDate(st.date) + " " + st.time + " 시작</p>" : "");
      $$(".time", box).forEach(function (b) { b.onclick = function () { st.time = b.dataset.t; renderTimes(); lockForm(); if (b.dataset.t) setTimeout(function () { $("#s3").scrollIntoView({ behavior: "smooth", block: "start" }); }, 120); }; });
    }
    function lockForm() { $("#s3").classList.toggle("locked", !(st.type && st.date && st.time)); }

    function submit(e) {
      e.preventDefault();
      var err = $("#bErr"); err.textContent = "";
      if (!(st.type && st.date && st.time)) { err.textContent = "상담 방식과 날짜·시간을 먼저 골라 주세요."; return; }
      var body = {
        type: st.type, date: st.date, time: st.time,
        studentName: $("#bName").value.trim(), school: $("#bSchool").value.trim(), grade: $("#bGrade").value,
        studentPhone: $("#bPhone").value.trim(), parentName: $("#pName").value.trim(), parentRelation: $("#pRel").value, parentPhone: $("#pPhone").value.trim(),
        career: $("#bCareer").value.trim(), fieldName: field ? field.name : "", message: $("#bMsg").value.trim(),
        topics: $$('input[name="topic"]:checked').map(function (x) { return x.value; }),
        agree: $("#bAgree").checked, website: $("#bWeb").value
      };
      var dig = function (s) { return s.replace(/\D/g, "").length; };
      if (!body.studentName || !body.school) { err.textContent = "학생 이름과 중학교를 입력해 주세요."; return; }
      if (dig(body.studentPhone) < 8 && dig(body.parentPhone) < 8) { err.textContent = "연락받을 전화번호를 하나 이상 적어 주세요."; return; }
      if (st.type === "family" && (!body.parentName || dig(body.parentPhone) < 8)) { err.textContent = "부모님 동반 상담은 보호자 이름과 연락처가 필요해요."; return; }
      if (!body.agree) { err.textContent = "개인정보 수집·이용에 동의해 주세요."; return; }
      var btn = $("#bSubmit"); btn.disabled = true; btn.textContent = "신청하는 중…";
      fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
        .then(function (res) {
          if (!res.ok) {
            err.textContent = res.d.error || "신청하지 못했어요.";
            btn.disabled = false; btn.textContent = "상담 신청하기";
            if (res.status === 409) { st.avail = null; st.time = null; st.fresh = true; loadCal(); lockForm(); }
            return;
          }
          var mine = store("yd_bookings") || []; mine.unshift({ id: res.d.id, date: res.d.date, time: res.d.time }); store("yd_bookings", mine.slice(0, 20));
          showDone(res.d, body);
        })
        .catch(function () { err.textContent = "인터넷 연결을 확인하고 다시 시도해 주세요."; btn.disabled = false; btn.textContent = "상담 신청하기"; });
    }
    function showDone(d, body) {
      var last4 = (body.studentPhone || body.parentPhone).replace(/\D/g, "").slice(-4);
      $(".steps").innerHTML = '<div class="done" role="status"><h2>상담 신청이 접수됐어요</h2><p>선생님이 확인한 뒤 연락드립니다. 예약번호를 꼭 적어 두세요.</p>' +
        '<div class="code">' + esc(d.id) + "</div>" +
        "<dl><dt>상담 방식</dt><dd>" + esc(d.typeLabel) + "</dd><dt>일시</dt><dd>" + fmtDate(d.date) + " " + esc(d.time) + "</dd><dt>장소</dt><dd>예당고등학교</dd><dt>학생</dt><dd>" + esc(body.studentName) + " (" + esc(body.school) + ")</dd></dl>" +
        '<p><b style="color:#C9EA6A">상담 이벤트</b> 상담을 끝까지 받으면 추첨으로 문화상품권을 드려요.</p><p>날짜를 바꾸거나 취소하려면 <a style="color:#C9EA6A" href="#/check?id=' + esc(d.id) + '">예약 확인</a>에서 예약번호와 전화번호 뒤 4자리(' + esc(last4) + ")를 입력하세요.</p>" +
        '<div class="submit-row"><button class="btn btn-sprout" id="doneShot">예약 내용 저장</button><a class="btn btn-ghost" style="color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35)" href="#/">처음으로</a></div></div>';
      $("#doneShot").onclick = function () {
        download(["예당고 개인 진로 상담 예약", "예약번호: " + d.id, "상담 방식: " + d.typeLabel, "일시: " + fmtDate(d.date) + " " + d.time, "장소: 예당고등학교 (" + SCHOOL.location + ")", "학생: " + body.studentName + " (" + body.school + ")", "예약 확인·취소: " + location.origin + "/#/check?id=" + d.id].join("\n"), "예당고_상담예약_" + d.id + ".txt", "text/plain");
      };
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* ───── 예약 확인 · 취소 ───── */
  var STATUS = { requested: "접수됨 (확인 중)", confirmed: "확정", done: "상담 완료", cancelled: "취소됨", noshow: "불참" };
  function viewCheck(prefill) {
    setNav("check");
    var mine = store("yd_bookings") || [];
    main.innerHTML = '<div class="narrow page-head"><h1>예약 확인 · 취소</h1><p>예약번호와 신청할 때 적은 전화번호 뒤 4자리를 입력하세요.</p></div>' +
      '<div class="narrow steps"><section class="step"><form class="form" id="ckForm" novalidate>' +
      '<div class="f"><label for="ckId">예약번호</label><input id="ckId" placeholder="YD-ABC234" maxlength="12" value="' + esc(prefill || (mine[0] && mine[0].id) || "") + '" autocapitalize="characters"></div>' +
      '<div class="f"><label for="ckPh">전화번호 뒤 4자리</label><input id="ckPh" inputmode="numeric" maxlength="4" placeholder="1234"></div>' +
      '<div class="full submit-row"><button class="btn btn-primary" type="submit">예약 확인</button><span class="err" id="ckErr" role="alert"></span></div></form></section><div id="ckResult"></div></div>';
    $("#ckForm").onsubmit = function (e) { e.preventDefault(); lookup(); };
    function lookup(action) {
      var body = { id: $("#ckId").value.trim().toUpperCase(), last4: $("#ckPh").value.trim(), action: action };
      $("#ckErr").textContent = "";
      fetch("/api/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) { $("#ckErr").textContent = res.d.error || "찾지 못했어요."; $("#ckResult").innerHTML = ""; return; }
          var b = res.d.booking, canCancel = b.status === "requested" || b.status === "confirmed";
          $("#ckResult").innerHTML = '<section class="step"><h2 style="justify-content:space-between">' + esc(b.id) + ' <span class="status st-' + b.status + '">' + STATUS[b.status] + "</span></h2>" +
            '<dl style="display:grid;grid-template-columns:max-content 1fr;gap:8px 18px;margin:14px 0 0"><dt>상담 방식</dt><dd style="margin:0">' + esc(b.typeLabel) + "</dd><dt>일시</dt><dd style=\"margin:0\">" + fmtDate(b.date) + " " + esc(b.time) + '</dd><dt>학생</dt><dd style="margin:0">' + esc(b.studentName) + " (" + esc(b.school) + ")</dd></dl>" +
            (canCancel ? '<div class="submit-row" id="cxRow"><button class="btn btn-ghost" id="cxBtn">이 예약 취소하기</button><span class="hint" style="color:var(--muted);font-size:14px">시간을 바꾸려면 취소한 뒤 다시 신청하세요.</span></div>' : "") + "</section>";
          var cx = $("#cxBtn");
          if (cx) cx.onclick = function () {
            $("#cxRow").innerHTML = '<span style="font-weight:700">정말 취소할까요?</span><button class="btn btn-primary btn-small" id="cxYes">네, 취소합니다</button><button class="btn btn-ghost btn-small" id="cxNo">아니요</button>';
            $("#cxYes").onclick = function () { lookup("cancel"); toast("예약을 취소했어요."); };
            $("#cxNo").onclick = function () { lookup(); };
          };
        })
        .catch(function () { $("#ckErr").textContent = "인터넷 연결을 확인해 주세요."; });
    }
    if (prefill) $("#ckPh").focus();
  }

  route();
})();
