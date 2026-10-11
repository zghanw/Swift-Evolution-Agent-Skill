---
name: swift-evolution
description: Use when writing, reviewing or upgrading Swift code where the right answer depends on the Swift version or language mode, such as picking a language feature or standard library API, deciding whether a Swift Evolution proposal (SE-NNNN) has shipped, answering what's new in Swift 6, 6.2, 6.3 or 6.4, reading swift-tools-version or swiftLanguageModes, or turning on upcoming feature flags.
license: Apache-2.0
---

# Swift Evolution

Your memory of which Swift release shipped a feature is unreliable from Swift 6.0 on. `references/` is synced from the official Swift Evolution feed. Trust it over your memory, blog posts and other skills.

## 1. Find the project's Swift version

- `// swift-tools-version: X.Y`, the first line of `Package.swift`, is the oldest toolchain the project supports. Its `swiftLanguageModes` is the language mode.
- Xcode projects: `SWIFT_VERSION` is the language mode, not the compiler. Map the Xcode version to Swift with `references/releases.md`.
- Also: `.swift-version`, CI images such as `swift:6.4`, `swift --version`.
- If you can't tell, ask. Details: `references/toolchain-detection.md`.

## 2. Search the references before picking an approach

Do this even when you are sure of the answer.

- Search `references/versions/` and `references/in-flight.md` for the task's keywords, for example `grep -il cancel references/versions/*.md references/in-flight.md`.
- The file name is the release: an entry in `versions/6.4.md` shipped in Swift 6.4. Nothing in `in-flight.md` is in any release.
- Entries from Swift 6.0 on link to the full proposal in `references/proposals/`. Read it for the exact API before you write code with it.
- "What's new in Swift X.Y?": read `references/versions/X.Y.md`. It is the complete list. Blog posts and WWDC summaries mix accepted proposals in with shipped ones.
- Upcoming feature flags, and the language mode that turns each one on: `references/upcoming-feature-flags.md`.

## 3. Decide

| Found in | Project's Swift is at least that version? | Do |
|---|---|---|
| `versions/X.Y.md` | yes | Use it when it fits the task better than an older workaround. |
| `versions/X.Y.md` | no | Don't use it. Say "requires Swift X.Y" with the SE number, and use the older approach. |
| `in-flight.md` | - | It is in no release. Never present it as available. |
| nowhere | - | Not a Swift Evolution change. Don't claim a release for it. |

- Before saying something can't be done in Swift, search the references. It may have shipped after your training data.
- Apple platforms: a new standard library or concurrency API needs the OS that ships that Swift release, unless its proposal says it back-deploys. New syntax and compile-time checks need no particular OS. If the deployment target is older, guard the API with `if #available` and keep the older approach as the fallback.

## 4. Cite

For each version-specific choice, give the SE number, the release, and the proposal link from the references.
