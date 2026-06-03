import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendSelection: (rect: { x: number; y: number; width: number; height: number }) => {
    ipcRenderer.send('overlay:selection', rect)
  },
  sendCancel: () => {
    ipcRenderer.send('overlay:cancel')
  },
  onScreenshotResult: (callback: (result: { success: boolean; path?: string; error?: string }) => void) => {
    ipcRenderer.on('screenshot:result', (_event, result) => callback(result))
  },
})
