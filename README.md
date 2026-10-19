# Swift Evolution Agent Skill

An agent skill that stops AI coding agents from guessing which Swift features your toolchain has.

<!-- sync:stamp -->Synced from Swift Evolution [`f006bf3`](https://github.com/swiftlang/swift-evolution/commit/f006bf3cf2594bdd4a972f9126f93bd1743ed524), latest release: Swift 6.4.1 (2026-10-12)<!-- /sync:stamp -->

[![check](https://github.com/zghanw/Swift-Evolution-Agent-Skill/actions/workflows/check.yml/badge.svg)](https://github.com/zghanw/Swift-Evolution-Agent-Skill/actions/workflows/check.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Swift ships twice a year. Coding agents don't know what shipped after their training data, and they don't look it up. This skill gives them the official Swift Evolution record, synced every week, and a short procedure: find the project's Swift version, look the feature up, then use it, label it, or leave it out.

## Without and with the skill

Each task was run with two current coding models: 7 times without the skill and twice with it. The task packages are in [`tests/scenarios/`](tests/scenarios/) if you want to try them with your own agent.

| Task | Without the skill | With the skill |
|---|---|---|
| Weak delegate in a `Sendable` class, package on Swift 6.2 | 0/7: every run used `weak let` and said it shipped in 6.2. It shipped in SE-0481 (6.3), so the code doesn't compile | 2/2: `Mutex`-guarded weak box, with a note to switch to `weak let` at 6.3 |
| Bridge a delegate callback to async, "safest approach", Swift 6.4 | 0/7 considered the new `Continuation` type from SE-0528 (6.4) | 2/2 weighed it against the deployment target: one used it behind `#available`, one explained why `CheckedContinuation` still fits |
| Cleanup that must run after cancellation, Swift 6.4, iOS 18 target | 1/7 got both the language feature and the OS requirement right | 2/2: async `defer`, with the shield behind `#available` and a fallback for older OS versions |
| "What's new in Swift 6.4?" | Without web: 3/3 declined. With web: unreleased proposals reported as shipped | 2/2: all 26 proposals, nothing unreleased |
| `~Sendable` on a Swift 6.3 package (not mentioned anywhere in the skill) | not run | 2/2: knew SE-0518 (6.4) is too new and used the 6.3 pattern |

### Example: Swift 6.2 package, "store a weak reference to the delegate in this `Sendable` final class"

Without the skill (7 of 7 runs):

<!-- no-compile -->
```swift
// "`weak let` is in Swift 6.2", so the class stays Sendable.
public weak let delegate: (any ImageCacheDelegate)?
```

`weak let` arrived in Swift 6.3, so this fails to build with the package's 6.2 toolchain.

With the skill:

<!-- no-compile -->
```swift
// `weak let` is SE-0481 (6.3) and this package is on 6.2, so a Mutex-guarded weak box instead.
private struct WeakDelegate { weak var value: (any ImageCacheDelegate)? }
private let weakDelegate = Mutex(WeakDelegate())
```

## Install

```bash
npx skills add zghanw/Swift-Evolution-Agent-Skill
```

The [`skills`](https://github.com/vercel-labs/skills) CLI installs it for more than 50 agents, including Claude Code, Codex, Cursor and Windsurf. To install by hand, copy `skills/swift-evolution/` into your agent's skills folder: `~/.claude/skills/` for Claude Code, `~/.agents/skills/` for Codex, Cursor and most others.

## What's inside

| Path | What it is |
|---|---|
| [`SKILL.md`](skills/swift-evolution/SKILL.md) | The procedure the agent follows |
| [`references/versions/`](skills/swift-evolution/references/versions/) | One file per Swift release: every proposal implemented in it, the release date, Xcode version and Apple OS runtime |
| [`references/proposals/`](skills/swift-evolution/references/proposals/) | Full text of every proposal implemented since Swift 6.0, so agents can read the API and its back-deployment notes offline |
| [`references/in-flight.md`](skills/swift-evolution/references/in-flight.md) | Accepted, in review and `Next` proposals: not in any release |
| [`references/upcoming-feature-flags.md`](skills/swift-evolution/references/upcoming-feature-flags.md) | Every upcoming feature flag and the language mode that turns it on |
| [`references/releases.md`](skills/swift-evolution/references/releases.md) | Swift releases, Xcode versions and the Apple OS releases that ship each runtime |
| [`references/toolchain-detection.md`](skills/swift-evolution/references/toolchain-detection.md) | How to find a project's Swift version and language mode |

## How it stays current

- **Weekly sync.** [`scripts/sync.mjs`](scripts/sync.mjs) (Node, no dependencies) rebuilds `references/` from the [Swift Evolution feed](https://download.swift.org/swift-evolution/v1/evolution.json), the compiler's `Features.def` and availability table at the latest release tag, and swift.org's release list. A scheduled workflow opens a pull request when anything changes.
- **Release watch.** A daily workflow opens an issue when `swiftlang/swift` publishes a new release.
- **No hand-edited versions.** Generated files are never edited by hand, and CI checks that every SE number cited in the hand-written files matches the feed, so the prose can't drift from the data.

## Works well with

This skill covers which Swift features exist in your toolchain. For how to use them well, pair it with:

| Skill | Author |
|---|---|
| [SwiftUI Pro](https://github.com/twostraws/SwiftUI-Agent-Skill), [Swift Concurrency Pro](https://github.com/twostraws/Swift-Concurrency-Agent-Skill), [Swift Testing Pro](https://github.com/twostraws/Swift-Testing-Agent-Skill), [SwiftData Pro](https://github.com/twostraws/SwiftData-Agent-Skill) | Paul Hudson |
| [SwiftUI Expert](https://github.com/AvdLee/SwiftUI-Agent-Skill), [Swift Concurrency](https://github.com/AvdLee/Swift-Concurrency-Agent-Skill), [Swift Testing Expert](https://github.com/AvdLee/Swift-Testing-Agent-Skill) | Antoine van der Lee |

## License

Apache 2.0. The generated references contain material from the Swift project, also Apache 2.0; see [NOTICE](NOTICE). Not affiliated with Apple or the Swift project.

Made by [zghanw](https://github.com/zghanw).
