import React from 'react';
import IconButton from '@mui/material/IconButton';
import './ToolButton.css';
var ToolButton = function (_a) {
    var onclickTool = _a.onclickTool, Icon = _a.icon, isActive = _a.isActive;
    return (React.createElement("div", { className: 'canvas-tool-button-wrapper' },
        React.createElement(IconButton, { onClick: onclickTool },
            React.createElement(Icon, { sx: { color: isActive ? 'white' : 'black' } }))));
};
export default ToolButton;
