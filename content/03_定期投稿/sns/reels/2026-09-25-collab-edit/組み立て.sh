#!/bin/bash
# 9/25の作品リールを組み立てる。風景 → ゲーム → 風景。
# 使い方: bash build.sh   （emoji.swift で f1〜f3_emoji.mp4 を作ってから）
set -e
FF="/opt/homebrew/bin/ffmpeg -nostdin -y -v error"; FP=/opt/homebrew/bin/ffprobe
D="$HOME/Movies/2026:09:25お子さんの作品"
A="$D/画面収録 2026-10-01 16.08.07.mov"; B="$D/画面収録 2026-10-01 16.06.28.mov"
GC="crop=481:856:687:124,scale=1080:1920:flags=lanczos,setsar=1"   # Studioの操作パネルを外して縦に
game() { # $1=出力 $2=素材 $3=開始 $4=長さ   画面収録は可変フレームレートなので先に fps=30
  $FF -ss $3 -t $4 -i "$2" -an -vf "fps=30,$GC" -c:v libx264 -crf 16 -preset veryfast "$1"; }
game g1.mp4 "$A" 77.5 4.0      # お題：カラフルなキーボードを走る
game g2.mp4 "$A" 104.8 5.0     # 回転する赤い十字バーに弾かれる
game g3.mp4 "$B" 12.8 2.8      # 壁の中のNPC
game g4.mp4 "$B" 65.8 4.0      # 剣を持ってNPCと向き合う
game g5.mp4 "$B" 7.8 2.5       # リーダーボード
$FF -ss 0.1 -i f1_emoji.mp4 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 f1_trim.mp4   # 先頭の黒フレームを削る
# 会話と締めは右端を切らない元の画角（右のお子さんを見せる）。
# AVAssetWriter の書き出しはタイムベースが 1/600 で、連結で読み飛ばされる。ffmpeg で揃え直す
for s in f2 f3; do $FF -i ${s}_full_emoji.mp4 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 ${s}_n.mp4; done
LIST="f1_trim g1 g2 g3 g4 g5 f2_n f3_n"
: > list.txt; : > times.txt; cum=0; i=0
for s in $LIST; do d=$($FP -v error -show_entries format=duration -of csv=p=0 $s.mp4)
  echo "$i $cum $d" >> times.txt; echo "file '$s.mp4'" >> list.txt
  cum=$(echo "$cum + $d" | bc -l); i=$((i+1)); done
$FF -f concat -safe 0 -i list.txt -c:v libx264 -crf 16 -preset veryfast -pix_fmt yuv420p base.mp4
echo "本体 $(printf %.2f $cum)秒"
