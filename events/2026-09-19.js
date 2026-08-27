// 会場・時間・タイムテーブル確定（タイムテーブルは 2026-08-27 の定例で承認）。
// 路地裏GarageMarket（南与野）では土曜はじめての開催。
// ※土曜の開催そのものは 2026-07-18（土）の浦和が最初。「土曜はじめて」と書かないこと。
// コマ割りの根拠は content/04_共通/SCHEDULE-PATTERNS.md §4。
//
// 子ども向け・大人向けとも公開済み（2026-08-27）。comingSoon は外し、JSON-LDにも追加済み。
//   子ども向け: https://gameschool.doorkeeper.jp/events/198775 （第15回）
//   大人向け:   https://gameschool.doorkeeper.jp/events/198874 （昼夜2回・1本にまとめる）
//
// 大人向け（②⑥）は 2026-08-27 に確定。
//   参加費 … PC持参2,900円 ／ PCレンタル付き3,500円
//   定員   … 2回合わせて8名（Doorkeeperの設定上、時間帯ごとに枠を切れないため）
// その1＝Googleコネクト／その2＝NotebookLM（2026-08-27 定例）。**内容が違う**ので
// 「同じ内容を2回・都合のよいほうを」とは書かない。選ぶ基準は時間ではなく中身
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-09-19",
  date: "2026年9月19日（土）",
  datetime: "2026年9月19日(土) 13:00-20:30",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅からも徒歩圏（ほぼ2駅の中間）",
  target: "①③④⑤: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ②⑥: 大人の方向け（保護者参加OK）",
  capacity: "①③④⑤各回4名 / ②⑥大人向けAIコース 2回合わせて8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198775?utm_source=lp&utm_medium=referral&utm_campaign=bromas",
  note: "<strong>路地裏GarageMarketでは土曜はじめての開催です。</strong>13:00〜20:30の通し開催ですが、<strong>受けたい回だけのお申し込みで大丈夫です。</strong><br />②⑥大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠）。<strong>昼（その1・Googleコネクト）と夜（その2・NotebookLM）で内容が違います。</strong>お子様にも同席いただけます。空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません。<br />⑤Robloxコース（プログラミングあり）は、<strong>体験会で基礎を覚えた方におすすめ</strong>の回です。はじめてのご参加なら①④をお選びください。",
  timetable: [
    { time: "13:00-14:00", label: "①Robloxコース", price: "1,900円" },
    { time: "14:00-14:20", label: "延長タイム・親御様個別相談" },
    { time: "14:20-14:30", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。
    // audience:"adult" は adults.html が大人向けの回を拾うための印（AGENTS.md 参照）。
    // 大人向け(198874)は 2026-08-27 に公開。その1・その2とも同じイベント（チケットで選ぶ）。
    // **その1とその2は内容が違う**（2026-08-27 定例）。「同じ内容」とは書かないこと
    {
      time: "14:30-15:30",
      label: "②大人向けAIコース（その1・Googleコネクト）　2,900円 / PCレンタル付き 3,500円",
      audience: "adult",
      adultPrice: "2,900円 ／ PCレンタル付き 3,500円",
      doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198874?utm_source=lp&utm_medium=referral&utm_campaign=bromas"
    },
    { time: "15:30-15:40", label: "設営・入れ替え" },
    { time: "15:40-16:10", label: "③AIコース", price: "900円" },
    { time: "16:10-16:50", label: "休憩" },
    { time: "16:50-17:50", label: "④Robloxコース", price: "1,900円" },
    { time: "17:50-18:10", label: "延長タイム・親御様個別相談" },
    { time: "18:10-18:20", label: "設営・入れ替え" },
    // ⑤は募集開始時点でプログラミングありに確定させる（9/13と同じ運用）。
    // 個別プランは公式LINEでご案内している方向けに充てる場合のみ差し替える
    { time: "18:20-19:20", label: "⑤Robloxコース（プログラミングあり）", price: "1,900円" },
    { time: "19:20-19:30", label: "設営・入れ替え" },
    {
      time: "19:30-20:30",
      label: "⑥大人向けAIコース（その2・NotebookLM）　2,900円 / PCレンタル付き 3,500円",
      audience: "adult",
      adultPrice: "2,900円 ／ PCレンタル付き 3,500円",
      doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198874?utm_source=lp&utm_medium=referral&utm_campaign=bromas"
    }
  ]
});
