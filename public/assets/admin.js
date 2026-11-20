/* 예당고 진로 내비 — 상담 관리 화면 */
(function () {
  "use strict";
  var app = document.getElementById("app"), top = document.getElementById("topActs");
  var token = null; try { token = sessionStorage.getItem("yd_admin"); } catch (e) {}
  var data = [], avail = null, tab = "list";
  var filt = { status: "active", range: "upcoming", q: "" };
  var STATUS = { requested: "접수됨", confirmed: "확정", done: "완료", cancelled: "취소", noshow: "불참" };
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(d) { var x = new Date(d + "T00:00:00"); return (x.getMonth() + 1) + "월 " + x.getDate() + "일 (" + DOW[x.getDay()] + ")"; }
  function addMin(t, m) { var p = t.split(":").map(Number), v = p[0] * 60 + p[1] + m; return String(Math.floor(v / 60)).padStart(2, "0") + ":" + String(v % 60).padStart(2, "0"); }
  function today() { var n = new Date(Date.now() + 9 * 3600e3); return n.toISOString().slice(0, 10); }
  function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200); }
  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ "Content-Type": "application/json", Authorization: "Bearer " + token }, opts.headers || {});
    return fetch(path, opts).then(function (r) {
      return r.json().then(function (d) {
        if (r.status === 401) { logout(); throw new Error(d.error || "다시 로그인해 주세요."); }
        if (!r.ok) throw new Error(d.error || "오류가 생겼습니다.");
        return d;
      });
    });
  }
  function logout() { token = null; try { sessionStorage.removeItem("yd_admin"); } catch (e) {} login(); }

  function login() {
    top.innerHTML = "";
    app.innerHTML = '<div class="login step"><h2 style="margin:0 0 6px;color:var(--pine)">관리자 로그인</h2><p style="color:var(--muted);margin:0 0 18px;font-size:15px">상담 신청 목록과 일정을 관리합니다.</p>' +
      '<form id="lf" class="form" style="grid-template-columns:1fr"><div class="f"><label for="pw">비밀번호</label><input id="pw" type="password" autocomplete="current-password"></div>' +
      '<div class="submit-row" style="margin-top:6px"><button class="btn btn-primary" type="submit">로그인</button><span class="err" id="le" role="alert"></span></div></form></div>';
    document.getElementById("pw").focus();
    document.getElementById("lf").onsubmit = function (e) {
      e.preventDefault();
      fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: document.getElementById("pw").value }) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) { document.getElementById("le").textContent = res.d.error; return; }
          token = res.d.token; try { sessionStorage.setItem("yd_admin", token); } catch (e) {}
          load();
        });
    };
  }

  function load() {
    top.innerHTML = '<button class="btn btn-ghost btn-small" id="rf">새로고침</button><button class="btn btn-ghost btn-small" id="lo">로그아웃</button>';
    document.getElementById("rf").onclick = load;
    document.getElementById("lo").onclick = logout;
    app.innerHTML = '<p class="empty-box" style="margin-top:28px">불러오는 중…</p>';
    Promise.all([api("/api/admin/bookings"), fetch("/api/availability").then(function (r) { return r.json(); })])
      .then(function (r) { data = r[0].bookings || []; avail = r[1]; render(); })
      .catch(function (e) { app.innerHTML = '<p class="empty-box" style="margin-top:28px">' + esc(e.message) + "</p>"; });
  }

  function render() {
    var active = data.filter(function (b) { return b.status !== "cancelled"; });
    var up = active.filter(function (b) { return b.date >= today(); });
    app.innerHTML = '<div class="tabs" role="tablist"><button role="tab" data-t="list" aria-selected="' + (tab === "list") + '">신청 목록</button><button role="tab" data-t="sched" aria-selected="' + (tab === "sched") + '">상담 일정 관리</button></div>' +
      '<div class="stats"><div class="stat"><b>' + up.length + '</b><span>앞으로 있을 상담</span></div><div class="stat"><b>' + up.filter(function (b) { return b.status === "requested"; }).length + '</b><span>확인 필요(접수됨)</span></div><div class="stat"><b>' + active.filter(function (b) { return b.type === "family"; }).length + '</b><span>학부모 동반</span></div><div class="stat"><b>' + data.length + "</b><span>전체 신청(취소 포함)</span></div></div>" +
      '<div id="body"></div>';
    Array.prototype.forEach.call(app.querySelectorAll(".tabs button"), function (b) { b.onclick = function () { tab = b.dataset.t; render(); }; });
    if (tab === "list") renderList(); else renderSched();
  }

  function renderList() {
    var body = document.getElementById("body");
    var rows = data.filter(function (b) {
      if (filt.status === "active" && (b.status === "cancelled")) return false;
      if (filt.status !== "active" && filt.status !== "all" && b.status !== filt.status) return false;
      if (filt.range === "upcoming" && b.date < today()) return false;
      if (filt.q) { var s = [b.id, b.studentName, b.school, b.parentName, b.career, b.studentPhone, b.parentPhone].join(" "); if (s.indexOf(filt.q) < 0) return false; }
      return true;
    });
    var html = '<div class="filters">' +
      '<div class="f"><label for="fs">상태</label><select id="fs"><option value="active">취소 제외</option><option value="requested">접수됨</option><option value="confirmed">확정</option><option value="done">완료</option><option value="noshow">불참</option><option value="cancelled">취소</option><option value="all">전체</option></select></div>' +
      '<div class="f"><label for="fr">기간</label><select id="fr"><option value="upcoming">오늘 이후</option><option value="all">전체 기간</option></select></div>' +
      '<div class="f" style="flex:1"><label for="fq">검색</label><input id="fq" placeholder="이름, 학교, 예약번호, 전화번호" value="' + esc(filt.q) + '"></div>' +
      '<button class="btn btn-primary btn-small" id="csv">CSV 내려받기</button></div>';
    if (!rows.length) html += '<p class="empty-box">조건에 맞는 신청이 없습니다.</p>';
    var last = "";
    rows.forEach(function (b) {
      if (b.date !== last) { html += '<div class="day-head">' + fmt(b.date) + "</div>"; last = b.date; }
      html += '<div class="bk ' + b.status + '" data-id="' + b.id + '"><div class="tm">' + esc(b.time) + "<small>~" + addMin(b.time, b.minutes) + " · " + esc(b.typeLabel) + "</small></div>" +
        "<div><h4>" + esc(b.studentName) + ' <span style="font-weight:500;color:var(--muted);font-size:14px">' + esc(b.school) + " " + esc(b.grade) + '</span> <span class="status st-' + b.status + '">' + STATUS[b.status] + "</span></h4>" +
        '<div class="meta">' + esc(b.id) + " · 학생 " + esc(b.studentPhone || "-") + (b.parentName || b.parentPhone ? " · 보호자 " + esc(b.parentName) + "(" + esc(b.parentRelation) + ") " + esc(b.parentPhone) : "") + "</div>" +
        '<div class="meta">관심 진로: ' + esc(b.career || "-") + "</div>" +
        (b.topics && b.topics.length ? '<div class="tags">' + b.topics.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") +
        (b.message ? '<div class="msg">' + esc(b.message) + "</div>" : "") +
        '<textarea class="memo" placeholder="관리자 메모 (학생에게 보이지 않음)">' + esc(b.adminMemo || "") + "</textarea></div>" +
        '<div class="acts"><label class="sr" for="st-' + b.id + '">상태</label><select id="st-' + b.id + '" class="st">' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (k === b.status ? " selected" : "") + ">" + STATUS[k] + "</option>"; }).join("") + "</select>" +
        '<button class="btn btn-primary btn-small save">저장</button><span style="font-size:12px;color:var(--muted)">신청 ' + new Date(b.createdAt).toLocaleString("ko-KR") + "</span></div></div>";
    });
    body.innerHTML = html;
    document.getElementById("fs").value = filt.status;
    document.getElementById("fr").value = filt.range;
    document.getElementById("fs").onchange = function () { filt.status = this.value; renderList(); };
    document.getElementById("fr").onchange = function () { filt.range = this.value; renderList(); };
    var fq = document.getElementById("fq");
    fq.oninput = function () { filt.q = this.value.trim(); clearTimeout(fq._t); fq._t = setTimeout(function () { renderList(); var n = document.getElementById("fq"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 300); };
    document.getElementById("csv").onclick = function () { csv(rows); };
    Array.prototype.forEach.call(body.querySelectorAll(".bk"), function (el) {
      el.querySelector(".save").onclick = function () {
        var btn = this; btn.disabled = true;
        api("/api/admin/bookings", { method: "POST", body: JSON.stringify({ id: el.dataset.id, status: el.querySelector(".st").value, adminMemo: el.querySelector(".memo").value }) })
          .then(function (d) { var i = data.findIndex(function (x) { return x.id === d.booking.id; }); data[i] = d.booking; toast("저장했습니다."); render(); })
          .catch(function (e) { toast(e.message); btn.disabled = false; });
      };
    });
  }

  function csv(rows) {
    function c(v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }
    var head = ["예약번호", "상태", "상담방식", "날짜", "시작", "끝", "학생", "학교", "학년", "학생연락처", "보호자", "관계", "보호자연락처", "관심진로", "상담내용", "남긴 말", "관리자메모", "신청시각"];
    var out = [head.map(c).join(",")];
    rows.forEach(function (b) { out.push([b.id, STATUS[b.status], b.typeLabel, b.date, b.time, addMin(b.time, b.minutes), b.studentName, b.school, b.grade, b.studentPhone, b.parentName, b.parentRelation, b.parentPhone, b.career, (b.topics || []).join("/"), b.message, b.adminMemo, new Date(b.createdAt).toLocaleString("ko-KR")].map(c).join(",")); });
    var blob = new Blob(["﻿" + out.join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "예당고_상담신청_" + today() + ".csv"; document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 200);
  }

  function renderSched() {
    var body = document.getElementById("body");
    var byKey = {}; data.forEach(function (b) { if (b.status !== "cancelled") (b.slots || []).forEach(function (p) { byKey[p.replace("slots/", "").replace(".json", "")] = b; }); });
    var html = '<p class="sub" style="margin:0 0 12px">시간을 누르면 그 시간만 막거나 엽니다. 오른쪽 버튼으로 하루 전체를 막을 수 있어요. 예약된 시간(초록)은 신청 목록에서 취소해야 비워집니다.</p>';
    avail.days.forEach(function (d) {
      if (!d.slots.length) return;
      var dayBlocked = d.closed && d.reason === "휴무";
      html += '<div class="sched-day' + (dayBlocked ? " off" : "") + '"><div class="d">' + fmt(d.date) + "</div><div class=\"sl\">" + d.slots.map(function (s) {
        var key = d.date + "_" + s.time.replace(":", ""), b = byKey[key];
        if (b) return '<button class="taken" title="' + esc(b.studentName) + '" disabled>' + s.time + " " + esc(b.studentName) + "</button>";
        return '<button data-slot="' + key + '" class="' + (s.status === "blocked" ? "blocked" : "") + '" aria-pressed="' + (s.status === "blocked") + '">' + s.time + "</button>";
      }).join("") + '</div><button class="btn btn-ghost btn-small" data-date="' + d.date + '" data-on="' + dayBlocked + '">' + (dayBlocked ? "하루 다시 열기" : "하루 막기") + "</button></div>";
    });
    body.innerHTML = html;
    Array.prototype.forEach.call(body.querySelectorAll("[data-slot]"), function (b) {
      b.onclick = function () { setBlock("slot", b.dataset.slot, !b.classList.contains("blocked")); };
    });
    Array.prototype.forEach.call(body.querySelectorAll("[data-date]"), function (b) {
      b.onclick = function () { setBlock("date", b.dataset.date, b.dataset.on !== "true"); };
    });
  }
  function setBlock(kind, key, blocked) {
    api("/api/admin/blocks", { method: "POST", body: JSON.stringify({ kind: kind, key: key, blocked: blocked }) })
      .then(function () { return fetch("/api/availability").then(function (r) { return r.json(); }); })
      .then(function (a) { avail = a; renderSched(); toast(blocked ? "막았습니다." : "다시 열었습니다."); })
      .catch(function (e) { toast(e.message); });
  }

  if (token) load(); else login();
})();
