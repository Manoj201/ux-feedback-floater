import { __assign } from "tslib";
import React from 'react';
import TextField from '@mui/material/TextField';
import './FeedbackTextfield.css';
var FeedbackTextfield = function (_a) {
    var inputRef = _a.inputRef, label = _a.label, isComment = _a.isComment, onChange = _a.onChange, isError = _a.isError, errorText = _a.errorText, value = _a.value;
    return (React.createElement("div", { className: 'feedback-form-inputs-wrapper' },
        React.createElement("div", { className: isComment ? 'feedback-form-inputs-label-comments' : 'feedback-form-inputs-label' },
            label,
            isError && React.createElement("div", { className: 'error-text' },
                "( ",
                errorText,
                " )")),
        React.createElement(TextField, __assign({ defaultValue: value, id: "feedback-form-name-input-".concat(label), variant: isComment ? 'outlined' : 'standard', size: 'small', style: { width: '100%' }, inputRef: inputRef, inputProps: {
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
export default FeedbackTextfield;
