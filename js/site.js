/*
  全ページ共通のスクリプト。
  以前は各HTMLに同じものを貼り付けていたが、6ページに増えて
  「同じ修正を6回する」状態になったため、2026-08-25 に1本にまとめた。
  読み込むのは body の末尾（DOMが揃ってから動かすため）。

  中身:
    ① ハンバーガーメニューの開閉
    ② doorkeeper_click（GA4）
    ③ 計測イベントの送信（nav_click / join_click ほか）
    ④ アンカー追従
*/

/* ① ハンバーガーメニュー */
(function () {
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    toggle.textContent = open ? "✕" : "☰";
  }

  toggle.addEventListener("click", function () {
    setOpen(!links.classList.contains("open"));
  });

  // リンクを選んだら閉じる
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setOpen(false);
  });

  // メニュー外をタップしたら閉じる
  document.addEventListener("click", function (e) {
    if (!links.classList.contains("open")) return;
    if (!links.contains(e.target) && e.target !== toggle) setOpen(false);
  });

  // PC幅に戻ったら開閉状態をリセット
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) setOpen(false);
  });
})();

/* ② doorkeeper_click */
document.addEventListener(
  "click",
  function (e) {
    var el = e.target;
    if (!el || typeof el.closest !== "function") return;
    var a = el.closest('a[href*="doorkeeper.jp"]');
    if (!a) return;
    // フッターのコミュニティリンクは申込ではないので除外する
    if (a.getAttribute("href").indexOf("/events/") === -1) return;
    if (typeof gtag === "function") gtag("event", "doorkeeper_click");
  },
  true
);

/* ③ 計測イベント */
(function () {
  function send(name, params) {
    if (typeof gtag === "function") gtag("event", name, params);
  }

  // ① ページ内リンク（ナビ6項目・ロゴ・本文中のリンク・受付準備中の固定CTA）
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== "function") return;
      var a = el.closest('a[href^="#"]');
      if (!a) return;
      // schedule_click を onclick で送っているCTAは二重計測になるので除く
      if (a.hasAttribute("onclick")) return;

      var hash = a.getAttribute("href").slice(1);
      if (hash === "join") {
        send("join_click");
        return;
      }

      var item;
      if (a.id === "fixed-cta-link") item = "fixed_cta"; // 受付準備中のときだけ #schedule になる
      else if (a.classList.contains("nav-logo")) item = "top";
      else if (a.closest(".nav")) item = hash;
      else if (a.closest("#event-more")) item = hash; // 「このあとの開催」の日付
      else item = hash + "_inline"; // 本文中のページ内リンク
      send("nav_click", { click_item: item });
    },
    true
  );

  // ② ハンバーガー。開閉スクリプトより後にこのリスナーを登録しているので、
  //    ここが動く時点では aria-expanded が新しい状態に更新済み。
  //    （この2つのscriptの前後を入れ替えると open/close が逆になる）
  var toggle = document.getElementById("nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var opened = toggle.getAttribute("aria-expanded") === "true";
      send("nav_click", { click_item: opened ? "menu_open" : "menu_close" });
    });
  }

  // ③ カリキュラムのタブ（すべて / Robloxコース / AIコース）。
  //    どちらのコースが見られているかは広告クリエイティブの判断に直結する。
  var tabs = document.getElementById("curriTabs");
  if (tabs) {
    tabs.addEventListener("click", function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== "function") return;
      var btn = el.closest(".curri-tab");
      if (!btn) return;
      send("curriculum_tab", { click_item: btn.getAttribute("data-filter") });
    });
  }

  // ④ コミュニティ登録（Doorkeeperのトップ）。申込ではなくリード獲得なので
  //    doorkeeper_click とは分ける。上のデリゲートは /events/ を含むものしか
  //    拾わず、拡張計測の離脱クリックもクロスドメイン設定で止まっているため、
  //    このボタンだけ1件も記録されていなかった。
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== "function") return;
      var a = el.closest('a[href*="doorkeeper.jp"]');
      if (!a) return;
      if (a.getAttribute("href").indexOf("/events/") !== -1) return;
      send("community_click");
    },
    true
  );

  // ⑤ サイト内の別ページ（legal/ の4書面）。同一ドメインなので拡張計測の
  //    離脱クリックは対象外、`#` リンクでもないため④までのどれにも入らず、
  //    イベントが1つも出ないまま別タブではなく同じタブで移動していた。
  //    滞在時間はイベントに便乗して送られるので、押した人の時間が丸ごと
  //    消えていた（離脱時の user_engagement は間に合わないことがある）。
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== "function") return;
      var a = el.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href");
      // 相対パスの .html だけを拾う。`#` リンク・外部リンク・mailto は
      // ①〜④または拡張計測が扱うので、ここで二重に拾わない。
      if (!href || !/^[^#/][^:]*\.html([?#]|$)/.test(href)) return;
      send("nav_click", {
        click_item: href.replace(/[?#].*$/, "").replace(/\.html$/, "")
      });
    },
    true
  );

  // ⑥ Metaへの申込クリック。Meta側の帰属（クリック・ビュースルー）で
  //    どのクリエイティブが申込意図を生んだかを見るため。
  //    doorkeeper_click のデリゲートには触らず、同じ条件で別に拾う。
  //    ⚠️ これを広告の最適化目標にしないこと（件数が学習に足りない）。
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target;
      if (!el || typeof el.closest !== "function") return;
      var a = el.closest('a[href*="doorkeeper.jp"]');
      if (!a) return;
      if (a.getAttribute("href").indexOf("/events/") === -1) return;
      if (typeof fbq === "function") fbq("trackCustom", "DoorkeeperClick");
    },
    true
  );
})();

