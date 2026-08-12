// 日程・時間確定（2026-08-12）。Doorkeeperのイベントは作成済みだが**未公開で申し込みができない**ため
// comingSoon: true のまま。公開されたら comingSoon を外し doorkeeperUrl とJSON-LDを埋める
//   子ども向け: https://gameschool.doorkeeper.jp/events/198773 （第14回）
//   大人向け:   https://gameschool.doorkeeper.jp/events/198774 （はじめてのGoogle×AI活用勉強会）
// 日曜パターンの「派生案」で実施（大人向けAIを日中に置く形）。詳細は content/04_共通/SCHEDULE-PATTERNS.md §2
// Doorkeeperができたら comingSoon を消し、doorkeeperUrl を埋める。JSON-LDへの追加もそのタイミング
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-09-13",
  date: "2026年9月13日（日）",
  datetime: "2026年9月13日(日) 11:00-17:00",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅からも徒歩圏（ほぼ2駅の中間）",
  target: "①③④: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ②: 大人の方向け（保護者参加OK）",
  capacity: "①③④各回4名 / ②大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  comingSoon: true,
  note: "時間が決まりました。参加費・お申し込み方法は準備でき次第このページでお知らせします。<br />②大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠・参加費は調整中）。お子様の①が終わったあとの時間帯なので、そのままご受講いただけます。<strong>②の時間帯は、お子様にも同席いただけます。</strong>空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません。<br />④は<strong>個別プランとRobloxコース（プログラミングあり）のどちらかを実施</strong>します。事前にご希望をうかがったうえで決定し、申込者の皆さまにご連絡します。<br />Robloxコース（プログラミングあり）は、<strong>体験会で基礎を覚えた方におすすめ</strong>の回です。",
  timetable: [
    { time: "11:00-12:00", label: "①Robloxコース", price: "1,900円" },
    { time: "12:00-12:20", label: "延長タイム・親御様個別相談" },
    { time: "12:20-12:30", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。参加費が決まったら label に追記する
    { time: "12:30-13:30", label: "②大人向けAIコース（仕事活用初心者向け）　参加費は調整中" },
    { time: "13:30-14:30", label: "休憩" },
    { time: "14:30-15:30", label: "③Robloxコース", price: "1,900円" },
    { time: "15:30-15:50", label: "延長タイム・親御様個別相談" },
    { time: "15:50-16:00", label: "設営・入れ替え" },
    // ④は同じ時間枠に2行。講師1名のため同時開催ではなく、どちらかを実施する選択枠
    { time: "16:00-17:00", label: "④個別プラン" },
    { time: "16:00-17:00", label: "④Robloxコース（プログラミングあり）", price: "1,900円" }
  ]
});
