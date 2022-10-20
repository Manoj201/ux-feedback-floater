"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var TextField_1 = tslib_1.__importDefault(require("@mui/material/TextField"));
require("./FeedbackTextfield.css");
var FeedbackTextfield = function (_a) {
    var inputRef = _a.inputRef, label = _a.label, isComment = _a.isComment, onChange = _a.onChange, isError = _a.isError, errorText = _a.errorText, value = _a.value;
    return (react_1.default.createElement("div", { className: 'feedback-form-inputs-wrapper' },
        react_1.default.createElement("div", { className: isComment ? 'feedback-form-inputs-label-comments' : 'feedback-form-inputs-label' },
            label,
            isError && react_1.default.createElement("div", { className: 'error-text' },
                "( ",
                errorText,
                " )")),
        react_1.default.createElement(TextField_1.default, tslib_1.__assign({ defaultValue: value, id: "feedback-form-name-input-".concat(label), variant: isComment ? 'outlined' : 'standard', size: 'small', style: { width: '100%' }, inputRef: inputRef, inputProps: {
                style: { color: 'white' },
            }, sx: {
                '& .MuiInput-underline:before': {
                    borderBottomColor: '#fff',
                },
                '& .MuiInput-underline:after': {
                    borderBottomColor: '#fff',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white',
                    },
                },
            }, multiline: isComment }, (isComment && { rows: 4 }), (onChange && { onChange: onChange })))));
};
exports.default = FeedbackTextfield;
