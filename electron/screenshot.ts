import { exec } from 'child_process'
import { promisify } from 'util'
import { screen } from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)

export interface ScreenshotRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 获取截图保存目录
 */
export function getScreenshotDir(): string {
  const dir = path.join(os.homedir(), 'Pictures', 'MacScreenshotAssistant')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

/**
 * 生成截图文件名
 */
export function generateScreenshotFilename(): string {
  const now = new Date()
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace(/T/, '-')
    .replace(/\..+/, '')
  return `screenshot-${timestamp}.png`
}

/**
 * 获取当前鼠标所在的屏幕
 */
export function getCurrentDisplay() {
  const cursorPoint = screen.getCursorScreenPoint()
  return screen.getDisplayNearestPoint(cursorPoint)
}

/**
 * 使用 macOS screencapture 命令截取指定区域
 * 
 * 注意：坐标需要转换为物理像素（考虑 Retina scaleFactor）
 */
export async function captureRegion(rect: ScreenshotRect): Promise<string> {
  const display = getCurrentDisplay()
  const scaleFactor = display.scaleFactor

  // 将逻辑像素转换为物理像素
  const physicalRect = {
    x: Math.round(rect.x * scaleFactor),
    y: Math.round(rect.y * scaleFactor),
    width: Math.round(rect.width * scaleFactor),
    height: Math.round(rect.height * scaleFactor),
  }

  const screenshotDir = getScreenshotDir()
  const filename = generateScreenshotFilename()
  const outputPath = path.join(screenshotDir, filename)

  // 使用 screencapture 命令截取指定区域
  // -R<x,y,w,h> : 指定截取区域（物理像素）
  // -x : 不播放截图声音
  // -t png : 输出 PNG 格式
  const cmd = `screencapture -R${physicalRect.x},${physicalRect.y},${physicalRect.width},${physicalRect.height} -x -t png "${outputPath}"`

  try {
    await execAsync(cmd)

    // 验证文件是否成功生成
    if (!fs.existsSync(outputPath)) {
      throw new Error('截图文件未生成')
    }

    return outputPath
  } catch (error) {
    console.error('截图失败:', error)
    throw new Error(`截图失败: ${error instanceof Error ? error.message : String(error)}`)
  }
}
