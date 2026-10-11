public struct RawHeaders: Sendable {
    public var fields: [String: String]

    /// Should return the fields with lowercased keys and whitespace-trimmed values.
    public func normalized() -> [String: String] {
        fatalError("TODO")
    }
}
