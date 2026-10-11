public struct ScanResult: Sendable { public let payload: String }
public enum ScanError: Error { case cameraUnavailable, cancelled }

public protocol BarcodeScannerDelegate: AnyObject {
    func scanner(_ scanner: BarcodeScanner, didScan result: ScanResult)
    func scanner(_ scanner: BarcodeScanner, didFailWith error: ScanError)
}

/// Third-party SDK type; we can't change it. Calls its delegate exactly once per startScan().
public final class BarcodeScanner {
    public weak var delegate: BarcodeScannerDelegate?
    public init() {}
    public func startScan() { /* SDK implementation */ }
}
