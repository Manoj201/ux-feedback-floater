"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var styles_1 = require("@mui/material/styles");
var FieldIndicator_component_1 = tslib_1.__importDefault(require("../fieldIndicator/FieldIndicator.component"));
var FeedbackTextfield_component_1 = tslib_1.__importDefault(require("../feedbackTextfield/FeedbackTextfield.component"));
var camera_svg_1 = tslib_1.__importDefault(require("../../images/camera.svg"));
var camera_active_svg_1 = tslib_1.__importDefault(require("../../images/camera-active.svg"));
var done_svg_1 = tslib_1.__importDefault(require("../../images/done.svg"));
require("./FeedbackDialog.css");
var indicatorData = [
    { isRequired: false, topLineHeight: 0 },
    { isRequired: false, topLineHeight: 48 },
    { isRequired: true, topLineHeight: 50 },
    { isRequired: false, topLineHeight: 140 },
];
var FeedbackDialog = function (_a) {
    var open = _a.open, onClickDialogClose = _a.onClickDialogClose, onClickAddImage = _a.onClickAddImage, isScreenCaptured = _a.isScreenCaptured, onClickRemoveImage = _a.onClickRemoveImage, onClickRetakeScreenshot = _a.onClickRetakeScreenshot, initialFormData = _a.initialFormData, onClickSubmit = _a.onClickSubmit;
    var _b = (0, react_1.useState)(true), emailError = _b[0], setEmailError = _b[1];
    var _c = (0, react_1.useState)(false), submitClicked = _c[0], setSubmitClicked = _c[1];
    var _d = (0, react_1.useState)(false), formSubmitted = _d[0], setFormSubmitted = _d[1];
    var theme = (0, styles_1.useTheme)();
    var fullScreen = (0, material_1.useMediaQuery)(theme.breakpoints.down('md'));
    var nameRef = (0, react_1.useRef)(null);
    var emailRef = (0, react_1.useRef)(null);
    var commentRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
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
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(material_1.Dialog, { open: open, PaperProps: {
                style: { borderRadius: fullScreen ? 0 : 25 },
            }, fullScreen: fullScreen },
            react_1.default.createElement("div", { className: 'feedback-form-dialog-container' },
                react_1.default.createElement("div", { className: 'feedback-form-header-wrapper' },
                    !formSubmitted ? (react_1.default.createElement("div", null,
                        react_1.default.createElement("div", { className: 'feedback-form-header-text' }, "Feedback form"),
                        react_1.default.createElement("div", { className: 'feedback-form-header-sub-text' }, "For future improvements, we would really love to get some feedback from you!"),
                        react_1.default.createElement("div", { className: 'feedback-form-required-wrapper' },
                            react_1.default.createElement("div", { className: 'feedback-form-required-circle' }),
                            react_1.default.createElement("div", { className: 'feedback-form-required-text' }, "= Required")))) : (react_1.default.createElement("div", null)),
                    react_1.default.createElement(material_1.IconButton, { onClick: handleClose, size: 'large' },
                        react_1.default.createElement(icons_material_1.Close, { className: 'feedback-form-dialog-close-button' }))),
                !formSubmitted ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: 'feedback-form-inputs-container' },
                        react_1.default.createElement(FieldIndicator_component_1.default, { data: indicatorData }),
                        react_1.default.createElement("div", { className: 'feedback-form-inputs-right-container' },
                            react_1.default.createElement(FeedbackTextfield_component_1.default, { inputRef: nameRef, label: 'Name', value: initialFormData.name }),
                            react_1.default.createElement(FeedbackTextfield_component_1.default, { inputRef: emailRef, label: 'Email', onChange: onChangeEmail, isError: submitClicked && emailError, errorText: 'Enter valid email id', value: initialFormData.email }),
                            react_1.default.createElement(FeedbackTextfield_component_1.default, { inputRef: commentRef, label: 'Comments', isComment: true, isError: submitClicked && !commentRef.current.value, errorText: 'Required', value: initialFormData.comments }),
                            react_1.default.createElement("div", { className: 'feedback-form-inputs-wrapper' },
                                react_1.default.createElement("div", { className: 'feedback-form-add-photo-wrapper' },
                                    react_1.default.createElement("div", { className: 'feedback-form-add-photo-leftbox' },
                                        react_1.default.createElement("img", { src: isScreenCaptured ? camera_active_svg_1.default : camera_svg_1.default, alt: 'cameraSVG', className: 'feedback-form-camera-iamge', onClick: handleClickAddImage }),
                                        react_1.default.createElement("div", { className: 'feedback-form-add-photo-text' }, isScreenCaptured
                                            ? 'Screenshot was added!'
                                            : 'Add a screenshot of your current page and visualize your improvements')),
                                    isScreenCaptured && (react_1.default.createElement("div", { className: 'feedback-screen-edit-remove-panel' },
                                        react_1.default.createElement("div", { className: 'feedback-screen-remove-button', onClick: onClickRemoveImage }, "Remove"),
                                        react_1.default.createElement("div", { className: 'feedback-screen-edit-button', onClick: onClickRetakeScreenshot }, "Retake"))))))),
                    react_1.default.createElement("div", { className: 'feedback-form-submit-wrapper' },
                        react_1.default.createElement("div", { className: 'feedback-form-submit-button', onClick: handleSave }, "Submit")))) : (react_1.default.createElement("div", { className: 'feedback-dialog-thank-wrapper' },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("img", { src: done_svg_1.default, alt: 'done', className: 'done-image' })),
                    react_1.default.createElement("div", { className: 'feedback-dialog-thank-text' }, "Thank you for your feedback! We really appreciate it")))))));
};
exports.default = FeedbackDialog;
