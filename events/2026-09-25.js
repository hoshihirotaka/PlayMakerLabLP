// 日程・時間確定（2026-08-12）。Doorkeeper未作成のため comingSoon: true のまま
// 金曜パターンの標準形で実施。詳細は content/04_共通/SCHEDULE-PATTERNS.md §3
// 8/28にあった子ども向けAIコース（DreamCore）はなくなり、①②ともRobloxコースになる
// ①は16:40ではなく16:50始まり。16:40だと①の設営終わりと②開始の間に10分の空白ができるため
// Doorkeeperの枠は作成済みだが**未公開で申し込みができない**（2026-08-18）。公開されたら
// comingSoon を消し、doorkeeperUrl を埋める。JSON-LDへの追加もそのタイミング
//   子ども向け: https://gameschool.doorkeeper.jp/events/198875 （第16回）
//   大人向け:   https://gameschool.doorkeeper.jp/events/198876
//
// タイトルは当初「RobloxとAIで〜」だったが、この回にDreamCoreは入れないため
// 2026-08-18にAIを外して修正済み。**タイトルのAIの有無は、その回のDreamCoreの有無と一致させる**
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-09-25",
  date: "2026年9月25日（金）",
  datetime: "2026年9月25日(金) 16:50-20:30",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅からも徒歩圏（ほぼ2駅の中間）",
  target: "①②: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ③: 大人の方向け（保護者参加OK）",
  capacity: "①②各回4名 / ③大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  comingSoon: true,
  note: "時間が決まりました。参加費・お申し込み方法は準備でき次第このページでお知らせします。<br />③大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠・参加費は調整中）。<strong>③の時間帯は、お子様にも同席いただけます。</strong>空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません（<strong>20:30には終了します</strong>。延長はありません）。<br />②Robloxコース（プログラミングあり）は、<strong>体験会で基礎を覚えた方におすすめ</strong>の回です。",
  timetable: [
    { time: "16:50-17:50", label: "①Robloxコース", price: "1,900円" },
    { time: "17:50-18:10", label: "延長タイム・親御様個別相談" },
    { time: "18:10-18:20", label: "設営・入れ替え" },
    { time: "18:20-19:20", label: "②Robloxコース（プログラミングあり）", price: "1,900円" },
    { time: "19:20-19:30", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。参加費が決まったら label に追記する
    { time: "19:30-20:30", label: "③大人向けAIコース（仕事活用初心者向け）　参加費は調整中" }
  ]
});
