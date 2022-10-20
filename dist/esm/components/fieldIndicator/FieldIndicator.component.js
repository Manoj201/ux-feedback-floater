import React from 'react';
import './FieldIndicator.css';
var FieldIndicator = function (_a) {
    var data = _a.data;
    return (React.createElement("div", { className: 'feedback-form-inputs-left-container' }, data.map(function (item, index) { return (React.createElement(React.Fragment, { key: "indicator-".concat(index) },
        React.createElement("div", { style: {
                width: 2,
                backgroundColor: '#E0E3EB',
                height: item.topLineHeight,
            } }),
        React.createElement("div", { className: item.isRequired ? 'feedback-form-inputs-required-indicator' : 'feedback-form-inputs-indicator' }))); })));
};
export default FieldIndicator;
