import Foundation

public protocol ImageCacheDelegate: AnyObject, Sendable {
    func imageCache(_ cache: ImageCache, didEvict key: String)
}

public final class ImageCache: Sendable {
    public let capacity: Int
    // TODO: keep a weak reference to the delegate

    public init(capacity: Int) {
        self.capacity = capacity
    }
}
