import React, { RefObject } from 'react';
import './FeedbackTextfield.css';
interface FeedbackTextfieldType {
    inputRef: RefObject<any>;
    label: string;
    isComment?: boolean;
    onChange?: (event: any) => void;
    isError?: boolean;
    errorText?: string;
    value: string | null;
}
declare const FeedbackTextfield: React.FC<FeedbackTextfieldType>;
export default FeedbackTextfield;
