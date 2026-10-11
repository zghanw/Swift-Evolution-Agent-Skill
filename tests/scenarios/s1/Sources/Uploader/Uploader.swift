import Foundation

public protocol UploadSession: Sendable {
    func send(_ file: URL) async throws
    /// Flushes buffers and releases the server-side lock. Bails out early if the task is cancelled.
    func close() async
}

public struct Uploader: Sendable {
    let openSession: @Sendable () async throws -> any UploadSession

    public func upload(_ file: URL) async throws {
        let session = try await openSession()
        try await session.send(file)
        await session.close()
    }
}
