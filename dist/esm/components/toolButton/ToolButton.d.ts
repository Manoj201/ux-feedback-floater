import React from 'react';
import './ToolButton.css';
interface ToolButtonType {
    onclickTool: () => void;
    icon: any;
    isActive: boolean;
}
declare const ToolButton: React.FC<ToolButtonType>;
export default ToolButton;
