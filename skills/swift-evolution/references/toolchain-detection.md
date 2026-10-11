# Finding the Swift version and language mode

## Swift packages

- `// swift-tools-version: X.Y` (first line of `Package.swift`): the oldest toolchain that can build the package. Features up to X.Y are safe to use. A newer toolchain may be installed, but don't rely on it.
- Language mode: `swiftLanguageModes: [.v5]` (tools 6.0 and later) or `swiftLanguageVersions` (earlier). If neither is set, tools 6.0 and later default to Swift 6 mode, earlier tools to Swift 5 mode.
- Per-target overrides: `.swiftLanguageMode(.v5)` in a target's `swiftSettings`.
- Upcoming features already on: `.enableUpcomingFeature("Name")` in `swiftSettings`.

## Xcode projects

- `SWIFT_VERSION` in build settings or `project.pbxproj` is the language mode (5 or 6), not the compiler version.
- The compiler comes with Xcode: check `xcodebuild -version`, `.xcode-version`, or the Xcode version in CI config. Map it to Swift with `releases.md`.

## Other signals

- `.swift-version`, Dockerfiles and CI images (`swift:6.4-noble`), `swift --version`.
- If signals disagree, use the lowest version.

## Compiler version and language mode are different things

- The compiler version decides which features exist.
- The language mode decides which upcoming features are on by default (`upcoming-feature-flags.md`). A Swift 6.4 compiler in Swift 5 mode still has the 6.4 features that aren't tied to a language mode.

## Apple deployment targets

- `platforms:` in `Package.swift`, or `IPHONEOS_DEPLOYMENT_TARGET` and similar build settings.
- Standard library and concurrency APIs that need runtime support only work on OS versions that ship that runtime. The proposal's "ABI compatibility" section says whether the feature is back-deployed. If it isn't, use `if #available` with a fallback.
- Pure compile-time features (new syntax, new checks) have no OS requirement.
