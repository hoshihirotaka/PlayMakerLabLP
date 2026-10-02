#!/bin/bash
# テロップを焼き込んで完成版とSRTを書き出す。build.sh のあとに実行。
set -e
OUT="$HOME/Movies/2026:09:25お子さんの作品/リール_共同編集へ"
swift telop.swift items.txt tp 2>&1 | grep -v -i deprecat | tail -1
awk -F'|' -v T=times.txt 'BEGIN{while((getline l < T)>0){split(l,a," "); st[a[1]]=a[2]; du[a[1]]=a[3]}}
 {s=st[$1]; e=st[$2]+du[$2]; printf "%d|%.3f|%.3f|%s|%s\n", NR-1, s, e, $3, $4}' items.txt > timed.txt
IN="-i base.mp4"; FC=""; prev="0:v"; k=0
while IFS='|' read -r idx s e m sub; do
  IN="$IN -i tp_$(printf %02d $idx).png"
  FC="$FC[$prev][$((k+1)):v]overlay=0:230:enable='between(t,$s,$e)'[o$k];"; prev="o$k"; k=$((k+1))
done < timed.txt
/opt/homebrew/bin/ffmpeg -nostdin -y -v error $IN -filter_complex "$FC[$prev]format=yuv420p[v]" -map "[v]" -c:v libx264 -crf 18 -preset medium "$OUT.mp4"
awk -F'|' 'function ts(x){h=int(x/3600);m=int(x/60)%60;s=int(x)%60;ms=int((x-int(x))*1000+.5);return sprintf("%02d:%02d:%02d,%03d",h,m,s,ms)}
 {print NR; print ts($2)" --> "ts($3); print $4; if($5!="")print $5; print ""}' timed.txt > "$OUT.srt"
echo "完成: $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT.mp4")秒"
