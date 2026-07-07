# content/ フォルダ構成

LP・Doorkeeper・Instagram・noteなど各プラットフォーム向けのテキスト原稿を、用途別に管理するフォルダです。

## フォルダ定義

| フォルダ | 用途 | いつ使う |
|---|---|---|
| `01_開催告知/` | イベント前の告知・集客コンテンツ | 新しいイベントを告知するとき |
| `02_終了報告/` | イベント後の振り返り・作品紹介 | イベント終了後にレポートや作品を投稿するとき |
| `03_定期投稿/` | 日程に紐づかないテンプレート・コラム | 定期的な発信や使い回せる素材を作るとき |
| `04_共通/` | プラットフォーム設定・ガイド・SEO | Doorkeeperのコミュニティページなど、めったに変えない共通テキスト |

## 構造

```
content/
├── 01_開催告知/
│   ├── doorkeeper/        # Doorkeeperイベント説明文・ドラフト
│   ├── instagram/         # Instagram告知投稿（未登録の方も見ている前提）
│   └── dm/                # DM送付テキスト（メンバー登録済み・未参加の方向け）
├── 02_終了報告/
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
- テンプレート: 内容がわかる名前（例: `instagram-hooks.md`）
- ドラフト: 末尾に `-draft`（例: `doorkeeper-unified-v2-draft.md`）
