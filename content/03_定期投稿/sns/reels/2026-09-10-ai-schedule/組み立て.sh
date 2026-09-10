set -e
FF=/usr/local/bin/ffmpeg
{
 # 素材の切り出し（[0]=Gemini設定 [1]=Geminiカレンダー [2]=Gemini Gmail [3]=ChatGPTプラグイン [4]=ChatGPTスケジュール）
 cat <<'SEG'
[1]trim=46.0:50.5,setpts=(PTS-STARTPTS)/1.5[h1];
[1]trim=1.0:4.0,setpts=(PTS-STARTPTS)/1.2[h2];
[0]trim=5.2:6.8,setpts=(PTS-STARTPTS)/1.0[g1];
[0]trim=7.8:11.0,setpts=(PTS-STARTPTS)/1.0[g2];
[1]trim=8.0:28.5,setpts=(PTS-STARTPTS)/5.0[g3];
[1]trim=28.5:35.0,setpts=(PTS-STARTPTS)/2.5[g4];
[1]trim=46.0:50.5,setpts=(PTS-STARTPTS)/1.8[g5];
[1]trim=52.0:56.5,setpts=(PTS-STARTPTS)/2.2[g6];
[1]trim=71.5:78.0,setpts=(PTS-STARTPTS)/1.8[g7];
[1]trim=79.0:88.0,setpts=(PTS-STARTPTS)/2.8[g8];
[1]trim=107.5:113.0,setpts=(PTS-STARTPTS)/1.8[g9];
[2]trim=2.0:17.5,setpts=(PTS-STARTPTS)/5.0[g10];
[2]trim=17.5:27.0,setpts=(PTS-STARTPTS)/3.0[g11];
[2]trim=28.0:34.0,setpts=(PTS-STARTPTS)/1.5[g12];
[2]trim=51.0:58.0,setpts=(PTS-STARTPTS)/2.5[g13];
[2]trim=58.0:65.0,setpts=(PTS-STARTPTS)/1.5[g14];
[2]trim=65.0:72.0,setpts=(PTS-STARTPTS)/2.8[g15];
[3]trim=7.0:13.0,setpts=(PTS-STARTPTS)/1.5[k1];
[3]trim=17.0:23.0,setpts=(PTS-STARTPTS)/1.5[k2];
[4]trim=0.0:4.0,setpts=(PTS-STARTPTS)/1.3[k3];
[4]trim=5.0:28.0,setpts=(PTS-STARTPTS)/6.0[k4];
[4]trim=35.0:41.0,setpts=(PTS-STARTPTS)/1.6[k5];
[4]trim=42.0:47.0,setpts=(PTS-STARTPTS)/1.4[k6];
[4]trim=59.0:66.0,setpts=(PTS-STARTPTS)/2.8[k7];
[4]trim=72.0:83.0,setpts=(PTS-STARTPTS)/1.8[k8];
[h1][h2][g1][g2][g3][g4][g5][g6][g7][g8][g9][g10][g11][g12][g13][g14][g15][k1][k2][k3][k4][k5][k6][k7][k8]concat=n=25:v=1:a=0[cat];
color=c=0x0d0d12:s=1080x1920:r=30[bg];
[bg][cat]overlay=0:150:shortest=1[base];
SEG
 # テロップを時間指定で重ねる
 i=0; prev=base
 while IFS='|' read -r st en main sub; do
   printf "[%s][%d:v]overlay=0:1200:enable='between(t,%s,%s)'[o%d];" "$prev" "$((i+5))" "$st" "$en" "$i"
   prev="o$i"; i=$((i+1))
 done < items.txt
 echo "[$prev]fps=30,format=yuv420p[v]"
} | tr -d '\n' | sed 's/;\[v\]/;[v]/' > fcf.txt
sed -i '' 's/\[o15\]\[v\]/[o15]/' fcf.txt
IN="-i na.mp4 -i nb.mp4 -i nc.mp4 -i nd.mp4 -i ne.mp4"
for n in $(seq -f "%02g" 0 $(( $(wc -l < items.txt) - 1 ))); do IN="$IN -i tp$n.png"; done
$FF -y -v error $IN -filter_complex_script fcf.txt -map "[v]" -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p reel.mp4
/usr/local/bin/ffprobe -v error -show_entries format=duration -show_entries stream=width,height -of default=noprint_wrappers=1 reel.mp4
