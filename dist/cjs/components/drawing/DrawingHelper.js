"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustmentRequired = exports.drawElement = exports.useHistory = exports.resizedCoordinates = exports.cursorForPosition = exports.adjustElementCoordinates = exports.getElementAtPosition = exports.createElement = void 0;
var tslib_1 = require("tslib");
/* eslint-disable no-case-declarations */
var perfect_freehand_1 = tslib_1.__importDefault(require("perfect-freehand"));
var react_1 = require("react");
var createElement = function (id, x1, y1, x2, y2, type, options, generator) {
    switch (type) {
        case 'line':
        case 'rectangle':
            var roughElement = type === 'line'
                ? generator.line(x1, y1, x2, y2, { stroke: options.color })
                : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
                    stroke: options.color,
                });
            return { id: id, x1: x1, y1: y1, x2: x2, y2: y2, type: type, options: options, roughElement: roughElement };
        case 'pencil':
            return { id: id, type: type, points: [{ x: x1, y: y1 }], options: options };
        case 'text':
            return { id: id, type: type, x1: x1, y1: y1, x2: x2, y2: y2, text: '' };
        default:
            throw new Error("Type not recognised: ".concat(type));
    }
};
exports.createElement = createElement;
var nearPoint = function (x, y, x1, y1, name) {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};
var onLine = function (x1, y1, x2, y2, x, y, maxDistance) {
    if (maxDistance === void 0) { maxDistance = 1; }
    var a = { x: x1, y: y1 };
    var b = { x: x2, y: y2 };
    var c = { x: x, y: y };
    var offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? 'inside' : null;
};
var positionWithinElement = function (x, y, element) {
    var type = element.type, x1 = element.x1, x2 = element.x2, y1 = element.y1, y2 = element.y2;
    switch (type) {
        case 'line':
            var on = onLine(x1, y1, x2, y2, x, y);
            var start = nearPoint(x, y, x1, y1, 'start');
            var end = nearPoint(x, y, x2, y2, 'end');
            return start || end || on;
        case 'rectangle':
            var topLeft = nearPoint(x, y, x1, y1, 'tl');
            var topRight = nearPoint(x, y, x2, y1, 'tr');
            var bottomLeft = nearPoint(x, y, x1, y2, 'bl');
            var bottomRight = nearPoint(x, y, x2, y2, 'br');
            var inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
            return topLeft || topRight || bottomLeft || bottomRight || inside;
        case 'pencil':
            var betweenAnyPoint = element.points.some(function (point, index) {
                var nextPoint = element.points[index + 1];
                if (!nextPoint)
                    return false;
                return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
            });
            return betweenAnyPoint ? 'inside' : null;
        case 'text':
            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
        default:
            throw new Error("Type not recognised: ".concat(type));
    }
};
var distance = function (a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); };
var getElementAtPosition = function (x, y, elements) {
    return elements
        .map(function (element) { return (tslib_1.__assign(tslib_1.__assign({}, element), { position: positionWithinElement(x, y, element) })); })
        .find(function (element) { return element.position !== null; });
};
exports.getElementAtPosition = getElementAtPosition;
var adjustElementCoordinates = function (element) {
    var type = element.type, x1 = element.x1, y1 = element.y1, x2 = element.x2, y2 = element.y2;
    if (type === 'rectangle') {
        var minX = Math.min(x1, x2);
        var maxX = Math.max(x1, x2);
        var minY = Math.min(y1, y2);
        var maxY = Math.max(y1, y2);
        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
    else {
        if (x1 < x2 || (x1 === x2 && y1 < y2)) {
            return { x1: x1, y1: y1, x2: x2, y2: y2 };
        }
        else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 };
        }
    }
};
exports.adjustElementCoordinates = adjustElementCoordinates;
var cursorForPosition = function (position) {
    switch (position) {
        case 'tl':
        case 'br':
        case 'start':
        case 'end':
            return 'nwse-resize';
        case 'tr':
        case 'bl':
            return 'nesw-resize';
        default:
            return 'move';
    }
};
exports.cursorForPosition = cursorForPosition;
var resizedCoordinates = function (clientX, clientY, position, coordinates) {
    var x1 = coordinates.x1, y1 = coordinates.y1, x2 = coordinates.x2, y2 = coordinates.y2;
    switch (position) {
        case 'tl':
        case 'start':
            return { x1: clientX, y1: clientY, x2: x2, y2: y2 };
        case 'tr':
            return { x1: x1, y1: clientY, x2: clientX, y2: y2 };
        case 'bl':
            return { x1: clientX, y1: y1, x2: x2, y2: clientY };
        case 'br':
        case 'end':
            return { x1: x1, y1: y1, x2: clientX, y2: clientY };
        default:
            return null; //should not really get here...
    }
};
exports.resizedCoordinates = resizedCoordinates;
var useHistory = function (initialState) {
    var _a = (0, react_1.useState)(0), index = _a[0], setIndex = _a[1];
    var _b = (0, react_1.useState)([initialState]), history = _b[0], setHistory = _b[1];
    var setState = function (action, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        var newState = typeof action === 'function' ? action(history[index]) : action;
        if (overwrite) {
            var historyCopy = tslib_1.__spreadArray([], history, true);
            historyCopy[index] = newState;
            setHistory(historyCopy);
        }
        else {
            var updatedState = tslib_1.__spreadArray([], history, true).slice(0, index + 1);
            setHistory(tslib_1.__spreadArray(tslib_1.__spreadArray([], updatedState, true), [newState], false));
            setIndex(function (prevState) { return prevState + 1; });
        }
    };
    var undo = function () { return index > 0 && setIndex(function (prevState) { return prevState - 1; }); };
    var redo = function () { return index < history.length - 1 && setIndex(function (prevState) { return prevState + 1; }); };
    var reset = function () { return setIndex(0); };
    return [history[index], setState, undo, redo, reset];
};
exports.useHistory = useHistory;
var getSvgPathFromStroke = function (stroke) {
    if (!stroke.length)
        return '';
    var d = stroke.reduce(function (acc, _a, i, arr) {
        var x0 = _a[0], y0 = _a[1];
        var _b = arr[(i + 1) % arr.length], x1 = _b[0], y1 = _b[1];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
    }, tslib_1.__spreadArray(tslib_1.__spreadArray(['M'], stroke[0], true), ['Q'], false));
    d.push('Z');
    return d.join(' ');
};
var drawElement = function (roughCanvas, context, element) {
    switch (element.type) {
        case 'line':
        case 'rectangle':
            context.strokeStyle = 'red';
            roughCanvas.draw(element.roughElement);
            break;
        case 'pencil':
            context.fillStyle = element.options.color;
            var stroke = getSvgPathFromStroke((0, perfect_freehand_1.default)(element.points));
            context.fill(new Path2D(stroke));
            break;
        case 'text':
            context.textBaseline = 'top';
            context.font = '16px sans-serif';
            context.fillText(element.text, element.x1, element.y1);
            break;
        default:
            throw new Error("Type not recognised: ".concat(element.type));
    }
};
exports.drawElement = drawElement;
var adjustmentRequired = function (type) { return ['line', 'rectangle'].includes(type); };
exports.adjustmentRequired = adjustmentRequired;
