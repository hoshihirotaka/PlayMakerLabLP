# リール投稿文（2026-08-09 開催告知／Roblox看板）

🎮 あさって開催！

Robloxの中に看板を立てて、お知らせを作ってみました。
こういうものが作れる体験会です。

📍 路地裏GarageMarket（埼玉・南与野）
📅 8月9日（日）11:00〜17:00

対象：小学1年生〜高校生
参加費：Roblox 1,900円 / AI 900円
会場PCあり・持参も大歓迎です。

同じ日、会場では他にも出店があります。
パン、スパイスカレー、コーヒー、犬のおやつなど。
詳しくは会場アカウントの投稿をご覧ください。

お申し込みはプロフィールのリンクからお願いします。

#Roblox #AI #ゲーム制作 #子ども向け #親子参加

---

メモ:

## この動画について

- **Roblox Studio内に告知看板を建てて画面収録したもの**。ブロマスで初の試み（2026-08-07）
- 告知でありながら「うちで何が作れるか」の実演を兼ねるのが狙い。Canvaのバナーとの決定的な違いはここ
- 尺 3.3秒（トリミング後）。**短いがリールは自動ループするので、2周目で読み切れる**。完走率の面ではむしろ有利
- 元データ: `~/Desktop/お知らせ.mov`（リポジトリには置かない）

## 作り方（次回の再現手順）

1. Roblox Studioで看板を建てる。スクリプトは下の「看板生成スクリプト」
2. `StarterPlayer > StarterPlayerScripts` に LocalScript を仕込む（下の「撮影用スクリプト」）
3. 再生 → 画面収録 → トリミング

**看板は縦長（14×20）にすること。** 9:16の画面に横長看板（24×13.5）は収まらず、初回はどのカットでも文字が見切れた。

## つまずいたところ

| 症状 | 原因と対処 |
|---|---|
| Studioのツールバーが写る | ウィンドウ全体を収録していた。フルスクリーンで再生するか、`Cmd+Shift+5` でビューポートだけ範囲指定する |
| マウスカーソルが写る | LocalScriptに `UserInputService.MouseIconEnabled = false` を入れる。これがあれば手動でカメラを回しても写らない |
| 左上にRobloxのメニューが写る | `StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All, false)` と `SetCore("TopbarEnabled", false)` |
| カメラを手で動かすと手ブレする | TweenServiceでCFrameを補間する。マウスに触らないので上の2つも同時に解決する |
| 看板の文字が読めない | 動画は1メッセージしか運べない。**情報はテロップに載せ、看板は雰囲気として置く** |

## 日本語フォントの検証結果（2026-08-07）

Robloxで日本語は問題なく表示される（豆腐にならない）。ただし**フォントを変えても和文の書体はほぼ変わらない**。日本語を持たないフォントは代替フォントに落ちるため、欧文だけが変化する。

- 変わるのは**太さ**と**実寸**だけ。Legacy は同じTextSizeでも明らかに大きい
- **Bold系（GothamBold / SourceSansBold）を使う。** 細いフォントはリールで潰れる
- 個性はフォントではなく、配色・レイアウト・背景の作り込みで出す
- 全角括弧「（）」は前に余白が入って間延びする。半角「()」のほうが締まる

## テロップの設計

看板に書いてあることをテロップで繰り返さないこと。**看板が言えないことに使う。**

今回は1枚目が看板と重複していた（「ゲームクリエイター体験会」）。次回は1枚目を「Robloxの中に看板を立ててみた」にして、**この動画自体がRobloxで作られていることを冒頭で伝える**ほうがよい。

日本語2行は**最低2秒**。3枚入れるなら尺は6〜8秒欲しい。

## 看板生成スクリプト（コマンドバーに貼る）

