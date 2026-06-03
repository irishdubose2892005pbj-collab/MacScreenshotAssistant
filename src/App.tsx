import { useEffect, useState } from 'react'
import './App.css'
import { ScreenshotResult } from './types/electron'

function App() {
  const [lastResult, setLastResult] = useState<ScreenshotResult | null>(null)

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onScreenshotResult((result: ScreenshotResult) => {
        setLastResult(result)
      })
    }
  }, [])

  return (
    <div className="app">
      <div className="header">
        <h1>🖼️ Mac Screenshot Assistant</h1>
        <p className="subtitle">快速截图，一键保存</p>
      </div>

      <div className="shortcut-card">
        <div className="shortcut-label">截图快捷键</div>
        <div className="shortcut-keys">
          <kbd>⌘</kbd>
          <span>+</span>
          <kbd>Shift</kbd>
          <span>+</span>
          <kbd>A</kbd>
        </div>
      </div>

      <div className="steps">
        <h3>使用步骤</h3>
        <ol>
          <li>按下 <kbd>Command + Shift + A</kbd></li>
          <li>屏幕变暗后，拖拽鼠标框选截图区域</li>
          <li>松开鼠标完成截图，自动保存</li>
          <li>截图路径自动复制到剪贴板</li>
        </ol>
      </div>

      {lastResult && (
        <div className={`result-card ${lastResult.success ? 'success' : 'error'}`}>
          {lastResult.success ? (
            <>
              <div className="result-icon">✅</div>
              <div className="result-title">截图已保存</div>
              <div className="result-path">{lastResult.path}</div>
            </>
          ) : (
            <>
              <div className="result-icon">❌</div>
              <div className="result-title">截图失败</div>
              <div className="result-error">{lastResult.error}</div>
            </>
          )}
        </div>
      )}

      <div className="tips">
        <h3>💡 提示</h3>
        <ul>
          <li>首次使用需要授予「屏幕录制」权限</li>
          <li>按 <kbd>ESC</kbd> 可取消截图</li>
          <li>截图保存在 <code>~/Pictures/MacScreenshotAssistant/</code></li>
        </ul>
      </div>

      <div className="footer">
        <p>Mac Screenshot Assistant v1.0.0</p>
      </div>
    </div>
  )
}

export default App
