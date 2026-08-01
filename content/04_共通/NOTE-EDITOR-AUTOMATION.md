# note入稿ガイド（エージェント向け・ブラウザ操作でnoteエディタに流し込む手順）

書いた原稿を、note.comの編集画面に**直接流し込む**ための手順書。
記事の中身の書き方は [NOTE-GUIDE.md](NOTE-GUIDE.md) を参照。こちらは「入稿の技術的な手順」だけを扱う。

> 検証日: 2026-08-01（第11回の活動報告を実際に入稿して確認）

---

## 前提: どのブラウザを使うか

noteの編集画面はログインが必要。**ユーザーのログイン済みセッションがある実Chromeを使う**。

| 手段 | 使えるか | 理由 |
|---|---|---|
| Claude in Chrome（`mcp__claude-in-chrome__*`） | ✅ 使う | ユーザーのログイン済みChromeを操作できる |
| アプリ内ブラウザ（`mcp__Claude_Browser__*`） | ❌ | 別プロファイルでセッションがなく、ログイン画面にリダイレクトされる |
| Brave | △ | 拡張が公式にはChrome向け。確実性のためChromeに切り替えてもらう |

**パスワードは絶対に入力しない。** 未ログインならユーザーにログインを依頼する。

### つなぎ方
1. `mcp__claude-in-chrome__tabs_context_mcp` でタブ一覧を取得
2. 「Claude in Chrome is not connected」が出たら、ユーザーに以下を案内
   - 拡張のインストール: https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn
   - Chromeでサイドパネルを開き、このアプリと同じアカウントでサインイン
3. `navigate` で `https://editor.note.com/notes/{記事ID}/edit/` を開く

---

## エディタの構造

noteの本文エディタは **ProseMirror**。

- 本文: `document.querySelector('.ProseMirror')`（class: `ProseMirror note-common-styles__textnote-body`）
- タイトル: 本文とは別の contenteditable。クリックして `type` で入力し、`Return` で本文へ移動できる
- 本文のブロックは `H2` / `H3` / `P` / `HR` / `FIGURE`（埋め込み・画像）などの直下要素として並ぶ

---

## 方法A（推奨）: HTMLをペーストイベントで流し込む

**一発で構造ごと入るので、これを第一選択にする。**

ProseMirrorは `paste` イベントの `text/html` を解釈してリッチテキストに変換する。合成イベントでも処理される。

```js
(() => {
  const el = document.querySelector('.ProseMirror');
  if (!el) return 'editor not found';
  el.focus();
  document.execCommand('selectAll');   // 既存内容を置き換える場合。追記なら省略

  const html = `<p>本文段落</p>
<p>強調を含む段落は<strong>ここが太字</strong>になる。</p>
<hr>
<h2>大見出し</h2>
<h3>小見出し</h3>
<p>改行を段落内で入れたい場合は<br>brタグを使う。</p>`;

  const dt = new DataTransfer();
  dt.setData('text/html', html);
  dt.setData('text/plain', html.replace(/<[^>]+>/g, ''));
  const ev = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
  el.dispatchEvent(ev);
  return { defaultPrevented: ev.defaultPrevented, blocks: el.children.length };
})()
```

**成功の判定**: 戻り値の `defaultPrevented` が `true` なら、ProseMirrorがペーストを処理している。
（`dispatchEvent` の戻り値は `false` になるが、これは正常。preventDefaultされたという意味）

### 検証済みの変換結果

| 入力HTML | 結果 |
|---|---|
| `<h2>` | ✅ 大見出し |
| `<h3>` | ✅ 小見出し（潰されずに残る） |
| `<strong>` | ✅ 太字 |
| `<hr>` | ✅ 区切り線 |
| `<br>` | ✅ 段落内の改行 |
| `<p>URL</p>` | プレーンテキストのリンクとして入る（埋め込みカードにはならない） |

### 注意点
- テンプレートリテラルで囲むので、本文にバッククォートを含めない
- **リンクの埋め込みカード化・画像・目次の挿入は、noteのUI操作が必要**。ユーザーに任せるか、別途依頼する

---

## 方法B: 直接タイピング（部分修正向け）

`computer` の `type` で打ち込む方法。**全文入稿には向かない**が、一部だけ直すときに使う。

### 検証済みの挙動

| 操作 | 結果 |
|---|---|
| `## ` と打つ | ✅ 見出しに変換される |
| `**太字**` と打つ | ✅ 太字に変換される |
| `- ` と打つ | ❌ 箇条書きにならず、そのまま文字で残る |
| `type` のテキストに改行を含める | ❌ ブロックが分かれず、同一段落内の改行になる |
| `key` で `Return` を押す | ✅ 新しいブロックができる |

つまり**ブロックを分けたいなら `key: Return` を挟む必要がある**。

### ハマりどころ: `type` は browser_batch に入れられない

`computer` の `type` を `browser_batch` の中に入れると、毎回こうなる:

```
permission_required: editor.note.com — call computer standalone (not in browser_batch)
```

`key` / `screenshot` / `scroll` はバッチに入れられるが、**`type` だけは単発呼び出しが必須**。
そのため方法Bで長文を入れるとラウンドトリップが大量に発生する。→ 方法Aを使うこと。

---

## 入稿後の確認

**スクリーンショットに頼らない。** 対象タブが非アクティブだと真っ白な画像が返ってくる。
JSで構造を読み出すのが確実。

```js
(() => {
  const el = document.querySelector('.ProseMirror');
  const kids = Array.from(el.children);
  return {
    count: kids.length,
    tags: kids.map(c => c.tagName).join(','),
    headings: kids.map((c,i) => i + ':' + c.tagName + ':' + (c.textContent||'').slice(0,40))
                  .filter(b => /:(H1|H2|H3):/.test(b)),
    textLen: (el.textContent||'').length
  };
})()
```

### チェック項目
- [ ] 見出しの数と並びが原稿と一致しているか
- [ ] 先頭に**空のブロックが残っていないか**（方法Bで記法テストをすると、空の `H2` が残りやすい）
- [ ] 末尾のタグ行まで入っているか

---

## やってはいけないこと

- **「公開に進む」を押さない。** 公開はユーザーの判断。エージェントは下書きに入れるところまで
- **「下書き保存」も勝手に押さない**（押す場合はユーザーに一言確認する）
- **ユーザーが同時に編集している最中に書き込まない。** 目次・画像・埋め込みを追加している最中に流し込むと、その作業を壊す。編集中と分かったら、いったん手を止めて確認する
- 既存の記事に追記する場合、`selectAll` を実行しない（全部消える）

---

## 原稿の正本について

noteに入稿した後も、**リポジトリ内のマークダウンを正本として扱う**。
note側で文言を直した場合は、`content/02_開催後作業/note/note-session-XX.md` にも反映して同期を保つ。
