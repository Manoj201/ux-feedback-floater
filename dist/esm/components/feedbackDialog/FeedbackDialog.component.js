import React, { useRef, useState, useEffect } from 'react';
import { Dialog, IconButton, useMediaQuery } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FieldIndicator from '../fieldIndicator/FieldIndicator.component';
import FeedbackTextfield from '../feedbackTextfield/FeedbackTextfield.component';
import cameraSVG from '../../images/camera.svg';
import cameraActiveSVG from '../../images/camera-active.svg';
import doneSVG from '../../images/done.svg';
import './FeedbackDialog.css';
var indicatorData = [
    { isRequired: false, topLineHeight: 0 },
    { isRequired: false, topLineHeight: 48 },
    { isRequired: true, topLineHeight: 50 },
    { isRequired: false, topLineHeight: 140 },
];
var FeedbackDialog = function (_a) {
    var open = _a.open, onClickDialogClose = _a.onClickDialogClose, onClickAddImage = _a.onClickAddImage, isScreenCaptured = _a.isScreenCaptured, onClickRemoveImage = _a.onClickRemoveImage, onClickRetakeScreenshot = _a.onClickRetakeScreenshot, initialFormData = _a.initialFormData, onClickSubmit = _a.onClickSubmit;
    var _b = useState(true), emailError = _b[0], setEmailError = _b[1];
    var _c = useState(false), submitClicked = _c[0], setSubmitClicked = _c[1];
    var _d = useState(false), formSubmitted = _d[0], setFormSubmitted = _d[1];
    var theme = useTheme();
    var fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    var nameRef = useRef(null);
    var emailRef = useRef(null);
    var commentRef = useRef(null);
    useEffect(function () {
        if (open) {
            setFormSubmitted(false);
        }
    }, [open]);
    var handleClose = function () {
        setSubmitClicked(false);
        onClickDialogClose();
    };
    var handleSave = function () {
        var _a;
        setSubmitClicked(true);
        if (!emailError && ((_a = commentRef === null || commentRef === void 0 ? void 0 : commentRef.current) === null || _a === void 0 ? void 0 : _a.value)) {
            setFormSubmitted(true);
            onClickSubmit({
                name: nameRef.current.value,
                email: emailRef.current.value,
                comments: commentRef.current.value,
            });
        }
    };
    var isValidEmail = function (email) {
        return email ? /\S+@\S+\.\S+/.test(email) : true;
    };
    var onChangeEmail = function (event) {
        setEmailError(!isValidEmail(event.target.value));
    };
    var handleClickAddImage = function () {
        var formData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            comments: commentRef.current.value,
        };
        onClickAddImage(true, formData);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { open: open, PaperProps: {
                style: { borderRadius: fullScreen ? 0 : 25 },
            }, fullScreen: fullScreen },
            React.createElement("div", { className: 'feedback-form-dialog-container' },
                React.createElement("div", { className: 'feedback-form-header-wrapper' },
                    !formSubmitted ? (React.createElement("div", null,
                        React.createElement("div", { className: 'feedback-form-header-text' }, "Feedback form"),
                        React.createElement("div", { className: 'feedback-form-header-sub-text' }, "For future improvements, we would really love to get some feedback from you!"),
                        React.createElement("div", { className: 'feedback-form-required-wrapper' },
                            React.createElement("div", { className: 'feedback-form-required-circle' }),
                            React.createElement("div", { className: 'feedback-form-required-text' }, "= Required")))) : (React.createElement("div", null)),
                    React.createElement(IconButton, { onClick: handleClose, size: 'large' },
                        React.createElement(CloseIcon, { className: 'feedback-form-dialog-close-button' }))),
                !formSubmitted ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: 'feedback-form-inputs-container' },
                        React.createElement(FieldIndicator, { data: indicatorData }),
                        React.createElement("div", { className: 'feedback-form-inputs-right-container' },
                            React.createElement(FeedbackTextfield, { inputRef: nameRef, label: 'Name', value: initialFormData.name }),
                            React.createElement(FeedbackTextfield, { inputRef: emailRef, label: 'Email', onChange: onChangeEmail, isError: submitClicked && emailError, errorText: 'Enter valid email id', value: initialFormData.email }),
                            React.createElement(FeedbackTextfield, { inputRef: commentRef, label: 'Comments', isComment: true, isError: submitClicked && !commentRef.current.value, errorText: 'Required', value: initialFormData.comments }),
                            React.createElement("div", { className: 'feedback-form-inputs-wrapper' },
                                React.createElement("div", { className: 'feedback-form-add-photo-wrapper' },
                                    React.createElement("div", { className: 'feedback-form-add-photo-leftbox' },
                                        React.createElement("img", { src: isScreenCaptured ? cameraActiveSVG : cameraSVG, alt: 'cameraSVG', className: 'feedback-form-camera-iamge', onClick: handleClickAddImage }),
                                        React.createElement("div", { className: 'feedback-form-add-photo-text' }, isScreenCaptured
                                            ? 'Screenshot was added!'
                                            : 'Add a screenshot of your current page and visualize your improvements')),
                                    isScreenCaptured && (React.createElement("div", { className: 'feedback-screen-edit-remove-panel' },
                                        React.createElement("div", { className: 'feedback-screen-remove-button', onClick: onClickRemoveImage }, "Remove"),
                                        React.createElement("div", { className: 'feedback-screen-edit-button', onClick: onClickRetakeScreenshot }, "Retake"))))))),
                    React.createElement("div", { className: 'feedback-form-submit-wrapper' },
                        React.createElement("div", { className: 'feedback-form-submit-button', onClick: handleSave }, "Submit")))) : (React.createElement("div", { className: 'feedback-dialog-thank-wrapper' },
                    React.createElement("div", null,
                        React.createElement("img", { src: doneSVG, alt: 'done', className: 'done-image' })),
                    React.createElement("div", { className: 'feedback-dialog-thank-text' }, "Thank you for your feedback! We really appreciate it")))))));
};
export default FeedbackDialog;
