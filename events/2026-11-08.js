// 2026-10-07 本人決定：11/8（日）路地裏は「10月の日曜（10/11）と同じ形」。大人向けAIはGoogle連携（10/11と同じ題材）。
// お題は「盗んで逃げろ」（E0-08・決定）。E0-08は全員コピペで進める（「あり／なし」の選択は出さない。→ 決定ログ 11月・12月のお題の方向）。
// Doorkeeperはまだなので comingSoon: true のまま。Doorkeeperができたら comingSoon を消し、doorkeeperUrl を埋める（枠の分も）。JSON-LDへの追加もそのタイミング。
//
// ⚠️ 今週末（10/10〜11）までマージしない・Doorkeeperも公開しない（2026-10-07 本人）。
//    ①DreamCoreは、与野で個別プランの要望があれば「募集なし・11:00-12:00は予約あり」に置き換えるかもしれない。今週末に本人が決める。
//
// ⚠️ trialPrice を付けないこと（10月からの正規価格）。
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-11-08",
  date: "2026年11月8日（日）",
  datetime: "2026年11月8日(日) 11:00-17:00",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅から徒歩14分（ほぼ2駅の中間）",
  target: "①②③: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ④: 大人の方向け（保護者参加OK）",
  capacity: "①②③各回4名 / ④大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  comingSoon: true,
  note: "④大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠）。お子様の回が終わったあとの時間帯なので、そのままご受講いただけます。<strong>④の時間帯は、お子様にも同席いただけます。</strong>空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません。<br />①AIコース（DreamCore）は、プログラミングを使わずにAIでゲームを作る回です。<strong>こちらも別のお申し込みになります。</strong><br />②③は同じ内容です。ご都合のよいほうをお選びください。<br />お申し込みの受付は準備でき次第お知らせします。",
  timetable: [
    // 2026-05-15にRobloxと統合したあと、子ども向けAIの参加者は 5→3→0 と消えた。
    // ページを分けて出し直す（2026-09-08 定例）。尺は30分のまま・延長は未確定
    // DreamCoreはRobloxとは別のDoorkeeperイベントにする（2026-09-19 本人）。広告は出さず、サイトからだけリンクする。
    // 枠に doorkeeperUrl があるので、枠の中に「この体験に申し込む」リンクが出る
    { time: "11:00-11:30", label: "①AIコース（DreamCore）", course: "ai-game", level: "beginner", title: "AIでゲームを作る体験", description: "作りたいゲームを言葉にして、AIと一緒に形にします。", separateBooking: true, price: "2,000円" },
    { time: "11:30-11:50", label: "延長タイム・親御様個別相談" },
    { time: "11:50-12:00", label: "設営・入れ替え" },
    { time: "12:00-13:00", label: "②Robloxコース", course: "roblox", level: "beginner", title: "はじめてのRobloxゲーム制作", description: "宝を盗んで、追いかけてくる番人から逃げるゲームを作ります。", price: "3,000円" },
    { time: "13:00-13:20", label: "延長タイム・親御様個別相談" },
    // 通しで回すとここが消える。日曜でまとまった休憩が取れるのはこの1回だけ
    { time: "13:20-14:20", label: "休憩" },
    { time: "14:20-15:20", label: "③Robloxコース", course: "roblox", level: "beginner", title: "はじめてのRobloxゲーム制作", description: "宝を盗んで、追いかけてくる番人から逃げるゲームを作ります。", price: "3,000円" },
    { time: "15:20-15:40", label: "延長タイム・親御様個別相談" },
    { time: "15:40-16:00", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。
    // audience:"adult" は adults.html が拾うための印（AGENTS.md 参照）。
    // 大人向けAIは改定の対象外（SCHEDULE-PATTERNS.md）。
    {
      time: "16:00-17:00",
      label: "④大人向けAIコース（仕事活用初心者向け）　2,900円 / PCレンタル付き 3,500円",
      audience: "adult",
      title: "予定・ToDo・メールをAIで整理する",
      description: "Geminiで予定とToDoの登録、Gmailの要点整理を実際に試します。",
      // doorkeeperUrl は大人向けのイベントができてから入れる
      adultPrice: "2,900円 ／ PCレンタル付き 3,500円"
    }
  ]
});
