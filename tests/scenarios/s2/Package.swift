// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "ImageCache",
    platforms: [.macOS(.v15), .iOS(.v18)],
    targets: [.target(name: "ImageCache")]
)
