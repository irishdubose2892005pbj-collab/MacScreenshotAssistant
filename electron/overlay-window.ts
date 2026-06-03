import { BrowserWindow, screen } from 'electron'
import path from 'path'

let overlayWindow: BrowserWindow | null = null

export function createOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.focus()
    return overlayWindow
  }

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  overlayWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // 加载遮罩层页面
  if (process.env.VITE_DEV_SERVER_URL) {
    const overlayUrl = new URL('src/overlay/overlay.html', process.env.VITE_DEV_SERVER_URL).href
    overlayWindow.loadURL(overlayUrl)
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../dist/src/overlay/overlay.html'))
  }

  overlayWindow.setIgnoreMouseEvents(false)
  overlayWindow.setVisibleOnAllWorkspaces(true)

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })

  return overlayWindow
}

export function closeOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.close()
    overlayWindow = null
  }
}

export function getOverlayWindow() {
  return overlayWindow
}
