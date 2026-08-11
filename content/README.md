# content/ フォルダ構成

LP・Doorkeeper・Instagram・noteなど各プラットフォーム向けのテキスト原稿を、用途別に管理するフォルダです。

## フォルダ定義

| フォルダ | 用途 | いつ使う |
|---|---|---|
| `01_開催前作業/` | 開催前に用意する原稿（告知・募集・事前連絡・開催後フォローなど） | イベント準備のとき |
| `02_開催後作業/` | 開催後に作る原稿（振り返り・作品紹介など） | イベント終了後 |
| `03_定期投稿/` | 日程に紐づかないテンプレート・コラム | 定期的な発信や使い回せる素材を作るとき |
| `04_共通/` | プラットフォーム設定・ガイド・SEO | Doorkeeperのコミュニティページなど、めったに変えない共通テキスト |

## 構造

```
content/
├── 01_開催前作業/
│   ├── doorkeeper/        # Doorkeeperイベント説明文・ドラフト
│   ├── instagram/         # Instagram告知投稿（未登録の方も見ている前提）
│   │   └── calendar/      # 月次カレンダー告知（instagram-calendar-YYYY-MM.md）
│   ├── dm/                # DM・参加者向け配信（募集 / 事前連絡 / 開催後フォロー）
│   └── アンケート/         # 当日配布アンケートの設問（Canva印刷・Googleフォーム共通の正本）
├── 02_開催後作業/
│   ├── note/              # noteセッション報告記事
│   ├── instagram/         # Instagram作品集投稿
│   └── sns/               # note記事のシェア文言（X・Threads・Facebook・Instagram）
├── 03_定期投稿/
│   ├── instagram/         # フック集・短文テンプレート
│   ├── note/              # コラム記事
│   └── sns/               # コラム記事のシェア文言
└── 04_共通/
    ├── doorkeeper-community.md   # Doorkeeperコミュニティページ
    ├── doorkeeper-top.md         # Doorkeeperトップページ
    ├── seo.md                    # SEO関連テキスト
    ├── SCHEDULE-PATTERNS.md      # タイムスケジュールのパターン集（曜日・会場ごとのコマ割りの型）
    ├── NOTE-GUIDE.md             # note執筆ガイド（記事の書き方）
    ├── NOTE-EDITOR-AUTOMATION.md # note入稿ガイド（ブラウザ操作でnoteに流し込む手順）
    ├── SNS-GUIDE.md              # SNSシェア文言ガイド（Xの文字数ルール・媒体別の使い分け）
    ├── 公式LINE設定.md            # 公式LINEのあいさつ文・リッチメニュー・応答設定の原稿
    └── 同意書-Googleフォーム設問リスト.md # 入会同意書をGoogleフォーム化するための設問一覧
```

## ファイル命名規則

- イベント紐づきファイル: `{種別}-{YYYY-MM-DD}.md`（例: `dm-2026-07-05.md`）
- 月次カレンダー告知: `instagram/calendar/instagram-calendar-YYYY-MM.md`（例: `instagram-calendar-2026-07.md`）
- カレンダー告知テンプレ: `instagram/calendar/instagram-calendar-template.md`
- DM（用途別）: `dm-YYYY-MM-DD-事前連絡.md` / `dm-YYYY-MM-DD-開催後フォロー.md`（日付で募集DMと同日が並ぶ）
- SNSシェア文言: `sns-{対象記事のファイル名}.md`（例: `sns-note-session-11.md`）。1記事1ファイルで、中にX/Threads/Facebook・Instagramの各セクションを持たせる
- DMは先頭に `- タイトル:`（Doorkeeper件名）を毎回書く
- テンプレート: `dm-template-事前連絡.md` など内容がわかる名前（例: `instagram-hooks.md`）
- ドラフト: 末尾に `-draft`（例: `doorkeeper-unified-v2-draft.md`）
- アンケート: `アンケート-{対象}.md`（例: `アンケート-大人向けAI.md`）。**日付は付けない**。回ごとに作り直すと比較できるデータが貯まらないため、対象ごとに1本を使い回す

※ `dm/` の運用詳細は [01_開催前作業/dm/README.md](01_開催前作業/dm/README.md) を参照

## 正本の優先順位（チラシ・Canva）

イベント告知の文言・料金・時間・定員は、**`01_開催前作業/` の各原稿を正**とする（instagram / doorkeeper / dm）。

Canvaのチラシ・スライドは別管理のため、開催前に正本と照合する。食い違いがあれば正本に合わせて Canva を直す（過去回のページを流用すると料金の入れ替えなどが起きやすい）。
