'use client'
// Lenis was removed — native scroll is GPU-composited and faster.
// This no-op is intentionally kept so stale dynamic-import chunks (dev HMR cache
// or production service workers that haven't refreshed yet) can still resolve the
// module reference without throwing "module factory not available".
export function SmoothScrollProvider() {
  return null
}
