// swift-tools-version: 6.3
import PackageDescription

let package = Package(
    name: "Render",
    platforms: [.macOS(.v15), .iOS(.v18)],
    targets: [.target(name: "Render")]
)
