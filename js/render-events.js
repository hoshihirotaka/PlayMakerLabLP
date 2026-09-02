/*
  開催日程の描画。index.html / schedule.html / adults.html が共有する。
  events/*.js が定義した window.EVENTS を読んで #event-list に書き出す。

  出し分けは #event-list の属性だけで行う（スクリプトは1本）:
    data-limit="1"          直近1件だけ出す（index.html）
    属性なし                全件出す（index.html以外の既定）
    data-compact            1回1行の簡素表示にする（schedule.html）
    data-audience="adult"   大人向けの枠がある回だけ、大人向けの行だけ出す（adults.html）

  ページごとにコードを分けると、片方だけ直して食い違う事故が起きるため
  1本に寄せてある。読み込むのは events/*.js より後。
*/
(function () {
  var list = document.getElementById("event-list");
  if (!list || !window.EVENTS || !window.EVENTS.length) return;

  // トップは直近1件だけ、日程ページは全件。
  // 出し分けは #event-list の data-limit で行う（スクリプトは1本を共有する）。
  var limit = parseInt(list.getAttribute("data-limit") || "0", 10);

  // data-audience="adult" のときは、大人向けの枠がある回だけを対象にし、
  // タイムテーブルも大人向けの行だけを出す。
  // 判定は timetable の audience プロパティ。ラベルの文言では判定しない
  // （文言を書き換えたときに黙って壊れるため）。
  var audience = list.getAttribute("data-audience") || "";

  // 申込ボタンの上に出す「誰向けか」のラベル。
  // トップは大人向け・お子様向けの両方の入口なので、
  // ボタンだけ見て別のイベントに申し込んでしまうのを防ぐ。
  // Doorkeeperが説明を引き受けている今は、これで足りる。
  // Stripeへ移行したら決済画面は何も説明しないので、
  // そのときは schedule.html 側で読ませる設計に変える（申込導線の移行方針）。
  var audienceLabel = audience === "adult" ? "大人向け" : "お子様向け";
  // data-compact のときは、1回を数行にまとめた簡素表示にする。
  // 時間割・対象・定員・持ち物はDoorkeeper側に同じものがあるため出さない
  // （日程ページに来るのは「調べている人」で、申込の詳細は次の画面で足りる）。
  var compact = list.hasAttribute("data-compact");

  // 参加費の1行サマリー。金額は events/*.js だけを見て組み立てる。
  // ⚠️ ここに金額を書かないこと。10月の改定は events/*.js を直せば追従する。
  //   子ども向け … timetable の price（構造化されている）
  //   大人向け   … price を持たない（バッジを付けないため）。label 内の金額を読む
  function priceSummary(e) {
    var seen = {};
    var out = [];
    (e.timetable || []).forEach(function (t) {
      var yen = (t.label || "").match(/[0-9,]+円/g) || [];
      var price = t.price || yen[0];
      if (!price) return;                      // 休憩・設営・延長タイムなど
      // 「①Robloxコース（プログラミングあり）　2,900円 / …」→「Robloxコース」
      var name = (t.label || "")
        .replace(/^[\u2460-\u2473]/, "")
        .split(/[（\u3000]/)[0]
        .trim();
      if (!name || seen[name]) return;
      seen[name] = true;
      // 金額が複数書いてある枠（PCレンタル付きなど）は「〜」を添える
      out.push(name + " " + price + (t.price ? "" : (yen.length > 1 ? "〜" : "")));
    });
    return out.join("　／　");
  }

  function slotsFor(e) {
    if (!audience) return e.timetable || [];
    return (e.timetable || []).filter(function (t) { return t.audience === audience; });
  }

  var events = window.EVENTS.slice()
    .filter(function (e) { return slotsFor(e).length > 0; })
    .sort(function (a, b) { return a.id.localeCompare(b.id); });

  if (!events.length) {
    list.innerHTML = '<p class="curri-loading">次回の開催が決まりましたら、こちらでお知らせします。</p>';
    return;
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var openIndex = -1;
  var nextEvent = null;

  for (var j = 0; j < events.length; j++) {
    var d = new Date(events[j].id + "T00:00:00+09:00");
    if (!isNaN(d.getTime()) && d >= today) {
      openIndex = j;
      nextEvent = events[j];
      break;
    }
  }
  if (openIndex === -1) {
    openIndex = events.length - 1;
  }

  // data-limit があれば、直近の回から指定件数だけ描く。
  var visible = events;
  var openAt = openIndex;
  if (limit > 0) {
    visible = events.slice(openIndex, openIndex + limit);
    openAt = 0;
  }

  list.innerHTML = visible.map(function (ev, i) {
    var locationText = (ev.location || "").trim();
    var areaText = (ev.area || "").trim();

    // 簡素表示。開閉せず、1回ぶんを数行で出す。
    if (compact) {
      var cApply = ev.comingSoon ? null : ev.doorkeeperUrl;
      var cPrice = priceSummary(ev);
      return (
        '<div class="event-row" id="event-' + ev.id + '">' +
          '<div class="event-row-main">' +
            '<div class="event-row-item"><span>開催日</span><span>' + ev.datetime + "</span></div>" +
            '<div class="event-row-item"><span>会場</span><span>' + locationText + "（" + areaText + "）</span></div>" +
            (cPrice
              ? '<div class="event-row-item"><span>参加費</span><span>' + cPrice +
                  '<span class="price-badge">今だけお試し価格</span></span></div>'
              : "") +
          "</div>" +
          (cApply
            ? '<a class="event-apply" href="' + cApply + '" target="_blank" rel="noreferrer">お申し込みはこちら</a>'
            : '<span class="event-apply event-apply--soon">申込受付準備中</span>') +
        "</div>"
      );
    }
    var timetableRows = slotsFor(ev).map(function (t) {
      var price = t.price ? '<span class="timeline-price">' + t.price + '</span><span class="price-badge">今だけお試し価格</span>' : "";
      return (
        '<div class="timeline-item">' +
          '<div class="timeline-time">' + t.time + "</div>" +
          '<div class="timeline-body">' + t.label + price + "</div>" +
        "</div>"
      );
    }).join("");
    // note はお子様向けページの文脈で書かれているため、audience 指定時は出さない。
    // data-limit のページ（トップの直近1件）でも出さない。
    // note の中身は大人向けの案内・参加条件が中心で、いまは adults.html にある。
    // トップに置くと342px使ううえ、お子様向けの回の説明として読まれてしまう。
    var noteBlock = (!audience && !limit && ev.note) ? '<div class="event-note">' + ev.note + "</div>" : "";

    // 申込先。audience 指定時はその枠の doorkeeperUrl を使う。
    // イベント側の doorkeeperUrl はお子様向けの申込先なので、
    // 大人向けページでそれを出すと別のイベントへ送ってしまう。
    var slot = slotsFor(ev)[0] || {};
    var applyUrl = audience ? slot.doorkeeperUrl : (ev.comingSoon ? null : ev.doorkeeperUrl);
    // トップ（data-limit のページ）は、お子様向けと大人向けの両方の入口。
    // このカードのタイムテーブルには大人向けの枠も出るため、ここで
    // お子様向けの申込へ直結させると、大人の方が別のイベントに申し込んでしまう。
    // 直結させるのは、どちらか選んだあとのページ（schedule.html / adults.html）だけ。
    // 申込ボタン。トップ（data-limit）でも直近回のDoorkeeperへ直行する。
    // 一度「日程一覧へ送る」形にしたが、申込までの手数を増やさない方針に戻した
    // （2026-08-25 本人の判断）。取り違え対策は文言（体験会／講座）と、
    // 日程セクション下の大人向け案内（.notice）で行う。
    var applyBlock = applyUrl
      ? '<div class="apply-block">' +
          '<span class="apply-label">' + audienceLabel + '</span>' +
          '<a class="event-apply" href="' + applyUrl + '" target="_blank" rel="noreferrer">このイベントに申し込む</a>' +
        '</div>'
      : '<span class="event-apply event-apply--soon">申込受付準備中</span>';

    return (
      '<details class="event-detail" id="event-' + ev.id + '"' + (i === openIndex ? " open" : "") + ">" +
        '<summary class="event-summary">' +
          '<span class="event-date-badge">' + ev.date + "</span>" +
          '<span class="event-location-label">' + locationText + "（" + areaText + "）</span>" +
        "</summary>" +
        '<div class="event-body">' +
          '<div class="grid-2">' +
            '<div class="info"><strong>日時</strong>' + ev.datetime + "</div>" +
            '<div class="info"><strong>場所</strong>' + ev.location + "<br />" + ev.address + (ev.access ? "<br />" + ev.access : "") + "</div>" +
            '<div class="info"><strong>対象</strong>' + ev.target + "</div>" +
            '<div class="info"><strong>定員</strong>' + ev.capacity + "</div>" +
            '<div class="info"><strong>持ち物</strong>' + ev.equipment + "</div>" +
          "</div>" +
          "<div>" +
            '<h3 class="timeline-heading">タイムテーブル</h3>' +
            '<div class="timeline">' + timetableRows + "</div>" +
          "</div>" +
          noteBlock +
          applyBlock +
        "</div>" +
      "</details>"
    );
  }).join("");

  // 「このあとの開催」。開いているカードはモバイルで約2.5画面あり、
  // 以降の日程は畳まれていても画面外に押し出される（実測 375px 幅で
  // 次の日付まで約1,500px下）。日程が合わなかった人に次を見せるのが
  // comingSoon の目的なので、見出しの直下に一覧を出しておく。
  // アンカー(#event-YYYY-MM-DD)にしているので、クリックの計測は
  // 既存の nav_click デリゲートがそのまま拾う。
  var more = compact ? null : document.getElementById("event-more");
  if (more) {
    var rest = events.slice(openIndex + 1);
    if (rest.length) {
      var isSoon = function (ev) { return !!ev.comingSoon || !ev.doorkeeperUrl; };
      // 全部が調整中なら末尾に1行添えるだけで足りる。混在しているときは
      // どれが申し込めるのか分からないと意味がないので、個別に印を付ける。
      var allSoon = rest.every(isSoon);
      var links = rest.map(function (ev) {
        var md = ev.id.split("-");
        var dayMatch = ev.date.match(/（(.+?)）/);
        var label =
          parseInt(md[1], 10) + "/" + parseInt(md[2], 10) +
          (dayMatch ? "（" + dayMatch[1] + "）" : "");
        var soon = !allSoon && isSoon(ev);
        return (
          '<a href="#event-' + ev.id + '"' + (soon ? ' class="is-soon"' : "") + ">" +
            label +
            (soon ? '<span class="event-more-soon">調整中</span>' : "") +
          "</a>"
        );
      }).join("");
      more.innerHTML =
        "<span>このあとの開催:</span>" + links +
        (allSoon ? '<span class="event-more-note">日時・参加費は調整中です。</span>' : "");

      // 飛んだ先が畳まれていると中身が見えないので開いておく。
      // 高さが変わるぶんは末尾のアンカー追従スクリプトが吸収する。
      more.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("a[href^='#event-']");
        if (!a) return;
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (target) target.open = true;
      });
    }
  }

  if (nextEvent) {
    var heroNext = document.getElementById("hero-next");
    if (heroNext) {
      heroNext.textContent = "次回開催: " + nextEvent.date + "｜" + nextEvent.area;
      heroNext.classList.add("show");
    }

    var fixedCta = document.getElementById("fixed-cta");
    var fixedCtaLink = document.getElementById("fixed-cta-link");
    if (fixedCta && fixedCtaLink) {
      var md = nextEvent.id.split("-");
      var dayMatch = nextEvent.date.match(/（(.+?)）/);
      var shortDate = parseInt(md[1], 10) + "/" + parseInt(md[2], 10) + (dayMatch ? "（" + dayMatch[1] + "）" : "");

      // 申込先は audience に合わせる。
      // ⚠️ ここでイベント側の doorkeeperUrl をそのまま使うと、大人向けページの
      //    固定CTAが子ども向けイベントへ送ってしまう。
      //    2026-08-25 に本番で発生（198459＝子ども向けを指し、文言も「体験会に申し込む」だった）。
      //    アコーディオン内の申込ボタンは直したのに、ここを直し忘れていた。
      var nextSlot = slotsFor(nextEvent)[0] || {};
      var ctaUrl = audience ? nextSlot.doorkeeperUrl : (nextEvent.comingSoon ? null : nextEvent.doorkeeperUrl);

      if (!ctaUrl) {
        // 受付前。外部リンクにせず、そのページの日程セクションへスクロールさせる。
        fixedCtaLink.textContent = shortDate + " 開催予定・受付準備中";
        fixedCtaLink.href = "#" + ((list.closest("section") || {}).id || "schedule");
        fixedCtaLink.removeAttribute("target");
        fixedCtaLink.removeAttribute("rel");
      } else {
        fixedCtaLink.textContent = shortDate + (audience ? " 講座に申し込む" : " イベントに申し込む");
        fixedCtaLink.href = ctaUrl;
        fixedCtaLink.target = "_blank";
        fixedCtaLink.rel = "noreferrer";

        // 申込へ直行するときだけ、誰向けかを添える。
        // 「日程を見る」だけのときは不要（次の画面で分かるため）。
        if (!fixedCta.querySelector(".fixed-cta-label")) {
          var lab = document.createElement("span");
          lab.className = "fixed-cta-label";
          lab.textContent = audienceLabel;
          fixedCta.insertBefore(lab, fixedCtaLink);
        }
      }
      fixedCta.classList.add("show");
      document.body.classList.add("has-fixed-cta");
    }
  }
})();
