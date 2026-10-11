// swift-tools-version: 6.4
import PackageDescription

let package = Package(
    name: "Headers",
    platforms: [.macOS(.v15), .iOS(.v18)],
    targets: [.target(name: "Headers")]
)
