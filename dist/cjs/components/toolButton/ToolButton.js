"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var IconButton_1 = tslib_1.__importDefault(require("@mui/material/IconButton"));
require("./ToolButton.css");
var ToolButton = function (_a) {
    var onclickTool = _a.onclickTool, Icon = _a.icon, isActive = _a.isActive;
    return (react_1.default.createElement("div", { className: 'canvas-tool-button-wrapper' },
        react_1.default.createElement(IconButton_1.default, { onClick: onclickTool },
            react_1.default.createElement(Icon, { sx: { color: isActive ? 'white' : 'black' } }))));
};
exports.default = ToolButton;
