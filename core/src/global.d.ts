declare global {
  interface Window {
    requestIdleCallback?: (callback: (time: number) => void) => void
    cancelIdleCallback?: (callback: (time: number) => void) => void
  }
}
