import React, { useCallback } from 'react'
import { useSelection } from './useSelection'
import SelectionBox from './SelectionBox'

const Overlay: React.FC = () => {
  const handleSelect = useCallback((rect: { x: number; y: number; width: number; height: number }) => {
    if (window.electronAPI) {
      window.electronAPI.sendSelection(rect)
    }
  }, [])

  const handleCancel = useCallback(() => {
    if (window.electronAPI) {
      window.electronAPI.sendCancel()
    }
  }, [])

  const { isSelecting, currentRect } = useSelection(handleSelect, handleCancel)

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        cursor: isSelecting ? 'crosshair' : 'crosshair',
      }}
    >
      <SelectionBox rect={currentRect} />
    </div>
  )
}

export default Overlay
