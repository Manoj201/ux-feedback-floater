"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
var react_1 = tslib_1.__importStar(require("react"));
var rough_esm_1 = tslib_1.__importDefault(require("roughjs/bundled/rough.esm"));
var htmlToImage = tslib_1.__importStar(require("html-to-image"));
require("./Canvas.css");
var icons_material_1 = require("@mui/icons-material");
var ToolButton_1 = tslib_1.__importDefault(require("../toolButton/ToolButton"));
var DrawingHelper_1 = require("./DrawingHelper");
var generator = rough_esm_1.default.generator();
var Canvas = function (_a) {
    var onClickSave = _a.onClickSave, onClickCancel = _a.onClickCancel;
    var _b = (0, DrawingHelper_1.useHistory)([]), elements = _b[0], setElements = _b[1], undo = _b[2], redo = _b[3], reset = _b[4];
    var _c = (0, react_1.useState)('none'), action = _c[0], setAction = _c[1];
    var _d = (0, react_1.useState)(null), selectedElement = _d[0], setSelectedElement = _d[1];
    var _e = (0, react_1.useState)('pencil'), tool = _e[0], setTool = _e[1];
    var color = 'red';
    var textAreaRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useLayoutEffect)(function () {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var roughCanvas = rough_esm_1.default.canvas(canvas);
        elements.forEach(function (element) {
            if (action === 'writing' && selectedElement.id === element.id)
                return;
            (0, DrawingHelper_1.drawElement)(roughCanvas, context, element);
        });
    }, [elements, action, selectedElement]);
    (0, react_1.useEffect)(function () {
        var undoRedoFunction = function (event) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
                if (event.shiftKey) {
                    redo();
                }
                else {
                    undo();
                }
            }
        };
        document.addEventListener('keydown', undoRedoFunction);
        return function () {
            document.removeEventListener('keydown', undoRedoFunction);
        };
    }, [undo, redo]);
    (0, react_1.useEffect)(function () {
        var textArea = textAreaRef.current;
        if (action === 'writing') {
            // textArea.focus();
            textArea.value = selectedElement.text;
        }
    }, [action, selectedElement]);
    var updateElement = function (id, x1, y1, x2, y2, type, options) {
        var elementsCopy = tslib_1.__spreadArray([], elements, true);
        switch (type) {
            case 'line':
            case 'rectangle':
                elementsCopy[id] = (0, DrawingHelper_1.createElement)(id, x1, y1, x2, y2, type, options, generator);
                break;
            case 'pencil':
                elementsCopy[id].points = tslib_1.__spreadArray(tslib_1.__spreadArray([], elementsCopy[id].points, true), [{ x: x2, y: y2 }], false);
                break;
            case 'text':
                var textWidth = document.getElementById('canvas').getContext('2d').measureText(options.text).width;
                var textHeight = 24;
                elementsCopy[id] = tslib_1.__assign(tslib_1.__assign({}, (0, DrawingHelper_1.createElement)(id, x1, y1, x1 + textWidth, y1 + textHeight, type, options, generator)), { text: options.text });
                break;
            default:
                throw new Error("Type not recognised: ".concat(type));
        }
        setElements(elementsCopy, true);
    };
    var handleMouseDown = function (event) {
        if (action === 'writing')
            return;
        var clientX = event.clientX, clientY = event.clientY;
        if (tool === 'selection') {
            var element = (0, DrawingHelper_1.getElementAtPosition)(clientX, clientY, elements);
            if (element) {
                if (element.type === 'pencil') {
                    var xOffsets = element.points.map(function (point) { return clientX - point.x; });
                    var yOffsets = element.points.map(function (point) { return clientY - point.y; });
                    setSelectedElement(tslib_1.__assign(tslib_1.__assign({}, element), { xOffsets: xOffsets, yOffsets: yOffsets }));
                }
                else {
                    var offsetX = clientX - element.x1;
                    var offsetY = clientY - element.y1;
                    setSelectedElement(tslib_1.__assign(tslib_1.__assign({}, element), { offsetX: offsetX, offsetY: offsetY }));
                }
                setElements(function (prevState) { return prevState; });
                if (element.position === 'inside') {
                    setAction('moving');
                }
                else {
                    setAction('resizing');
                }
            }
        }
        else {
            var id = elements.length;
            var element_1 = (0, DrawingHelper_1.createElement)(id, clientX, clientY, clientX, clientY, tool, { color: color }, generator);
            setElements(function (prevState) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], prevState, true), [element_1], false); });
            setSelectedElement(element_1);
            setAction(tool === 'text' ? 'writing' : 'drawing');
        }
    };
    var handleMouseMove = function (event) {
        var clientX = event.clientX, clientY = event.clientY;
        if (tool === 'selection') {
            var element = (0, DrawingHelper_1.getElementAtPosition)(clientX, clientY, elements);
            event.target.style.cursor = element ? (0, DrawingHelper_1.cursorForPosition)(element.position) : 'default';
        }
        if (action === 'drawing') {
            var index = elements.length - 1;
            var _a = elements[index], x1 = _a.x1, y1 = _a.y1, options = _a.options;
            updateElement(index, x1, y1, clientX, clientY, tool, options);
        }
        else if (action === 'moving') {
            if (selectedElement.type === 'pencil') {
                var newPoints = selectedElement.points.map(function (_, index) { return ({
                    x: clientX - selectedElement.xOffsets[index],
                    y: clientY - selectedElement.yOffsets[index],
                }); });
                var elementsCopy = tslib_1.__spreadArray([], elements, true);
                elementsCopy[selectedElement.id] = tslib_1.__assign(tslib_1.__assign({}, elementsCopy[selectedElement.id]), { points: newPoints });
                setElements(elementsCopy, true);
            }
            else {
                var id = selectedElement.id, x1 = selectedElement.x1, x2 = selectedElement.x2, y1 = selectedElement.y1, y2 = selectedElement.y2, colorOptions = selectedElement.options, type = selectedElement.type, offsetX = selectedElement.offsetX, offsetY = selectedElement.offsetY;
                var width = x2 - x1;
                var height = y2 - y1;
                var newX1 = clientX - offsetX;
                var newY1 = clientY - offsetY;
                var options = type === 'text' ? { text: selectedElement.text } : {};
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, tslib_1.__assign(tslib_1.__assign({}, options), colorOptions));
            }
        }
        else if (action === 'resizing') {
            var id = selectedElement.id, type = selectedElement.type, options = selectedElement.options, position = selectedElement.position, coordinates = tslib_1.__rest(selectedElement, ["id", "type", "options", "position"]);
            var _b = (0, DrawingHelper_1.resizedCoordinates)(clientX, clientY, position, coordinates), x1 = _b.x1, y1 = _b.y1, x2 = _b.x2, y2 = _b.y2;
            updateElement(id, x1, y1, x2, y2, type, options);
        }
    };
    var handleMouseUp = function (event) {
        var clientX = event.clientX, clientY = event.clientY;
        if (selectedElement) {
            if (selectedElement.type === 'text' &&
                clientX - selectedElement.offsetX === selectedElement.x1 &&
                clientY - selectedElement.offsetY === selectedElement.y1) {
                setAction('writing');
                return;
            }
            var index = selectedElement.id;
            var _a = elements[index], id = _a.id, type = _a.type, options = _a.options;
            if ((action === 'drawing' || action === 'resizing') && (0, DrawingHelper_1.adjustmentRequired)(type)) {
                var _b = (0, DrawingHelper_1.adjustElementCoordinates)(elements[index]), x1 = _b.x1, y1 = _b.y1, x2 = _b.x2, y2 = _b.y2;
                updateElement(id, x1, y1, x2, y2, type, options);
            }
        }
        if (action === 'writing')
            return;
        setAction('none');
        setSelectedElement(null);
    };
    var handleBlur = function (event) {
        var id = selectedElement.id, x1 = selectedElement.x1, y1 = selectedElement.y1, type = selectedElement.type;
        setAction('none');
        setSelectedElement(null);
        updateElement(id, x1, y1, null, null, type, { text: event.target.value });
    };
    var handleCaptureScree = function () {
        var node = document.getElementById('root');
        htmlToImage
            .toPng(node)
            .then(function (dataUrl) {
            onClickSave(dataUrl);
        })
            .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    };
    return (react_1.default.createElement("div", { className: 'canvas-container' },
        react_1.default.createElement("div", { className: 'canvas-tool-panel' },
            react_1.default.createElement(ToolButton_1.default, { onclickTool: function () { return setTool('pencil'); }, icon: icons_material_1.Create, isActive: tool === 'pencil' }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: function () { return setTool('rectangle'); }, icon: icons_material_1.CropSquare, isActive: tool === 'rectangle' }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: function () { return setTool('text'); }, icon: icons_material_1.Comment, isActive: tool === 'text' }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: function () { return setTool('selection'); }, icon: icons_material_1.PanTool, isActive: tool === 'selection' }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: undo, icon: icons_material_1.Undo }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: redo, icon: icons_material_1.Redo }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: handleCaptureScree, icon: icons_material_1.Save }),
            react_1.default.createElement(ToolButton_1.default, { onclickTool: function () {
                    onClickCancel();
                    reset();
                }, icon: icons_material_1.Close })),
        action === 'writing' ? (react_1.default.createElement("textarea", { ref: textAreaRef, onBlur: handleBlur, autofocus: true, placeholder: 'Enter your feedback', className: 'canvas-comment-area', style: {
                top: selectedElement.y1 - 2,
                left: selectedElement.x1,
            } })) : null,
        react_1.default.createElement("canvas", { id: 'canvas', width: window.innerWidth, height: window.innerHeight, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, className: 'canvas' }, "Canvas")));
};
exports.default = Canvas;
