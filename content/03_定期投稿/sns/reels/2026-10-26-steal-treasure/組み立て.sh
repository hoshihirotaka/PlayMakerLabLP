#!/bin/bash
# 11月のお題（宝を盗んで逃げろ・E0-08）の紹介リール。素材は講師の試作の画面収録1本。
set -e
FF="/opt/homebrew/bin/ffmpeg -nostdin -y -v error"; FP=/opt/homebrew/bin/ffprobe
A="$HOME/Movies/steal/画面収録 2026-10-26 14.20.50.mov"
ONE="crop=480:854:720:124"   # プレイ中のゲーム画面の中央。右上の点数表（ユーザー名）と体力バーは外れる
seg() { # $1=出力 $2=素材 $3=切り取り $4=開始 $5=終了 $6=速度
  $FF -ss $4 -t $(echo "$5 - $4" | bc) -i "$2" -an \
    -vf "fps=30,$3,scale=1080:1920:flags=lanczos,setsar=1,setpts=(PTS-STARTPTS)/$6" \
    -r 30 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 "$1"; }
seg s1.mp4 "$A" "$ONE" 11.5  16.0  1.2    # 宝箱に近づいて盗む
seg s2.mp4 "$A" "$ONE" 16.0  20.2  1.0    # ゾンビの番人が追ってくる（いちばん大きく映る。番人の説明はここ）
seg s3.mp4 "$A" "$ONE" 20.2  23.5  1.0    # 捕まって倒れる
seg s4.mp4 "$A" "$ONE" 44.0  60.0  2.2    # 岩場で盗む → 番人に寄られる → 基地まで逃げ切る（点数2）
# 78.3〜82.0 のゾンビの横を抜ける画も試したが、ゾンビが小さく1秒ほどしか映らないので外した
seg s5.mp4 "$A" "$ONE" 102.0 113.0 2.0    # 岩・石の坂を抜けるコース
seg s6.mp4 "$A" "$ONE" 61.0  66.0  1.3    # 基地からコースへ走り出す（コース全体が見える）
LIST="s1 s2 s3 s4 s5 s6"
: > list.txt; : > times.txt; cum=0; i=0
for s in $LIST; do d=$($FP -v error -show_entries format=duration -of csv=p=0 $s.mp4)
  echo "$i $cum $d" >> times.txt; echo "file '$s.mp4'" >> list.txt; cum=$(echo "$cum + $d" | bc -l); i=$((i+1)); done
$FF -f concat -safe 0 -i list.txt -c copy base.mp4
echo "本体 $(printf %.2f $cum)秒（実測 $($FP -v error -show_entries format=duration -of csv=p=0 base.mp4)）"
