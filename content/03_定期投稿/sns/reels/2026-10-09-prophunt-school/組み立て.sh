#!/bin/bash
# 10月のお題（家具に変身してかくれんぼ）の紹介リール。素材は講師の試作の画面収録2本。
set -e
FF="/opt/homebrew/bin/ffmpeg -nostdin -y -v error"; FP=/opt/homebrew/bin/ffprobe
D="$HOME/Movies/PropHunt"
A="$D/画面収録 2026-10-09 11.35.35.mov"   # 1人で試す → 複数で試す（デスクトップが映るので切り取りで外す）
B="$D/画面収録 2026-10-09 11.42.55.mov"   # 照明を変えて暗くする
ONE="crop=480:854:686:124"   # Studioのゲーム画面の中央。右上のユーザー名表示と左右のパネルは外れる
TWO="crop=585:1040:800:40"   # 右側に縦に並んだ2人ぶんの画面。デスクトップとメニューバーは外れる
seg() { # $1=出力 $2=素材 $3=切り取り $4=開始 $5=終了 $6=速度
  $FF -ss $4 -t $(echo "$5 - $4" | bc) -i "$2" -an \
    -vf "fps=30,$3,scale=1080:1920:flags=lanczos,setsar=1,setpts=(PTS-STARTPTS)/$6" \
    -r 30 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 "$1"; }
seg s1.mp4 "$A" "$ONE" 12.0  18.0  1.5    # 学校の教室を歩く
seg s2.mp4 "$A" "$ONE" 56.0  63.0  1.4    # 青い椅子に変身する
seg s3.mp4 "$A" "$TWO" 166.0 178.0 2.0    # 2人で遊ぶ。下の画面のプレイヤーが赤くなる
seg s4.mp4 "$A" "$TWO" 308.0 318.0 2.0    # 下の人が椅子に変身して隠れ、上の人が探している
seg s5.mp4 "$B" "$ONE" 52.0  62.0  1.8    # 暗い教室（深夜のかくれんぼ）
seg c2.mp4 "$B" "$ONE" 15.0  17.0  1.0    # 照明の色違い：紫（青は暗すぎて深夜の場面と区別できないので外した）
seg c3.mp4 "$B" "$ONE" 22.0  24.4  1.0    #               ピンク
LIST="s1 s2 s3 s4 s5 c2 c3"
: > list.txt; : > times.txt; cum=0; i=0
for s in $LIST; do d=$($FP -v error -show_entries format=duration -of csv=p=0 $s.mp4)
  echo "$i $cum $d" >> times.txt; echo "file '$s.mp4'" >> list.txt; cum=$(echo "$cum + $d" | bc -l); i=$((i+1)); done
$FF -f concat -safe 0 -i list.txt -c copy base.mp4
echo "本体 $(printf %.2f $cum)秒（実測 $($FP -v error -show_entries format=duration -of csv=p=0 base.mp4)）"
