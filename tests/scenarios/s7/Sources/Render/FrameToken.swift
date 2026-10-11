/// Identifies one frame on the render thread. Only valid on that thread.
struct FrameToken: Hashable {
    let id: Int
    let epoch: UInt64
}
