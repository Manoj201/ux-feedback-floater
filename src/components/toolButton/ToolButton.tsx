import React from 'react'
import IconButton from '@mui/material/IconButton'

import './ToolButton.css'

interface ToolButtonType {
  onclickTool: () => void
  icon: any
  isActive: boolean
}

const ToolButton: React.FC<ToolButtonType> = ({ onclickTool, icon: Icon, isActive }: ToolButtonType) => {
  return (
    <div className='canvas-tool-button-wrapper'>
      <IconButton onClick={onclickTool}>
        <Icon sx={{ color: isActive ? 'white' : 'black' }} />
      </IconButton>
    </div>
  )
}

export default ToolButton
