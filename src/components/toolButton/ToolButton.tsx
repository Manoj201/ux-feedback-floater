import React from 'react'
import IconButton from '@mui/material/IconButton'

import { ToolButtonType } from '../../types/component.types'
import './ToolButton.css'

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
