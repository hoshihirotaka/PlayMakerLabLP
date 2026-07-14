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
│   └── dm/                # DM・参加者向け配信（募集 / 事前連絡 / 開催後フォロー）
├── 02_開催後作業/
│   ├── note/              # noteセッション報告記事
│   └── instagram/         # Instagram作品集投稿
├── 03_定期投稿/
│   ├── instagram/         # フック集・短文テンプレート
│   └── note/              # コラム記事
└── 04_共通/
    ├── doorkeeper-community.md   # Doorkeeperコミュニティページ
    ├── doorkeeper-top.md         # Doorkeeperトップページ
    ├── seo.md                    # SEO関連テキスト
    └── NOTE-GUIDE.md             # note執筆ガイド
```

## ファイル命名規則

- イベント紐づきファイル: `{種別}-{YYYY-MM-DD}.md`（例: `dm-2026-07-05.md`）
- DM（用途別）: `dm-YYYY-MM-DD-事前連絡.md` / `dm-YYYY-MM-DD-開催後フォロー.md`（日付で募集DMと同日が並ぶ）
- DMは先頭に `- タイトル:`（Doorkeeper件名）を毎回書く
- テンプレート: `dm-template-事前連絡.md` など内容がわかる名前（例: `instagram-hooks.md`）
- ドラフト: 末尾に `-draft`（例: `doorkeeper-unified-v2-draft.md`）

※ `dm/` の運用詳細は [01_開催前作業/dm/README.md](01_開催前作業/dm/README.md) を参照
