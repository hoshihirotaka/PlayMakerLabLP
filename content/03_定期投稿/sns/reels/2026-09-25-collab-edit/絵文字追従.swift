// 使い方: swift emoji.swift 入力.mp4 出力.mp4 [顔の一覧.csv]
// 子どもの顔だけに絵文字を追従させる。星さん（後ろに立っている大人）は避ける。
// 固定カメラなので、顔の「高さ」と「横位置」で人を見分けている。
import AVFoundation
import AppKit
import CoreImage
import Vision

let src = CommandLine.arguments[1], dst = CommandLine.arguments[2]
let csvOut = CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : ""
let EMOJI = "😄"
let SCALE: CGFloat = 2.2      // 顔の枠に対する絵文字の大きさ
let MINSIDE: CGFloat = 240    // 遠くても小さくしすぎない
let MAXGAP = Int(ProcessInfo.processInfo.environment["MAXGAP"] ?? "45")!   // 検出が途切れたとき何フレームまで同じ位置でつなぐか。頭がずっと画面にあると目で確認できた区間だけ大きくする
let SMOOTH = 5                // 移動平均の窓（ガタつき取り）
// 星さんを避ける線：顔の中心がこれより上（画面の上側）で、かつ右端でなければ星さん
let ADULT_LINE_Y = CGFloat(Double(ProcessInfo.processInfo.environment["ADULT_Y"] ?? "732")!)   // これより上（画面の上側）の顔は大人。寄った画角は732、元の画角は770
let RIGHT_KID_X = CGFloat(Double(ProcessInfo.processInfo.environment["RIGHT_X"] ?? "9999")!)  // これより右は右端の子。寄った画角では画面外なので9999

let asset = AVURLAsset(url: URL(fileURLWithPath: src))
let track = asset.tracks(withMediaType: .video).first!
let W = track.naturalSize.width, H = track.naturalSize.height

