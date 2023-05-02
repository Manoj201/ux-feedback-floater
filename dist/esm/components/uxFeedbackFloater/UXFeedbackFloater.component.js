import { __awaiter, __generator } from "tslib";
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import Backdrop from '@mui/material/Backdrop';
import Delayed from '../delayed/Delayed.component';
import FeedbackDialog from '../feedbackDialog/FeedbackDialog.component';
import Canvas from '../drawing/Canvas';
import cryingSVG from '../../images/crying.svg';
import disapointedSVG from '../../images/disapointed.svg';
import smilingSVG from '../../images/smiling.svg';
import whiteSmilingSVG from '../../images/whiteSmiling.svg';
import worriedSVG from '../../images/worried.svg';
import arrowSVG from '../../images/arrow.svg';
import './UXFeeedBackFloater.css';
var initialFormData = {
    name: '',
    email: '',
    comments: '',
};
var UXFeeedBackFloater = function () {
    var _a = useState(true), isCollapse = _a[0], setIsCollapse = _a[1];
    var _b = useState(0), rating = _b[0], setRating = _b[1];
    var _c = useState(false), clickedAddImage = _c[0], setClickedAddImage = _c[1];
    var _d = useState(null), imageData = _d[0], setImageData = _d[1];
    var _e = useState(initialFormData), formData = _e[0], setFormData = _e[1];
    var iconMap = useMemo(function () {
        return {
            1: cryingSVG,
            2: disapointedSVG,
            3: worriedSVG,
            4: whiteSmilingSVG,
            5: smilingSVG,
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
    var handleSubmit = function (formData) { return __awaiter(void 0, void 0, void 0, function () {
        var rawResponse, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(formData, rating, imageData);
                    return [4 /*yield*/, fetch('https://nsldev.nimble.expert/AdminConsole/api/Feedback', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                comments: formData.comments,
                                workspaceId: 1,
                                fullName: formData.name,
                                email: formData.email,
                                screenshotData: imageData,
                                screenshotFileName: 'nsl-iamge',
                                feedbackFiles: [],
                            }),
                        })];
                case 1:
                    rawResponse = _a.sent();
                    return [4 /*yield*/, rawResponse.json()];
                case 2:
                    content = _a.sent();
                    console.log(content);
                    setFormData(initialFormData);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDialogClose = function () {
        setRating(0);
        setImageData(null);
        setFormData(initialFormData);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: classNames('floating-button', isCollapse === false && 'floating-button-clicked'), onClick: rating === 0 ? handleClickFloatingButton : function () { } }, isCollapse ? (React.createElement(React.Fragment, null,
            React.createElement("div", null, "Feed\nback"))) : (React.createElement(Delayed, { waitBeforeShow: 300 },
            React.createElement("div", { className: 'detailed-container' },
                React.createElement("div", null,
                    React.createElement("div", { className: 'experience-text' }, "? How is your experience so far"),
                    React.createElement("div", { className: 'emojiWrapper' }, Object.entries(iconMap).map(function (_key, index) { return (React.createElement("img", { key: index, src: iconMap[index + 1], alt: 'cryingSVG', className: 'emoji', onClick: function () { return handleClickEmoji(index + 1); } })); }))),
                React.createElement("img", { src: arrowSVG, alt: 'arrow', className: 'arrow', onClick: function () { return setIsCollapse(true); } }))))),
        React.createElement(FeedbackDialog, { open: rating > 0 && !clickedAddImage, onClickDialogClose: handleDialogClose, rating: rating, onClickAddImage: handleClickAddImage, isScreenCaptured: imageData ? true : false, onClickRemoveImage: function () { return setImageData(null); }, onClickRetakeScreenshot: function () { return setClickedAddImage(true); }, initialFormData: formData, onClickSubmit: handleSubmit }),
        React.createElement(Backdrop, { sx: {
                color: '#fff',
                zIndex: function (theme) { return theme.zIndex.drawer + 1; },
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }, open: clickedAddImage }, clickedAddImage && (React.createElement(Canvas, { onClickCancel: function () { return setClickedAddImage(false); }, onClickSave: handleClickScreenCapture })))));
};
export default UXFeeedBackFloater;
