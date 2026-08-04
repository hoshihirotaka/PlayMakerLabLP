# downloads/ — 配布用ファイル

GitHub Pagesで公開され、そのままURLで配布できるファイルを置く。
Instagramのプレゼント企画、DM、当日のお土産などで使う。

## 公開URL

```
https://hoshihirotaka.github.io/PlayMakerLabLP/downloads/{ファイル名}
```

## 置いてあるもの

| ファイル | 内容 | 公開URL |
|---|---|---|
| `roblox-obby-quest.pdf` | Robloxアスレチック制作の攻略ガイド（15ページ） | [/downloads/roblox-obby-quest.pdf](https://hoshihirotaka.github.io/PlayMakerLabLP/downloads/roblox-obby-quest.pdf) |

### roblox-obby-quest.pdf について

- 元ネタ: 体験会教材 `E0-00-アスレチック_1`（curriculumリポジトリ）
- NotebookLMのスライド生成で再構成したもの。教材のスクリーンショットを取り込んだうえで、3Dギズモの対比図やつまずきポイントの注意ボックスを追加した構成になっている
- 全ページの左下に「ブロマスゲームラボ／サイトURL」のフッターを追加済み（転送された先でも出所が分かるようにするため）
- 元データ（17.3MB）は各ページがPNGで重かったため、JPEG再エンコードで2.5MBに圧縮している。画質の劣化はほぼない

## ファイルを追加するときのルール

- **ファイル名は半角英数字**（日本語だとURLがパーセントエンコードされて共有しづらい）
- **PDFは圧縮してから置く。** 目安は5MB以下。パブリックリポジトリなので、大きいバイナリを何度もコミットすると履歴が膨らむ
  - 圧縮方法: 各ページをレンダリングしてJPEG（品質85）で再エンコードし、PDFに組み直す
- 配布物には**出所（団体名とURL）を入れる**。転送されたときに辿れるようにするため
- 業務委託で開発された教材は、契約上の扱いを確認してから置くこと。体験会教材（`E0-` 系）は自作のため配布可
