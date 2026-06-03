import { useState, useCallback, useEffect } from 'react'

export interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
}

export function useSelection(onSelect: (rect: SelectionRect) => void, onCancel: () => void) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentRect, setCurrentRect] = useState<SelectionRect | null>(null)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsSelecting(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setCurrentRect({
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return

      const x = Math.min(startPos.x, e.clientX)
      const y = Math.min(startPos.y, e.clientY)
      const width = Math.abs(e.clientX - startPos.x)
      const height = Math.abs(e.clientY - startPos.y)

      setCurrentRect({ x, y, width, height })
    },
    [isSelecting, startPos]
  )

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting) return

      setIsSelecting(false)

      const x = Math.min(startPos.x, e.clientX)
      const y = Math.min(startPos.y, e.clientY)
      const width = Math.abs(e.clientX - startPos.x)
      const height = Math.abs(e.clientY - startPos.y)

      // 选区小于 10x10 视为无效
      if (width < 10 || height < 10) {
        onCancel()
        return
      }

      onSelect({ x, y, width, height })
    },
    [isSelecting, startPos, onSelect, onCancel]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    },
    [onCancel]
  )

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown])

  return { isSelecting, currentRect }
}
