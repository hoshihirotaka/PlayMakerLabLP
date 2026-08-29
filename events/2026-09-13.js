// 子ども向けは 2026-08-18 にDoorkeeperを公開し、受付開始。comingSoon を外しJSON-LDにも追加済み。
//   子ども向け: https://gameschool.doorkeeper.jp/events/198773 （第14回）★公開済み
//   大人向け:   https://gameschool.doorkeeper.jp/events/198774 ★**未公開**（参加費が未確定のため）
//
// ④は「基本はプログラミングあり／募集開始までに相談があれば個別プランに差し替え」の枠だったが、
// 募集を開始したので**プログラミングありで確定**。個別プランの行はDoorkeeperの公開ページにも
// 載っていないため、LPからも外してある（→ content/04_共通/SCHEDULE-PATTERNS.md §7）
// 日曜パターンの「派生案」で実施（大人向けAIを日中に置く形）。詳細は content/04_共通/SCHEDULE-PATTERNS.md §2
// Doorkeeperができたら comingSoon を消し、doorkeeperUrl を埋める。JSON-LDへの追加もそのタイミング
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-09-13",
  date: "2026年9月13日（日）",
  datetime: "2026年9月13日(日) 11:00-17:00",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅から徒歩14分（ほぼ2駅の中間）",
  target: "①③④: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ②: 大人の方向け（保護者参加OK）",
  capacity: "①③④各回4名 / ②大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198773",
  note: "②大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠）。お子様の①が終わったあとの時間帯なので、そのままご受講いただけます。<strong>②の時間帯は、お子様にも同席いただけます。</strong>空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません。<br />④Robloxコース（プログラミングあり）は、<strong>体験会で基礎を覚えた方におすすめ</strong>の回です。はじめてのご参加なら①③をお選びください。",
  timetable: [
    { time: "11:00-12:00", label: "①Robloxコース", price: "1,900円" },
    { time: "12:00-12:20", label: "延長タイム・親御様個別相談" },
    { time: "12:20-12:30", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。参加費が決まったら label に追記する
    // audience:"adult" は adults.html が拾うための印（AGENTS.md 参照）。
    // 大人向け(198774)は 2026-08-27 に公開。doorkeeperUrl を付けてある
    {
      time: "12:30-13:30",
      label: "②大人向けAIコース（仕事活用初心者向け）　2,900円 / PCレンタル付き 3,500円",
      audience: "adult",
      adultPrice: "2,900円 ／ PCレンタル付き 3,500円",
      doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198774"
    },
    { time: "13:30-14:30", label: "休憩" },
    { time: "14:30-15:30", label: "③Robloxコース", price: "1,900円" },
    { time: "15:30-15:50", label: "延長タイム・親御様個別相談" },
    { time: "15:50-16:00", label: "設営・入れ替え" },
    // ④は募集開始時点でプログラミングありに確定した（個別プランの相談がなかったため）。
    // Doorkeeperの公開ページにも個別プランの行はないので、ここも1行にしてある
    { time: "16:00-17:00", label: "④Robloxコース（プログラミングあり）", price: "1,900円" }
  ]
});
