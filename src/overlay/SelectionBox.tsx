import React from 'react'
import { SelectionRect } from './useSelection'

interface SelectionBoxProps {
  rect: SelectionRect | null
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ rect }) => {
  if (!rect || rect.width === 0 || rect.height === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        border: '2px solid #fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* 尺寸显示 */}
      <div
        style={{
          position: 'absolute',
          bottom: -24,
          right: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 12,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {rect.width} × {rect.height}
      </div>
    </div>
  )
}

export default SelectionBox
