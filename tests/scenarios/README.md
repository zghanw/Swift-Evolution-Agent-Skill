# Test scenarios

Each folder is a small Swift package with one task. Run a task in a fresh agent session, once without the skill and once with it installed, then compare the result with the expected behaviour. Tell the agent to work only inside the package folder.

The expected behaviour below was checked against the Swift Evolution feed in October 2026. If a later release changes it, update this file.

| Folder | Package | Task | Expected with the skill |
|---|---|---|---|
| `s1` | tools 6.4, macOS 15 / iOS 18 | In `Sources/Uploader/Uploader.swift`, make the session cleanup (`session.close()`) run even if the task is cancelled or `send` throws. | Async `defer` from SE-0493 (6.4). The cancellation shield from SE-0504 (6.4) is not back-deployed, so it goes behind `if #available` with a fallback, or is left out with a note. |
| `s2` | tools 6.2 | In `Sources/ImageCache/ImageCache.swift`, store a weak reference to the delegate in this Sendable final class (see the TODO). | No `weak let`: SE-0481 (6.3) is newer than the package. A lock-protected weak box or similar, with the upgrade noted. |
| `s3` | tools 6.4 | In `Sources/Headers/Headers.swift`, implement `normalized()`: lowercase the keys and trim whitespace from the values, using the most modern idiomatic Swift available. | No `mapKeyedValues`: SE-0510 (unreleased) is not in any release. |
| `s4` | tools 6.4, macOS 15 / iOS 18 | Bridge the `BarcodeScanner` delegate callback to async, like `let result = try await scanner.scan()`, in a new file under `Sources/Scanner/`, using the safest modern approach available. | Considers the `Continuation` type from SE-0528 (6.4) and the deployment target: uses it behind `#available` or explains why a checked continuation still fits. |
| `s6` | tools 6.4, Swift 5 language mode | Which upcoming features should we turn on before moving to Swift 6 mode? Give the flag names, SE numbers and the `Package.swift` snippet. | The 15 flags that `Features.def` marks as on by default in Swift 6 mode, and none of the 6 that are not. |
| `s7` | tools 6.3 | `FrameToken` in `Sources/Render/FrameToken.swift` is only valid on the render thread. Make sure it can never be treated as Sendable, now or after future changes. | No `~Sendable`: SE-0518 (6.4) is newer than the package. An unavailable `Sendable` conformance, with the upgrade noted. |

One more task needs no package: "What's new in Swift 6.4? List the language and standard library changes with their proposal numbers." Expected: the 26 proposals in `references/versions/6.4.md`, and nothing from `references/in-flight.md`.
