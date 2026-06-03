import { app, BrowserWindow, globalShortcut, systemPreferences, dialog, screen, ipcMain, Notification, clipboard, shell } from 'electron'
import path from 'path'
import { DEFAULT_SHORTCUT } from './constants'
import { createOverlayWindow, closeOverlayWindow } from './overlay-window'
import { captureRegion } from './screenshot'

let mainWindow: BrowserWindow | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    title: 'Mac Screenshot Assistant',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function checkScreenCapturePermission(): boolean {
  if (process.platform !== 'darwin') return true

  const status = systemPreferences.getMediaAccessStatus('screen')
  return status === 'granted'
}

async function showPermissionDialog() {
  const result = await dialog.showMessageBox({
    type: 'warning',
    title: '需要屏幕录制权限',
    message: 'Mac Screenshot Assistant 需要屏幕录制权限才能截图。',
    detail: '请前往「系统设置 → 隐私与安全性 → 屏幕录制」中启用权限，然后重新启动应用。',
    buttons: ['前往系统设置', '取消'],
    defaultId: 0,
    cancelId: 1,
  })

  if (result.response === 0) {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture')
  }
}

async function startScreenshot() {
  const hasPermission = checkScreenCapturePermission()
  if (!hasPermission) {
    showPermissionDialog()
    return
  }

  try {
    createOverlayWindow()
  } catch (error) {
    console.error('打开遮罩窗口失败:', error)
    dialog.showErrorBox('截图失败', '无法打开截图遮罩层，请检查应用权限或重启应用。')
  }
}

app.whenReady().then(() => {
  createMainWindow()

  // 注册全局快捷键
  const registered = globalShortcut.register(DEFAULT_SHORTCUT, () => {
    startScreenshot()
  })

  if (!registered) {
    console.warn(`快捷键 ${DEFAULT_SHORTCUT} 注册失败，可能已被其他应用占用`)
    dialog.showWarningBox(
      '快捷键冲突',
      `无法注册快捷键 ${DEFAULT_SHORTCUT}，可能已被其他应用占用。请检查系统设置或修改快捷键。`
    )
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// IPC 处理：选区完成
ipcMain.on('overlay:selection', async (_event, rect: { x: number; y: number; width: number; height: number }) => {
  console.log('收到选区坐标:', rect)
  closeOverlayWindow()

  try {
    const filePath = await captureRegion(rect)
    console.log('截图已保存:', filePath)

    // 发送系统通知
    new Notification({
      title: '截图已保存',
      body: filePath,
      silent: true,
    }).show()

    // 将路径写入剪贴板
    clipboard.writeText(filePath)

    // 通知主窗口（如果有的话）
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('screenshot:result', { success: true, path: filePath })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('截图保存失败:', errorMsg)

    new Notification({
      title: '截图保存失败',
      body: errorMsg,
      silent: true,
    }).show()

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('screenshot:result', { success: false, error: errorMsg })
    }
  }
})

// IPC 处理：取消截图
ipcMain.on('overlay:cancel', () => {
  closeOverlayWindow()
})
