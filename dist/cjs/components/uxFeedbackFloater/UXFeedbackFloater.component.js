"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-empty-function */
var react_1 = tslib_1.__importStar(require("react"));
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var Backdrop_1 = tslib_1.__importDefault(require("@mui/material/Backdrop"));
var Delayed_component_1 = tslib_1.__importDefault(require("../delayed/Delayed.component"));
var FeedbackDialog_component_1 = tslib_1.__importDefault(require("../feedbackDialog/FeedbackDialog.component"));
var Canvas_1 = tslib_1.__importDefault(require("../drawing/Canvas"));
var crying_svg_1 = tslib_1.__importDefault(require("../../images/crying.svg"));
var disapointed_svg_1 = tslib_1.__importDefault(require("../../images/disapointed.svg"));
var smiling_svg_1 = tslib_1.__importDefault(require("../../images/smiling.svg"));
var whiteSmiling_svg_1 = tslib_1.__importDefault(require("../../images/whiteSmiling.svg"));
var worried_svg_1 = tslib_1.__importDefault(require("../../images/worried.svg"));
var arrow_svg_1 = tslib_1.__importDefault(require("../../images/arrow.svg"));
require("./UXFeeedBackFloater.css");
var initialFormData = {
    name: '',
    email: '',
    comments: '',
};
var UXFeeedBackFloater = function () {
    var _a = (0, react_1.useState)(true), isCollapse = _a[0], setIsCollapse = _a[1];
    var _b = (0, react_1.useState)(0), rating = _b[0], setRating = _b[1];
    var _c = (0, react_1.useState)(false), clickedAddImage = _c[0], setClickedAddImage = _c[1];
    var _d = (0, react_1.useState)(null), imageData = _d[0], setImageData = _d[1];
    var _e = (0, react_1.useState)(initialFormData), formData = _e[0], setFormData = _e[1];
    var iconMap = (0, react_1.useMemo)(function () {
        return {
            1: crying_svg_1.default,
            2: disapointed_svg_1.default,
            3: worried_svg_1.default,
            4: whiteSmiling_svg_1.default,
            5: smiling_svg_1.default,
        };
    }, []);
    var handleClickFloatingButton = function () {
        if (isCollapse) {
            setIsCollapse(false);
        }
    };
    var handleClickEmoji = function (rating) {
        setRating(rating);
        setIsCollapse(true);
    };
    var handleClickAddImage = function (value, formData) {
        setClickedAddImage(value);
        setFormData(formData);
    };
    var handleClickScreenCapture = function (imageData) {
        setImageData(imageData);
        setClickedAddImage(false);
    };
    var handleSubmit = function (formData) {
        console.log(formData, rating, imageData);
        setFormData(initialFormData);
    };
    var handleDialogClose = function () {
        setRating(0);
        setImageData(null);
        setFormData(initialFormData);
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: (0, classnames_1.default)('floating-button', isCollapse === false && 'floating-button-clicked'), onClick: rating === 0 ? handleClickFloatingButton : function () { } }, isCollapse ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", null, "Feed\nback"))) : (react_1.default.createElement(Delayed_component_1.default, { waitBeforeShow: 300 },
            react_1.default.createElement("div", { className: 'detailed-container' },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: 'experience-text' }, "? How is your experience so far"),
                    react_1.default.createElement("div", { className: 'emojiWrapper' }, Object.entries(iconMap).map(function (_key, index) { return (react_1.default.createElement("img", { key: index, src: iconMap[index + 1], alt: 'cryingSVG', className: 'emoji', onClick: function () { return handleClickEmoji(index + 1); } })); }))),
                react_1.default.createElement("img", { src: arrow_svg_1.default, alt: 'arrow', className: 'arrow', onClick: function () { return setIsCollapse(true); } }))))),
        react_1.default.createElement(FeedbackDialog_component_1.default, { open: rating > 0 && !clickedAddImage, onClickDialogClose: handleDialogClose, rating: rating, onClickAddImage: handleClickAddImage, isScreenCaptured: imageData ? true : false, onClickRemoveImage: function () { return setImageData(null); }, onClickRetakeScreenshot: function () { return setClickedAddImage(true); }, initialFormData: formData, onClickSubmit: handleSubmit }),
        react_1.default.createElement(Backdrop_1.default, { sx: {
                color: '#fff',
                zIndex: function (theme) { return theme.zIndex.drawer + 1; },
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }, open: clickedAddImage }, clickedAddImage && (react_1.default.createElement(Canvas_1.default, { onClickCancel: function () { return setClickedAddImage(false); }, onClickSave: handleClickScreenCapture })))));
};
exports.default = UXFeeedBackFloater;
