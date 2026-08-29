(window.EVENTS = window.EVENTS || []).push({
  id: "2026-08-28",
  date: "2026年8月28日（金）",
  datetime: "2026年8月28日(金) 17:00-20:30",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅からも徒歩圏（ほぼ2駅の中間）",
  target: "①②: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ③: 大人の方向け（保護者参加OK）",
  capacity: "①②各回4名 / ③大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198459",
  note: "③大人向けAIコース「はじめてのGoogle×AI活用勉強会」は保護者様ご自身向けの別イベントです。お申し込みは <a href=\"https://gameschool.doorkeeper.jp/events/198703\" target=\"_blank\" rel=\"noreferrer\">こちら</a>。参加条件: Googleアカウントをお持ちの方（個人の @gmail.com を推奨／ノートPCはChrome推奨）。パソコンをお持ちでない方はレンタル付き3,200円をお選びください（4台限定・アカウントはご自身のものをご用意ください）。終了後にアンケートへのご協力をお願いする回のため、通常より1,000円お安くご案内しています。",
  timetable: [
    { time: "17:00-17:30", label: "①AIコース（ゲーム制作）", price: "900円" },
    { time: "17:30-17:50", label: "延長タイム・親御様個別相談" },
    { time: "17:50-18:00", label: "設営・入れ替え" },
    { time: "18:00-19:00", label: "②Robloxコース", price: "1,900円" },
    { time: "19:00-19:20", label: "延長タイム・親御様個別相談" },
    { time: "19:20-19:30", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（7/31と同じ形）。
    // price に入れると「今だけお試し価格」バッジが自動で付くが、大人向けの値引き理由は
    // 「アンケートにご協力いただく回だから」で子ども向けとは別建てのため、バッジを付けない。
    // チケットが2種類あることも price フィールドでは表現できない
    // audience:"adult" は adults.html が大人向けの回を拾うための印。
    // ラベルの文言で判定すると、書き換えたときに黙って壊れるため明示する。
    // doorkeeperUrl は「申込を受付中の回」にだけ付ける（未公開の回には付けない）。
    {
      time: "19:30-20:30",
      label: "③大人向けAIコース（仕事活用初心者向け）　2,900円 / PCレンタル付き 3,200円",
      audience: "adult",
      adultPrice: "2,900円 ／ PCレンタル付き 3,200円",
      doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/198703"
    }
  ]
});
