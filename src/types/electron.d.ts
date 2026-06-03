export interface ScreenshotResult {
  success: boolean
  path?: string
  error?: string
}

export interface ElectronAPI {
  sendSelection: (rect: { x: number; y: number; width: number; height: number }) => void
  sendCancel: () => void
  onScreenshotResult: (callback: (result: ScreenshotResult) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
