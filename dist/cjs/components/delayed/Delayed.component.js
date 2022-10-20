"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Delayed = function (_a) {
    var children = _a.children, _b = _a.waitBeforeShow, waitBeforeShow = _b === void 0 ? 300 : _b;
    var _c = (0, react_1.useState)(false), isShown = _c[0], setIsShown = _c[1];
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setIsShown(true);
        }, waitBeforeShow);
        return function () { return clearTimeout(timer); };
    }, [waitBeforeShow]);
    return isShown ? children : null;
};
exports.default = Delayed;
