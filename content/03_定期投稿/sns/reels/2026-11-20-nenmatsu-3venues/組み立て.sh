#!/bin/bash
# 年末3回分（11/29浦和・12/6南与野・12/20大宮）をまとめたリール。ブーストの行き先はDoorkeeperのトップ。
set -e
FF="/opt/homebrew/bin/ffmpeg -nostdin -y -v error"; FP=/opt/homebrew/bin/ffprobe
D="$HOME/Desktop/年末3回分（11:29浦和・12:6南与野・12:20大宮）のリール"
K="$D/IMG_0009_emoji_ほしアレンジ.mp4"            # 8/28の風景（顔は絵文字で隠した投稿済みの版）
N="$D/IMG_9213.MOV"                               # 11/8の風景（手と画面だけ）。声が入っているので音は使わない
STEAL="$HOME/Movies/steal/work/base.mp4"          # 11月のお題リールのテロップなし版
XMAS="$HOME/Movies/levelDesign/画面収録 2026-11-20 16.51.51.mov"   # 12月のお題（E0-09）の試作
VIEW="crop=422:750:735:126"   # Studioのゲーム画面の中央（右上の点数表とパネルは外れる）
seg() { # $1=出力 $2=素材 $3=切り取り（なしは null） $4=開始 $5=終了 $6=速度
  $FF -ss $4 -t $(echo "$5 - $4" | bc) -i "$2" -an \
    -vf "fps=30,$3,scale=1080:1920:flags=lanczos,setsar=1,setpts=(PTS-STARTPTS)/$6" \
    -r 30 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 "$1"; }
seg s1.mp4 "$K"     null    1.0   5.5   1.0   # 作ってすぐ遊ぶ（8/28）
seg s2.mp4 "$N"     null    6.0   10.0  1.0   # 大きな画面でプレイ（11/8）
seg s3.mp4 "$STEAL" null    1.5   6.4   1.4   # 盗む→番人が追ってくる
seg s4.mp4 "$STEAL" null    6.4   11.25 1.4   # 捕まる（作り直した教材の話はここ。10/26のリールの「ツールボックスでOK」を改めた）
seg s5.mp4 "$XMAS"  "$VIEW" 88.4  94.6  1.4   # 車でジャンプ台へ（84〜88秒はゲーム内の看板が帯からはみ出すので外した）
seg s6.mp4 "$XMAS"  "$VIEW" 144.5 151.5 1.4   # ソリで町の上を飛ぶ（131〜139秒はカメラが丘にめり込んで青くなるので外した）
seg s7.mp4 "$XMAS"  "$VIEW" 14.0  20.0  1.5   # 空から見た冬の町（地形の丘と道）
LIST="s1 s2 s3 s4 s5 s6 s7"
: > list.txt; : > times.txt; cum=0; i=0
for s in $LIST; do d=$($FP -v error -show_entries format=duration -of csv=p=0 $s.mp4)
  echo "$i $cum $d" >> times.txt; echo "file '$s.mp4'" >> list.txt; cum=$(echo "$cum + $d" | bc -l); i=$((i+1)); done
$FF -f concat -safe 0 -i list.txt -c copy base.mp4
echo "本体 $(printf %.2f $cum)秒（実測 $($FP -v error -show_entries format=duration -of csv=p=0 base.mp4)）"
