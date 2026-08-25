/*
  カリキュラムの描画。curriculum/curriculum.js が定義した
  window.CURRICULUM を読む。読み込むのはそのデータファイルより後。

  中身:
    ① 教材カードとタブ（curriculum.html の #curriGrid）
    ② 件数の要約（index.html の #curriSummary）

  どちらも対象の要素が無ければ何もしないので、両方のページで同じものを読み込める。
  件数を手で書かないのは、教材を足したときに必ずズレるため。
*/

/* ① 教材カードとタブ */
(function () {
  var grid = document.getElementById("curriGrid");
  var tabs = document.getElementById("curriTabs");
  if (!grid || !tabs) return;

  var TAG_CLASS = {
    "体験用": "tag-taiken",
    "プログラミング": "tag-program",
    "クリエイティブ": "tag-creative"
  };
  var materials = [];
  var currentFilter = "all";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function sessionsText(v) {
    if (typeof v === "number") return "📚 全" + v + "回";
    if (v == null || v === "") return "";
    if (v === "未定") return "📚 コマ数未定";
    return "📚 " + v;
  }

  function cardHtml(m) {
    var badges = '<span class="curri-badge subject">' + esc(m.subject) + "コース</span>";
    (m.tags || []).forEach(function (t) {
      badges += '<span class="curri-badge ' + (TAG_CLASS[t] || "") + '">' + esc(t) + "</span>";
    });
    if (m.status === "coming_soon") {
      badges += '<span class="curri-badge soon">準備中</span>';
    } else if (m.status === "on_request") {
      badges += '<span class="curri-badge request">要相談</span>';
    }
    var sess = sessionsText(m.sessions);
    var sessHtml = sess ? '<div class="curri-sessions">' + esc(sess) + "</div>" : "";
    var ageHtml = m.ageNote ? '<div class="curri-age">👤 ' + esc(m.ageNote) + "</div>" : "";
    var detailHtml = m.detail
      ? '<details class="curri-detail"><summary></summary><p>' + esc(m.detail) + "</p></details>"
      : "";
    var icon = m.icon ? '<div class="curri-icon">' + esc(m.icon) + "</div>" : "";
    return (
      '<div class="curri-card' + (m.status === "coming_soon" ? " soon" : "") + '">' +
      icon +
      '<div class="curri-title">' + esc(m.name) + "</div>" +
      '<div class="curri-badges">' + badges + "</div>" +
      (m.summary ? '<p class="curri-desc">' + esc(m.summary) + "</p>" : "") +
      sessHtml +
      ageHtml +
      detailHtml +
      "</div>"
    );
  }

  function render() {
    var list = materials.filter(function (m) {
      return currentFilter === "all" || m.subject === currentFilter;
    });
    grid.innerHTML = list.length
      ? list.map(cardHtml).join("")
      : '<p class="curri-loading">該当する教材がありません。</p>';
  }

  tabs.addEventListener("click", function (e) {
    var btn = e.target.closest(".curri-tab");
    if (!btn) return;
    currentFilter = btn.getAttribute("data-filter");
    Array.prototype.forEach.call(tabs.querySelectorAll(".curri-tab"), function (b) {
      b.classList.toggle("is-active", b === btn);
    });
    render();
  });

  function load(data) {
    materials = (data && data.materials) || [];
    var order = { published: 0, on_request: 1, coming_soon: 2 };
    materials.sort(function (a, b) {
      return (order[a.status] || 0) - (order[b.status] || 0);
    });
    render();
  }

  // curriculum/curriculum.js が window.CURRICULUM を定義（file://でも動く）。
  // 万一未読み込みなら http 経由で JSON を fetch する。
  if (window.CURRICULUM) {
    load(window.CURRICULUM);
  } else {
    fetch("curriculum/curriculum.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(load)
      .catch(function () {
        grid.innerHTML = '<p class="curri-loading">カリキュラムを読み込めませんでした。</p>';
      });
  }
})();

/* ② 件数の要約 */
// カリキュラムの件数だけをここで数えて出す。カード一覧は curriculum.html にある。
//
// 数字を手で書かないのは、教材を足したときに必ずズレるため。
// curriculum/curriculum.js が唯一の出どころ（source of truth）。
// 読み込みに失敗した場合はHTML側の文章（数字なし）がそのまま残るので、
// 古い数字が表示されることはない。
(function () {
  var el = document.getElementById("curriSummary");
  var data = window.CURRICULUM && window.CURRICULUM.materials;
  if (!el || !data || !data.length) return;

  function countBy(pick) {
    var o = {};
    data.forEach(function (m) {
      [].concat(pick(m)).filter(Boolean).forEach(function (v) { o[v] = (o[v] || 0) + 1; });
    });
    return o;
  }
  var bySubject = countBy(function (m) { return m.subject; });
  var byTag = countBy(function (m) { return m.tags; });

  var courses = Object.keys(bySubject)
    .map(function (k) { return k + "コース " + bySubject[k] + "種"; })
    .join("・");
  var tags = ["体験用", "プログラミング", "クリエイティブ"]
    .filter(function (t) { return byTag[t]; })
    .map(function (t) { return t + " " + byTag[t]; })
    .join(" ｜ ");

  el.innerHTML =
    "<strong>" + courses + "</strong>、合わせて <strong>" + data.length + "</strong> の教材があります。" +
    (tags ? '<br /><span class="curri-summary-tags">' + tags + "</span>" : "");
})();
