import AppKit
// 使い方: swift telop.swift <項目ファイル> <出力の接頭辞>
// 項目ファイルは1行1枚「開始区間|終了区間|主線|副線」
let args = CommandLine.arguments
let lines = (try! String(contentsOfFile: args[1])).split(separator: "\n").map {
  $0.split(separator: "|", omittingEmptySubsequences: false).map(String.init) }
let W: CGFloat = 1080, H: CGFloat = 300
func f(_ ns: [String], _ s: CGFloat) -> NSFont {
  for n in ns { if let x = NSFont(name: n, size: s) { return x } }
  return NSFont.systemFont(ofSize: s, weight: .bold)
}
for (i, c) in lines.enumerated() where c.count >= 3 {
  let main = c[2], sub = c.count > 3 ? c[3] : ""
  var bs: CGFloat = 74
  while (main as NSString).size(withAttributes: [.font: f(["HiraginoSans-W8","HiraginoSans-W7"], bs)]).width > W - 140, bs > 44 { bs -= 2 }
  let big = f(["HiraginoSans-W8","HiraginoSans-W7"], bs)
  let small = f(["HiraginoSans-W6","HiraginoSans-W5"], 40)
  let mw = (main as NSString).size(withAttributes: [.font: big]).width
  let sw = sub.isEmpty ? 0 : (sub as NSString).size(withAttributes: [.font: small]).width
  let plateW = min(W - 60, max(mw, sw) + 90)
  let plateH: CGFloat = sub.isEmpty ? bs + 60 : bs + 110
  let img = NSImage(size: NSSize(width: W, height: H)); img.lockFocus()
  NSColor.clear.set(); NSRect(x: 0, y: 0, width: W, height: H).fill()
  // 明るい空の上でも読めるように、半透明の黒い板を敷く
  let plate = NSRect(x: (W - plateW) / 2, y: H - plateH - 10, width: plateW, height: plateH)
  NSColor.black.withAlphaComponent(0.62).setFill()
  NSBezierPath(roundedRect: plate, xRadius: 28, yRadius: 28).fill()
  let p = NSMutableParagraphStyle(); p.alignment = .center
  let top = plate.maxY
  (main as NSString).draw(in: NSRect(x: 0, y: top - bs - 34, width: W, height: bs + 20),
    withAttributes: [.font: big, .foregroundColor: NSColor.white, .paragraphStyle: p])
  if !sub.isEmpty {
    (sub as NSString).draw(in: NSRect(x: 0, y: plate.minY + 22, width: W, height: 56),
      withAttributes: [.font: small, .foregroundColor: NSColor(calibratedRed: 1, green: 0.86, blue: 0.35, alpha: 1), .paragraphStyle: p])
  }
  img.unlockFocus()
  var r = NSRect(x: 0, y: 0, width: W, height: H)
  let rep = NSBitmapImageRep(cgImage: img.cgImage(forProposedRect: &r, context: nil, hints: nil)!)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: String(format: "%@_%02d.png", args[2], i)))
}
print("テロップ \(lines.count) 枚")
