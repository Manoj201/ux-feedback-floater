"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./FieldIndicator.css");
var FieldIndicator = function (_a) {
    var data = _a.data;
    return (react_1.default.createElement("div", { className: 'feedback-form-inputs-left-container' }, data.map(function (item, index) { return (react_1.default.createElement(react_1.default.Fragment, { key: "indicator-".concat(index) },
        react_1.default.createElement("div", { style: {
                width: 2,
                backgroundColor: '#E0E3EB',
                height: item.topLineHeight,
            } }),
        react_1.default.createElement("div", { className: item.isRequired ? 'feedback-form-inputs-required-indicator' : 'feedback-form-inputs-indicator' }))); })));
};
exports.default = FieldIndicator;