func reader() -> (AVAssetReader, AVAssetReaderTrackOutput) {
  let r = try! AVAssetReader(asset: asset)
  let o = AVAssetReaderTrackOutput(track: track, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
  r.add(o); r.startReading(); return (r, o)
}

// --- 1周目：顔を探す ---------------------------------------------------
typealias Box = (cx: CGFloat, cy: CGFloat, side: CGFloat)   // 中心（上から）と一辺(px)
var perFrame = [[Box]]()
var log = "frame,cx,cy_from_top,side,kept\n"
do {
  let (_, out) = reader()
  let req = VNDetectFaceRectanglesRequest()
  req.revision = VNDetectFaceRectanglesRequestRevision3
  var f = 0
  while let sb = out.copyNextSampleBuffer() {
    guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    try? VNImageRequestHandler(cvPixelBuffer: pb, orientation: .up, options: [:]).perform([req])
    var kept = [Box]()
    for o in req.results ?? [] {
      let b = o.boundingBox
      let cx = b.midX * W, cy = (1 - b.midY) * H, side = max(b.width * W, b.height * H)
      let isAdult = cy < ADULT_LINE_Y   // 右上から入ってくる星さんも大人として外す
      log += String(format: "%d,%.0f,%.0f,%.0f,%d\n", f, cx, cy, side, isAdult ? 0 : 1)
      if !isAdult { kept.append((cx, cy, side)) }
    }
    perFrame.append(kept); f += 1
  }
}
if !csvOut.isEmpty { try! log.write(toFile: csvOut, atomically: true, encoding: .utf8) }
let n = perFrame.count

// --- 人ごとに分ける（左の子 / 右端の子）→ 補間 → ならす --------------
func slotOf(_ b: Box) -> Int { b.cx > RIGHT_KID_X ? 1 : 0 }
var tracks = [[Box?]](repeating: [Box?](repeating: nil, count: n), count: 2)
for (f, boxes) in perFrame.enumerated() {
  for s in 0..<2 {   // 同じ枠に複数あれば大きいほうを1つだけ（同じ人に2つ乗せない）
    if let best = boxes.filter({ slotOf($0) == s }).max(by: { $0.side < $1.side }) { tracks[s][f] = best }
  }
}
for s in 0..<2 {
  var i = 0
  while i < n {
    if tracks[s][i] == nil, i > 0, let p = tracks[s][i-1] {
      var j = i; while j < n, tracks[s][j] == nil { j += 1 }
      if j < n, j - i <= MAXGAP, let q = tracks[s][j] {
        for k in i..<j { let t = CGFloat(k - i + 1) / CGFloat(j - i + 1)
          tracks[s][k] = (p.cx + (q.cx-p.cx)*t, p.cy + (q.cy-p.cy)*t, p.side + (q.side-p.side)*t) }
      }
      i = j
    } else { i += 1 }
  }
  // 最初と最後の空白は近い位置で埋める。主役の子は常に画面にいる。
  // 右端の子は、検出が10フレーム以上あるときだけ（誤検出1回で絵文字が居座らないように）
  if (s == 0 || tracks[1].compactMap({ $0 }).count >= 10), let first = tracks[s].firstIndex(where: { $0 != nil }), let last = tracks[s].lastIndex(where: { $0 != nil }) {
    for k in 0..<first { tracks[s][k] = tracks[s][first] }
    for k in (last+1)..<n { tracks[s][k] = tracks[s][last] }
  }
  let raw = tracks[s]
  for f in 0..<n where raw[f] != nil {
    var a: CGFloat = 0, b: CGFloat = 0, c: CGFloat = 0, m: CGFloat = 0
    for k in max(0, f-SMOOTH/2)...min(n-1, f+SMOOTH/2) { if let v = raw[k] { a += v.cx; b += v.cy; c += v.side; m += 1 } }
    tracks[s][f] = (a/m, b/m, c/m)
  }
}

// --- 絵文字を1枚だけ用意 ------------------------------------------------
let EM: CGFloat = 512
let img = NSImage(size: NSSize(width: EM, height: EM)); img.lockFocus()
(EMOJI as NSString).draw(in: NSRect(x: 0, y: 0, width: EM, height: EM),
  withAttributes: [.font: NSFont(name: "Apple Color Emoji", size: EM * 0.78)!]); img.unlockFocus()
var pr = NSRect(x: 0, y: 0, width: EM, height: EM)
let emojiCI = CIImage(cgImage: img.cgImage(forProposedRect: &pr, context: nil, hints: nil)!)

// --- 2周目：描いて書き出す ------------------------------------------------
try? FileManager.default.removeItem(atPath: dst)
let writer = try! AVAssetWriter(url: URL(fileURLWithPath: dst), fileType: .mp4)
let wIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: Int(W), AVVideoHeightKey: Int(H),
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 14_000_000]])
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wIn, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: Int(W), kCVPixelBufferHeightKey as String: Int(H)])
writer.add(wIn); writer.startWriting(); writer.startSession(atSourceTime: .zero)
let ctx = CIContext()
let (_, out2) = reader()
var f = 0, drawn = [0, 0]
while let sb = out2.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  var frame = CIImage(cvPixelBuffer: pb)
  for s in 0..<2 {
    guard f < n, let b = tracks[s][f] else { continue }
    let side = max(b.side * SCALE, MINSIDE), sc = side / EM
    let cyCI = H - b.cy                       // CoreImage は原点が左下
    frame = emojiCI.transformed(by: CGAffineTransform(scaleX: sc, y: sc)
      .concatenating(CGAffineTransform(translationX: b.cx - side/2, y: cyCI - side/2))).composited(over: frame)
    drawn[s] += 1
  }
  var np: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &np)
  ctx.render(frame, to: np!)
  while !wIn.isReadyForMoreMediaData { usleep(2000) }
  ad.append(np!, withPresentationTime: CMSampleBufferGetPresentationTimeStamp(sb)); f += 1
}
wIn.markAsFinished()
let sem = DispatchSemaphore(value: 0); writer.finishWriting { sem.signal() }; sem.wait()
print("\(f)フレーム  左の子に絵文字=\(drawn[0])  右端の子に絵文字=\(drawn[1])")
