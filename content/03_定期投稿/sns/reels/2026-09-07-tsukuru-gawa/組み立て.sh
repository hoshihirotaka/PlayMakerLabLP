#!/bin/bash
# リール「作る側に回る」の素材を1本に組み立てる
#
# 使い方:  bash 組み立て.sh
# 出力:    ~/Desktop/tsukuru-gawa.mp4（1080x1920 / 30fps / 音声なし）
#
# テロップは CapCut で tsukuru-gawa-v2-revised.srt を読み込んで乗せる。
# ⑤の絵文字加工だけは手作業。加工済みの画像を PHOTO に指定すること。

set -e
FF=/usr/local/bin/ffmpeg
OUT=${OUT:-~/Desktop}
W=/tmp/tsukuru_work
mkdir -p "$W"

FUKEI=~/Desktop/8:28風景/IMG_0009_emoji_ほしアレンジ.mp4
SAKUHIN=~/Movies/CapCut/893Dダイヤ防衛サバイバー.mov
PHOTO=~/Downloads/風景.png   # 絵文字加工済み・1920x1080
BANNER=~/Downloads/大人向けブロマスインスタ.png
CAL=~/Downloads/カレンダー.png
HIKI=~/Desktop/8:28風景/IMG_0008.MOV   # 59.6分の固定カメラ。カードの背景に使う

# ③に使う秒。⚠️ 切り出す前にその秒のテロップを目視すること
SAKUHIN_SS=3.0

echo "① 風景（子ども＋PC）2.4秒"
$FF -y -v error -ss 1.5 -t 2.4 -i "$FUKEI" \
  -vf "scale=1080:1920,fps=30,setsar=1" -an -c:v libx264 -pix_fmt yuv420p "$W/01.mp4"

echo "② 風景（机にPCが並ぶ）2.9秒"
$FF -y -v error -ss 11.5 -t 2.9 -i "$FUKEI" \
  -vf "scale=1080:1920,fps=30,setsar=1" -an -c:v libx264 -pix_fmt yuv420p "$W/02.mp4"

echo "③ 8/9の作品 2.9秒"
$FF -y -v error -ss $SAKUHIN_SS -t 2.9 -i "$SAKUHIN" \
  -vf "scale=1080:1920,fps=30,setsar=1" -an -c:v libx264 -pix_fmt yuv420p "$W/03.mp4"

echo "④ バス（今月のお題）2.8秒"
$FF -y -v error -ss 25.5 -t 2.8 -i "$FUKEI" \
  -vf "scale=1080:1920,fps=30,setsar=1" -an -c:v libx264 -pix_fmt yuv420p "$W/04.mp4"

echo "⑤ 教室の写真を中央→右へパン 4.9秒"
$FF -y -v error -loop 1 -t 4.9 -i "$PHOTO" \
  -vf "crop=607:1080:'656+(1150-656)*t/4.9':0,scale=1080:1920,fps=30,setsar=1" \
  -an -c:v libx264 -pix_fmt yuv420p "$W/05.mp4"

echo "⑥ 大人向けAIバナー（引きの教室に重ねる）3.9秒"
$FF -y -v error -ss 600 -t 3.9 -i "$HIKI" -loop 1 -i "$BANNER" -filter_complex \
  "[0:v]scale=1296:2304,crop=1080:1920:'(iw-1080)*t/4':'(ih-1920)/2',fps=30[bg];[1:v]scale=1080:1350[card];[bg][card]overlay=0:80:shortest=1,setsar=1" \
  -an -c:v libx264 -pix_fmt yuv420p "$W/06.mp4"

echo "⑦ 日程カード（手持ちの風景に重ねる。⑥と質感を分ける）4.0秒"
$FF -y -v error -ss 15.0 -t 4.0 -i "$FUKEI" -loop 1 -i "$CAL" -filter_complex \
  "[0:v]scale=1296:2304,crop=1080:1920:'(iw-1080)*t/4':'(ih-1920)/2',fps=30[bg];[1:v]scale=1080:1350[card];[bg][card]overlay=0:80:shortest=1,setsar=1" \
  -an -c:v libx264 -pix_fmt yuv420p "$W/07.mp4"

echo "連結"
: > "$W/list.txt"
for i in 01 02 03 04 05 06 07; do echo "file '$W/$i.mp4'" >> "$W/list.txt"; done
$FF -y -v error -f concat -safe 0 -i "$W/list.txt" -c copy "$OUT/tsukuru-gawa.mp4"

echo
echo "=== 完成: $OUT/tsukuru-gawa.mp4 ==="
$FF -i "$OUT/tsukuru-gawa.mp4" -vf "fps=2,scale=180:-1,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG" -f null - 2>&1 \
 | grep -E "pts_time|YAVG" | paste - - \
 | sed -E 's/.*pts_time:([0-9.]+).*YAVG=([0-9.]+)/\1 \2/' \
 | awk '{if($2+0<1.0) print "  ⚠️ 静止区間: " $1 "秒 (" $2 ")"; if(min==""||$2+0<min)min=$2+0} END{printf "静止区間チェック: 最小 %.2f （閾値1.0）\n", min}'
