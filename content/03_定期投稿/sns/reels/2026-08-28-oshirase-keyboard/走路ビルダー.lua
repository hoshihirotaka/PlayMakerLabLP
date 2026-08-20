-- キーボード走路を作る（Studioのコマンドバーに貼る／再生は押さない）
-- 6テーマを -Z 方向へ並べ、区切りごとに門と 8/28 看板を置く
local ws = workspace
local kit = ws:WaitForChild("Model"):WaitForChild("Clicky Keyboard Asmr")
local themes = kit:WaitForChild("Themes")

--------------------------------------------------------------------
-- 調整するのはここだけ
--------------------------------------------------------------------
local GATE_OPEN = 16   -- 門の開口幅（走り抜ける幅）
local WALL_H    = 16   -- 壁の高さ
local WALL_T    = 2    -- 壁の厚み
local SIGN_UP   = 10   -- 梁から看板中心までの高さ
local GAP       = 10   -- 門とキーボードのすきま
--------------------------------------------------------------------

local root = ws:FindFirstChild("キーボード走路")
if root then root:Destroy() end
root = Instance.new("Folder") root.Name = "キーボード走路" root.Parent = ws

local function bounds(inst)
	local lo, hi
	for _, d in ipairs(inst:GetDescendants()) do
		if d:IsA("BasePart") then
			local a, b = d.Position - d.Size / 2, d.Position + d.Size / 2
			if not lo then lo, hi = a, b else
				lo = Vector3.new(math.min(lo.X,a.X), math.min(lo.Y,a.Y), math.min(lo.Z,a.Z))
				hi = Vector3.new(math.max(hi.X,b.X), math.max(hi.Y,b.Y), math.max(hi.Z,b.Z))
			end
		end
	end
	return lo, hi
end

local function shift(inst, delta)
	for _, d in ipairs(inst:GetDescendants()) do
		if d:IsA("BasePart") then d.Position = d.Position + delta end
	end
end

-- 8/28 看板（走ってくる側＝+Z を向く）
local function makeSign(parent, cf)
	local b = Instance.new("Part")
	b.Name = "Sign_0828" b.Anchored = true b.CanCollide = false
	b.Size = Vector3.new(14, 20, 0.6) b.CFrame = cf
	b.Material = Enum.Material.SmoothPlastic
	b.Color = Color3.fromRGB(10,16,34) b.Parent = parent
	local g = Instance.new("SurfaceGui")
	g.Face = Enum.NormalId.Back g.PixelsPerStud = 50
	g.LightInfluence = 0 g.Parent = b
	local function line(t,sz,y,h,c)
		local l = Instance.new("TextLabel") l.BackgroundTransparency = 1
		l.Size = UDim2.new(1,0,h,0) l.Position = UDim2.new(0,0,y,0)
		l.Font = Enum.Font.GothamBold l.TextSize = sz l.TextColor3 = c
		l.TextStrokeTransparency = 0.7 l.Text = t l.Parent = g
	end
	local W,O = Color3.fromRGB(255,255,255), Color3.fromRGB(255,122,60)
	line("ブロマス",           58,0.04,0.08,O)
	line("ゲームクリエイター",  46,0.13,0.07,W)
	line("体験会",             80,0.21,0.10,W)
	line("8/28",              200,0.34,0.20,W)
	line("(金)",              100,0.55,0.09,W)
	line("17:00-20:30",        88,0.66,0.09,W)
	line("路地裏",             52,0.79,0.07,O)
	line("GarageMarket",       52,0.86,0.07,O)
end

-- 門（左右の壁＋梁＋看板）
local function makeGate(z, width, baseY, hue)
	local gate = Instance.new("Folder") gate.Name = "門" gate.Parent = root
	local side = math.max((width - GATE_OPEN) / 2, 8)
	local col = Color3.fromHSV(hue, 0.5, 0.85)
	for _, dir in ipairs({-1, 1}) do
		local w = Instance.new("Part")
		w.Name = "壁" w.Anchored = true
		w.Size = Vector3.new(side, WALL_H, WALL_T)
		w.Position = Vector3.new(dir * (GATE_OPEN/2 + side/2), baseY + WALL_H/2, z)
		w.Color = col w.Material = Enum.Material.SmoothPlastic
		w.Parent = gate
	end
	local beam = Instance.new("Part")
	beam.Name = "梁" beam.Anchored = true
	beam.Size = Vector3.new(GATE_OPEN + 6, 3, WALL_T)
	beam.Position = Vector3.new(0, baseY + WALL_H + 1.5, z)
	beam.Color = col beam.Material = Enum.Material.Neon
	beam.Parent = gate
	makeSign(gate, CFrame.new(0, baseY + WALL_H + 3 + SIGN_UP, z))
end

local z, topY, width, n = 0, 0, 40, 0
for i, theme in ipairs(themes:GetChildren()) do
	local lo, hi = bounds(theme)
	if lo then
		local size, center = hi - lo, (lo + hi) / 2
		shift(theme, Vector3.new(0, 0, z - size.Z/2) - Vector3.new(center.X, 0, center.Z))
		theme.Parent = root
		z = z - size.Z
		topY = math.max(topY, hi.Y)
		width = math.max(width, size.X)
		n = n + 1
		z = z - GAP
		makeGate(z, width, topY, (i % 6) / 6)
		z = z - GAP
	end
end

local LENGTH = math.abs(z)
print(("キーボード %d枚 / 走路 %d スタッド"):format(n, LENGTH))
print(("速さ40なら約%.1f秒 / 速さ80なら約%.1f秒で走り切る"):format(LENGTH/40, LENGTH/80))

-- スタート地点を走路の手前へ
local spawn = ws:FindFirstChildOfClass("SpawnLocation")
if spawn then
	spawn.Anchored = true
	spawn.Position = Vector3.new(0, topY + 1, 14)
end
print("スポーンを走路の手前に移しました")