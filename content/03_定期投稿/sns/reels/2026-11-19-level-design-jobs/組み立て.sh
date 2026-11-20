#!/bin/bash
# 個別プラン向けのレベルデザイン教材と「ゲームを作る仕事」の紹介リール。
# 導入だけ教材ページの画面収録、中身は元の図（SVGを2倍で書き出したもの）から寄って見せる。
set -e
FF="/opt/homebrew/bin/ffmpeg -nostdin -y -v error"; FP=/opt/homebrew/bin/ffprobe
D="$HOME/Movies/levelDesign"
REC="$D/画面収録 2026-11-19 10.21.46.mov"   # 798×880。0〜6秒は右クリックのメニュー（コピー）とページの読み込み中なので使わない
C="$HOME/curriculum"
# SVG → 2400×1560。WebKitで描く（Quick Lookは左上だけを切り出す・CoreSVGは太字が効かない）
render() { [ -f "$2" ] || swift svg2png.swift "$1" "$2" 2>&1 | grep -v -i deprecat; }
render "$C/M1-Roblox入門/M1-01-Obby/_下書き_レベルデザイン/obby_地図の見本.svg" map.png
render "$C/M1-Roblox入門/M1-01-Obby/_下書き_レベルデザイン/obby_配置の指示書.svg" place.png
render "$C/M0-基礎/M0-05-向いている仕事/ゲームを作る仕事.svg" jobs.png
render "$C/M0-基礎/M0-05-向いている仕事/向いている仕事_3段階.svg" fun.png
TOP=345   # テロップの帯の下から並べる（上詰め）
rec() { # $1=出力 $2=開始 $3=終了 $4=速度
  $FF -ss $2 -t $(echo "$3 - $2" | bc) -i "$REC" -f lavfi -i "color=0x191919:s=1080x1920:r=30" -an -filter_complex \
    "[0:v]fps=30,scale=1080:-2:flags=lanczos,setpts=(PTS-STARTPTS)/$4[r];[1][r]overlay=0:$TOP:shortest=1,setsar=1" \
    -r 30 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 "$1"; }
pan() { # $1=出力 $2=図 $3=縮小後の幅 $4=窓の高さ $5=x始 $6=x終 $7=y $8=秒
  $FF -loop 1 -framerate 30 -t $8 -i "$2" -f lavfi -i "color=white:s=1080x1920:r=30:d=$8" -filter_complex \
    "[0:v]crop=2400:1560:0:0,scale=$3:-2:flags=lanczos,crop=1080:$4:x='$5+($6-$5)*t/$8':y=$7[p];[1][p]overlay=0:$TOP,setsar=1" \
    -r 30 -c:v libx264 -crf 16 -preset veryfast -video_track_timescale 15360 "$1"; }
rec s1.mp4 6.0 14.0 2.0                                              # 教材ページを上から下へスクロール
pan s2.mp4 map.png   2160 1404 0   1080 0   6.0   # 地図の見本：スタート→区間1〜3→ゴール
pan s3.mp4 map.png   2880 1200 0   1800 640 5.0   # 寄って：難しさの線と、下の3つの考え方
pan s4.mp4 place.png 2160 1404 0   1080 0   4.0   # 配置の指示書：方眼紙→書き方とチェック
pan s5.mp4 jobs.png  2160 1404 0   1080 0   6.0   # かんがえる・つくる・見た目と音
pan s6.mp4 fun.png   1620 1053 0   540  0   5.0   # どこが楽しい？（3段階）と「いまの君もそう！」
LIST="s1 s2 s3 s4 s5 s6"
: > list.txt; : > times.txt; cum=0; i=0
for s in $LIST; do d=$($FP -v error -show_entries format=duration -of csv=p=0 $s.mp4)
  echo "$i $cum $d" >> times.txt; echo "file '$s.mp4'" >> list.txt; cum=$(echo "$cum + $d" | bc -l); i=$((i+1)); done
$FF -f concat -safe 0 -i list.txt -c copy base.mp4
echo "本体 $(printf %.2f $cum)秒（実測 $($FP -v error -show_entries format=duration -of csv=p=0 base.mp4)）"
