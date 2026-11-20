import AppKit
import WebKit
// 使い方: swift svg2png.swift <入力.svg> <出力.png>  … 1200×780 の図を 2倍（2400×1560）で書き出す。
// CoreSVG（NSImage）だと font-weight="bold" が効かないので、WebKitで描く。
let a = CommandLine.arguments
let svg = try! String(contentsOfFile: a[1])
let html = "<html><body style='margin:0;background:#fff'>\(svg)</body></html>"
class D: NSObject, WKNavigationDelegate {
  func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
      let c = WKSnapshotConfiguration(); c.rect = CGRect(x: 0, y: 0, width: 1200, height: 780); c.snapshotWidth = 2400
      w.takeSnapshot(with: c) { img, err in
        let cg = img!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
        try! NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
        print("\(cg.width)x\(cg.height)"); exit(0) }
    }
  }
}
let app = NSApplication.shared
let w = WKWebView(frame: NSRect(x: 0, y: 0, width: 1200, height: 780))
let d = D(); w.navigationDelegate = d
w.loadHTMLString(html, baseURL: nil)
DispatchQueue.main.asyncAfter(deadline: .now() + 20) { print("時間切れ"); exit(1) }
app.run()
