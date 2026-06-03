# 🖼️ Mac Screenshot Assistant

快速截图工具，专为开发者设计。一键截图，自动保存，路径直达剪贴板。

## 功能特性

- ⚡ **全局快捷键**：`Command + Shift + A` 随时截图
- 🖱️ **框选截图**：屏幕变暗，拖拽框选任意区域
- 💾 **自动保存**：截图自动保存到 `~/Pictures/MacScreenshotAssistant/`
- 📋 **剪贴板直达**：截图路径自动复制到剪贴板
- 🔔 **系统通知**：保存成功后推送原生通知
- ⌨️ **ESC 取消**：按 ESC 随时取消截图

## 安装

### 从 DMG 安装

1. 下载 `Mac Screenshot Assistant-x.x.x.dmg`
2. 双击打开 DMG，将应用拖入 `Applications` 文件夹
3. 首次打开时，前往「系统设置 → 隐私与安全性」点击「仍要打开」
4. 授予「屏幕录制」权限（应用会自动提示）

### 从源码运行

```bash
# 克隆仓库
git clone <repo-url>
cd mac-screenshot-assistant

# 安装依赖
npm install

# 开发模式运行
npm run electron:dev

# 构建生产版本
npm run build

# 打包 DMG
npm run electron:build
```

## 使用说明

1. 按下 `Command + Shift + A`
2. 屏幕进入截图模式（半透明遮罩）
3. 拖拽鼠标框选需要截图的区域
4. 松开鼠标，截图自动保存
5. 截图路径已复制到剪贴板，直接粘贴即可

**取消截图**：在截图模式下按 `ESC` 键

## 截图保存位置

```
~/Pictures/MacScreenshotAssistant/
├── screenshot-20250603-154230.png
├── screenshot-20250603-154845.png
└── ...
```

## 权限说明

首次使用需要授予「屏幕录制」权限：

1. 系统会弹出提示框
2. 点击「前往系统设置」
3. 在「屏幕录制」列表中勾选「Mac Screenshot Assistant」
4. 重新启动应用

## 技术栈

- Electron
- React + TypeScript
- Vite

## 开发计划

| 阶段 | 功能 |
|------|------|
| MVP | 快捷键截图、框选、保存、通知 |
| Phase 2 | OCR 文字识别 |
| Phase 3 | AI 错误分析 |
| Phase 4 | 自动生成 Markdown Bug 记录 |
| Phase 5 | Terminal 自动识别截图 |

## 许可证

MIT
