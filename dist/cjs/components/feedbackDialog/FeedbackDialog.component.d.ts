import React from 'react';
import './FeedbackDialog.css';
interface FormDataType {
    name: string | null;
    email: string | null;
    comments: string | null;
}
interface FeedbackDialogType {
    open: boolean;
    onClickDialogClose: () => void;
    rating: number;
    onClickAddImage: (value: boolean, formData: FormDataType) => void;
    isScreenCaptured: boolean;
    onClickRemoveImage: () => void;
    onClickRetakeScreenshot: () => void;
    initialFormData: FormDataType;
    onClickSubmit: (data: FormDataType) => void;
}
declare const FeedbackDialog: React.FC<FeedbackDialogType>;
export default FeedbackDialog;
