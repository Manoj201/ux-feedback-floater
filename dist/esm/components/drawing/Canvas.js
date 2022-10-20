import { __assign, __rest, __spreadArray } from "tslib";
/* eslint-disable no-case-declarations */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import * as htmlToImage from 'html-to-image';
import './Canvas.css';
import { Create as CreateIcon, CropSquare as CropSquareIcon, Comment as CommentIcon, Redo as RedoIcon, Undo as UndoIcon, Save as SaveIcon, Close as CloseIcon, PanTool as PanToolIcon, } from '@mui/icons-material';
import ToolButton from '../toolButton/ToolButton';
import { createElement, getElementAtPosition, adjustElementCoordinates, cursorForPosition, resizedCoordinates, useHistory, drawElement, adjustmentRequired, } from './DrawingHelper';
var generator = rough.generator();
var Canvas = function (_a) {
    var onClickSave = _a.onClickSave, onClickCancel = _a.onClickCancel;
    var _b = useHistory([]), elements = _b[0], setElements = _b[1], undo = _b[2], redo = _b[3], reset = _b[4];
    var _c = useState('none'), action = _c[0], setAction = _c[1];
    var _d = useState(null), selectedElement = _d[0], setSelectedElement = _d[1];
    var _e = useState('pencil'), tool = _e[0], setTool = _e[1];
    var color = 'red';
    var textAreaRef = useRef();
    useEffect(function () {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useLayoutEffect(function () {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var roughCanvas = rough.canvas(canvas);
        elements.forEach(function (element) {
            if (action === 'writing' && (selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.id) === element.id)
                return;
            drawElement(roughCanvas, context, element);
        });
    }, [elements, action, selectedElement]);
    useEffect(function () {
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
    useEffect(function () {
        var textArea = textAreaRef.current;
        if (action === 'writing' && textArea) {
            // textArea.focus();
            textArea.value = selectedElement.text;
        }
    }, [action, selectedElement]);
    var updateElement = function (id, x1, y1, x2, y2, type, options) {
        var elementsCopy = __spreadArray([], elements, true);
        switch (type) {
            case 'line':
            case 'rectangle':
                elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, options, generator);
                break;
            case 'pencil':
                elementsCopy[id].points = __spreadArray(__spreadArray([], elementsCopy[id].points, true), [{ x: x2, y: y2 }], false);
                break;
            case 'text':
                var canvasEl = document.getElementById('canvas');
                var textWidth = canvasEl === null || canvasEl === void 0 ? void 0 : canvasEl.getContext('2d').measureText(options.text).width;
                var textHeight = 24;
                elementsCopy[id] = __assign(__assign({}, createElement(id, x1, y1, x1 + textWidth, y1 ? y1 + textHeight : textHeight, type, options, generator)), { text: options.text });
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
            var element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                if (element.type === 'pencil') {
                    var xOffsets = element.points.map(function (point) { return clientX - point.x; });
                    var yOffsets = element.points.map(function (point) { return clientY - point.y; });
                    setSelectedElement(__assign(__assign({}, element), { xOffsets: xOffsets, yOffsets: yOffsets }));
                }
                else {
                    var offsetX = clientX - element.x1;
                    var offsetY = clientY - element.y1;
                    setSelectedElement(__assign(__assign({}, element), { offsetX: offsetX, offsetY: offsetY }));
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
            var element_1 = createElement(id, clientX, clientY, clientX, clientY, tool, { color: color }, generator);
            setElements(function (prevState) { return __spreadArray(__spreadArray([], prevState, true), [element_1], false); });
            setSelectedElement(element_1);
            setAction(tool === 'text' ? 'writing' : 'drawing');
        }
    };
    var handleMouseMove = function (event) {
        var clientX = event.clientX, clientY = event.clientY;
        if (tool === 'selection') {
            var element = getElementAtPosition(clientX, clientY, elements);
            event.target.style.cursor = element ? cursorForPosition(element.position) : 'default';
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
                var elementsCopy = __spreadArray([], elements, true);
                elementsCopy[selectedElement.id] = __assign(__assign({}, elementsCopy[selectedElement.id]), { points: newPoints });
                setElements(elementsCopy, true);
            }
            else {
                var id = selectedElement.id, x1 = selectedElement.x1, x2 = selectedElement.x2, y1 = selectedElement.y1, y2 = selectedElement.y2, colorOptions = selectedElement.options, type = selectedElement.type, offsetX = selectedElement.offsetX, offsetY = selectedElement.offsetY;
                var width = x2 - x1;
                var height = y2 - y1;
                var newX1 = clientX - offsetX;
                var newY1 = clientY - offsetY;
                var options = type === 'text' ? { text: selectedElement.text } : {};
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, __assign(__assign({}, options), colorOptions));
            }
        }
        else if (action === 'resizing') {
            var id = selectedElement.id, type = selectedElement.type, options = selectedElement.options, position = selectedElement.position, coordinates = __rest(selectedElement, ["id", "type", "options", "position"]);
            var _b = resizedCoordinates(clientX, clientY, position, coordinates), x1 = _b.x1, y1 = _b.y1, x2 = _b.x2, y2 = _b.y2;
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
            if ((action === 'drawing' || action === 'resizing') && adjustmentRequired(type)) {
                var _b = adjustElementCoordinates(elements[index]), x1 = _b.x1, y1 = _b.y1, x2 = _b.x2, y2 = _b.y2;
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
    return (React.createElement("div", { className: 'canvas-container' },
        React.createElement("div", { className: 'canvas-tool-panel' },
            React.createElement(ToolButton, { onclickTool: function () { return setTool('pencil'); }, icon: CreateIcon, isActive: tool === 'pencil' }),
            React.createElement(ToolButton, { onclickTool: function () { return setTool('rectangle'); }, icon: CropSquareIcon, isActive: tool === 'rectangle' }),
            React.createElement(ToolButton, { onclickTool: function () { return setTool('text'); }, icon: CommentIcon, isActive: tool === 'text' }),
            React.createElement(ToolButton, { onclickTool: function () { return setTool('selection'); }, icon: PanToolIcon, isActive: tool === 'selection' }),
            React.createElement(ToolButton, { onclickTool: undo, icon: UndoIcon, isActive: false }),
            React.createElement(ToolButton, { onclickTool: redo, icon: RedoIcon, isActive: false }),
            React.createElement(ToolButton, { onclickTool: handleCaptureScree, icon: SaveIcon, isActive: false }),
            React.createElement(ToolButton, { onclickTool: function () {
                    onClickCancel();
                    reset();
                }, icon: CloseIcon, isActive: false })),
        action === 'writing' ? (React.createElement("textarea", { ref: textAreaRef, onBlur: handleBlur, autoFocus: true, placeholder: 'Enter your feedback', className: 'canvas-comment-area', style: {
                top: selectedElement.y1 - 2,
                left: selectedElement.x1,
            } })) : null,
        React.createElement("canvas", { id: 'canvas', width: window.innerWidth, height: window.innerHeight, onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, className: 'canvas' }, "Canvas")));
};
export default Canvas;