```lua
local ws = workspace
local o = ws:FindFirstChild("BromasSign_0809") if o then o:Destroy() end
local f = Instance.new("Folder") f.Name = "BromasSign_0809" f.Parent = ws
local b = Instance.new("Part") b.Name = "Board" b.Anchored = true b.CanCollide = false
b.Size = Vector3.new(14,20,0.6) b.CFrame = CFrame.new(0,15,0)
b.Material = Enum.Material.SmoothPlastic b.Color = Color3.fromRGB(10,16,34) b.Parent = f
local g = Instance.new("SurfaceGui") g.Face = Enum.NormalId.Back g.PixelsPerStud = 50
g.LightInfluence = 0 g.Parent = b
local function line(t,s,y,h,c)
  local l = Instance.new("TextLabel") l.BackgroundTransparency = 1
  l.Size = UDim2.new(1,0,h,0) l.Position = UDim2.new(0,0,y,0)
  l.Font = Enum.Font.GothamBold l.TextSize = s l.TextColor3 = c
  l.TextStrokeTransparency = 0.7 l.Text = t l.Parent = g
end
local W,O = Color3.fromRGB(255,255,255), Color3.fromRGB(255,122,60)
line("ブロマス",           58,0.04,0.08,O)
line("ゲームクリエイター",  46,0.13,0.07,W)
line("体験会",             80,0.21,0.10,W)
line("8/9",               230,0.34,0.20,W)
line("(日)",              100,0.55,0.09,W)
line("11:00-17:00",        88,0.66,0.09,W)
line("路地裏",             52,0.79,0.07,O)
line("GarageMarket",       52,0.86,0.07,O)
```

## 撮影用スクリプト（コマンドバーに貼ってから再生）

カメラの寄りとエモートを自動化する。マウスに触らないのでカーソルが写らない。

```lua
local sp = game:GetService("StarterPlayer"):WaitForChild("StarterPlayerScripts")
local old = sp:FindFirstChild("CamShot") if old then old:Destroy() end
local s = Instance.new("LocalScript") s.Name = "CamShot" s.Parent = sp
s.Source = [==[
local TS = game:GetService("TweenService")
local UIS = game:GetService("UserInputService")
local SG = game:GetService("StarterGui")
local plr = game.Players.LocalPlayer
UIS.MouseIconEnabled = false
pcall(function() SG:SetCoreGuiEnabled(Enum.CoreGuiType.All, false) end)
pcall(function() SG:SetCore("TopbarEnabled", false) end)
local char = plr.Character or plr.CharacterAdded:Wait()
local hum = char:WaitForChild("Humanoid")
local cam = workspace.CurrentCamera
cam.CameraType = Enum.CameraType.Scriptable
cam.FieldOfView = 60
local target = Vector3.new(0, 15, 0)
cam.CFrame = CFrame.lookAt(Vector3.new(0, 19, 46), target)
task.wait(1)
TS:Create(cam, TweenInfo.new(8, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
  { CFrame = CFrame.lookAt(Vector3.new(0, 15.5, 24), target) }):Play()
task.wait(2)
if not pcall(function() hum:PlayEmote("wave") end) then
  local a = Instance.new("Animation") a.AnimationId = "rbxassetid://507770239"
  local ar = hum:FindFirstChildOfClass("Animator") or Instance.new("Animator", hum)
  ar:LoadAnimation(a):Play()
end
]==]
```

エモートID（R15）: wave 507770239 ／ point 507770453 ／ cheer 507770677 ／ laugh 507770818 ／ dance 507771019

## 照明について

ツールボックスのガレージ（床147×132スタッド）を背景に使った。デフォルトのままだと内部が暗い。

- **全体照明（`game.Lighting`）を上げると平坦になる。** 一度 Ambient と ExposureCompensation を上げたが、暗いままのほうが雰囲気が出るので戻した（元の値: Ambient/OutdoorAmbient = 70,70,70、ExposureCompensation = 0）
- 代わりに `Workspace.GarageLights` にPointLightを置いている。強すぎると白飛びするので Brightness 1前後・Range 40前後が目安
- **暗い空間に光源だけ灯っているほうが、看板のネオン感も出て動画向き**

## 出店者情報の扱い

会場（路地裏GarageMarket）は同日に複数店舗が出展する。**動画にも看板にも出店者リストは載せない。**

- 焦点がぼける。Roblox動画の価値は「うちで作れるものの証明」であって、イベント案内ではない
- 出店者は毎回変わる。変わる情報を、変えにくい場所に置かない
- ジャンルだけキャプションに書き、正確なリストは会場アカウントへ送る。管理責任を持たずに賑わいだけ伝わる
- **会場の出店者投稿をストーリーズで再シェアする**のがコストゼロで効く。会場のフォロワーは「その日そこに来る地域の人」で、狙っている層と重なる