/* ④ アンカー追従 */
(function () {
  var userMoved = false;
  var ro = null;
  var timer = null;

  function markMoved() { userMoved = true; }

  // 「指が触れた」ではなく「実際にスクロールした」ときだけ追従を止める。
  // touchstart だと、ハンバーガーやリンクをタップしただけで補正が無効になり、
  // モバイル（流入の9割以上）でこの仕組みが働かなくなる。
  var opts = { passive: true };
  window.addEventListener("wheel", markMoved, opts);
  window.addEventListener("touchmove", markMoved, opts);
  window.addEventListener("keydown", markMoved);

  // 追従先は「今のURLのハッシュ」を毎回読み直す。読み込み時の値を握ったままだと、
  // 監視中にナビで移動したとき元の位置へ引き戻してしまう。
  function jump() {
    if (userMoved) return;
    var h = location.hash;
    if (!h || h.length < 2) return;
    var el;
    try {
      el = document.querySelector(h);
    } catch (e) {
      return; // 不正なセレクタ
    }
    if (el) el.scrollIntoView();
  }

  // 指定時間だけ、高さの変化に追従する
  function follow(ms) {
    userMoved = false;
    if (ro) { ro.disconnect(); ro = null; }
    if (timer) clearTimeout(timer);

    jump();

    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(function () { jump(); });
      ro.observe(document.body);
      timer = setTimeout(function () {
        if (ro) { ro.disconnect(); ro = null; }
      }, ms);
    } else {
      setTimeout(jump, 700);
      setTimeout(jump, 2500);
    }
  }

  // ① ハッシュ付きで開いたとき（広告・LINEからの流入）
  if (location.hash && location.hash.length > 1) {
    follow(5000);
    window.addEventListener("load", jump);
  }

  // ② ページ内リンクを押したとき／ブラウザの戻る・進む。
  //    以前は①だけだったため、ハッシュなしで開いてナビをタップした場合は
  //    補正が一切かからなかった（報告のあった症状の条件そのもの）。
  window.addEventListener("hashchange", function () { follow(3000); });
})();
