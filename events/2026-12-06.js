// 2026-11-03 本人：12/6（日）路地裏は「10月の日曜（10/11）・11/8と同じ形」。DreamCoreは全部同じ。大人向けAIはNotebookLM（10/23と同じ題材）。
// お題は「空飛ぶ乗り物（クリスマス編）」（E0-09・2026-11-03 決定）。スクリプトはコピペで進める。
// Doorkeeperは2026-11-03に3本作成。doorkeeperUrl・JSON-LDとも反映済み。
//   Roblox:    https://gameschool.doorkeeper.jp/events/200283（イベント側の doorkeeperUrl）
//   DreamCore: https://gameschool.doorkeeper.jp/events/200282（①の枠）
//   大人向け:  https://gameschool.doorkeeper.jp/events/200284（④の枠）
//
// ⚠️ trialPrice を付けないこと（10月からの正規価格）。
(window.EVENTS = window.EVENTS || []).push({
  id: "2026-12-06",
  date: "2026年12月6日（日）",
  datetime: "2026年12月6日(日) 11:00-17:00",
  location: "路地裏GarageMarket",
  area: "埼玉・南与野",
  address: "〒338-0013 埼玉県さいたま市中央区鈴谷7丁目7-3",
  access: "最寄駅: 南与野駅（徒歩16分）／与野本町駅から徒歩14分（ほぼ2駅の中間）",
  target: "①②③: 小学1年生〜高校生（保護者参加OK、小学生は同伴推奨） / ④: 大人の方向け（保護者参加OK）",
  capacity: "①②③各回4名 / ④大人向けAIコース 8名（予約優先）",
  equipment: "パソコン持参大歓迎（会場でも用意あり）",
  doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/200283",
  note: "④大人向けAIコースは保護者様ご自身向けの<strong>別イベント</strong>です（お申し込みは別枠）。お子様の回が終わったあとの時間帯なので、そのままご受講いただけます。<strong>④の時間帯は、お子様にも同席いただけます。</strong>空いているパソコンを使って、ご自身の続きを進めていただいても問題ありません。<br />①AIコース（DreamCore）は、プログラミングを使わずにAIでゲームを作る回です。<strong>こちらも別のお申し込みになります。</strong><br />②③は同じ内容です。ご都合のよいほうをお選びください。",
  timetable: [
    // DreamCoreはRobloxとは別のDoorkeeperイベント（2026-09-19 本人）。広告は出さず、サイトからだけリンクする。
    // 枠に doorkeeperUrl があるので、枠の中に「この体験に申し込む」リンクが出る
    { time: "11:00-11:30", label: "①AIコース（DreamCore）", course: "ai-game", level: "beginner", title: "AIでゲームを作る体験", description: "作りたいゲームを言葉にして、AIと一緒に形にします。", separateBooking: true, doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/200282", price: "2,000円" },
    { time: "11:30-11:50", label: "延長タイム・親御様個別相談" },
    { time: "11:50-12:00", label: "設営・入れ替え" },
    { time: "12:00-13:00", label: "②Robloxコース", course: "roblox", level: "beginner", title: "はじめてのRobloxゲーム制作", description: "車やソリに乗りかえて、ジャンプ台で跳んだり空を飛んだりするクリスマスのゲームを作ります。", price: "3,000円" },
    { time: "13:00-13:20", label: "延長タイム・親御様個別相談" },
    // 通しで回すとここが消える。日曜でまとまった休憩が取れるのはこの1回だけ
    { time: "13:20-14:20", label: "休憩" },
    { time: "14:20-15:20", label: "③Robloxコース", course: "roblox", level: "beginner", title: "はじめてのRobloxゲーム制作", description: "車やソリに乗りかえて、ジャンプ台で跳んだり空を飛んだりするクリスマスのゲームを作ります。", price: "3,000円" },
    { time: "15:20-15:40", label: "延長タイム・親御様個別相談" },
    { time: "15:40-16:00", label: "設営・入れ替え" },
    // 大人向けは price を使わず label 内に金額を書く（バッジを付けないため）。
    // audience:"adult" は adults.html が拾うための印（AGENTS.md 参照）。
    // 大人向けAIは改定の対象外（SCHEDULE-PATTERNS.md）。
    {
      time: "16:00-17:00",
      label: "④大人向けAIコース（仕事活用初心者向け）　2,900円 / PCレンタル付き 3,500円",
      audience: "adult",
      title: "NotebookLMで資料作成と画像生成",
      description: "NotebookLMに資料を読み込ませて質問やスライド作成を試し、Geminiで画像も作ります。",
      doorkeeperUrl: "https://gameschool.doorkeeper.jp/events/200284",
      adultPrice: "2,900円 ／ PCレンタル付き 3,500円"
    }
  ]
});
