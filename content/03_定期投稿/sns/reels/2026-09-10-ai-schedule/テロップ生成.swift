import AppKit
let W = 1080, H = 215
func f(_ ns: [String], _ s: CGFloat) -> NSFont {
  for n in ns { if let x = NSFont(name: n, size: s) { return x } }
  return NSFont.systemFont(ofSize: s, weight: .bold)
}
let lines = (try! String(contentsOfFile: "items.txt"))
  .split(separator: "\n").map { $0.split(separator: "|", omittingEmptySubsequences: false).map(String.init) }
for (i, c) in lines.enumerated() {
  guard c.count >= 3 else { continue }
  let main = c[2], sub = c.count > 3 ? c[3] : ""
  // 主線は幅に応じて自動で縮める
  var size: CGFloat = 70
  let big = { f(["HiraginoSans-W7","HiraginoSans-W6"], size) }
  while (main as NSString).size(withAttributes: [.font: big()]).width > CGFloat(W-70), size > 40 { size -= 2 }
  var ssize: CGFloat = 40
  let small = { f(["HiraginoSans-W4","HiraginoSans-W3"], ssize) }
  while !sub.isEmpty, (sub as NSString).size(withAttributes: [.font: small()]).width > CGFloat(W-70), ssize > 24 { ssize -= 1 }
  let img = NSImage(size: NSSize(width: W, height: H)); img.lockFocus()
  NSColor.clear.set(); NSRect(x:0,y:0,width:W,height:H).fill()
  let p = NSMutableParagraphStyle(); p.alignment = .center
  let sh = NSShadow(); sh.shadowColor = NSColor.black.withAlphaComponent(0.95)
  sh.shadowBlurRadius = 12; sh.shadowOffset = NSSize(width: 0, height: -2)
  let hasSub = !sub.isEmpty
  (main as NSString).draw(in: NSRect(x: 35, y: hasSub ? 82 : 62, width: Double(W-70), height: Double(size)+22),
    withAttributes: [.font: big(), .foregroundColor: NSColor.white, .paragraphStyle: p, .shadow: sh])
  if hasSub {
    (sub as NSString).draw(in: NSRect(x: 35, y: 26, width: Double(W-70), height: Double(ssize)+18),
      withAttributes: [.font: small(),
        .foregroundColor: NSColor(calibratedRed:0.60,green:0.79,blue:1.0,alpha:1),
        .paragraphStyle: p, .shadow: sh])
  }
  img.unlockFocus()
  var r = NSRect(x:0,y:0,width:W,height:H)
  let rep = NSBitmapImageRep(cgImage: img.cgImage(forProposedRect:&r, context:nil, hints:nil)!)
  try! rep.representation(using: .png, properties: [:])!
    .write(to: URL(fileURLWithPath: String(format: "tp%02d.png", i)))
}
print("テロップ \(lines.count) 枚")
