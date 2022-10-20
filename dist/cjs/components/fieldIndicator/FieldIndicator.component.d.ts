import React from 'react';
import './FieldIndicator.css';
interface IndicatorDataType {
    isRequired: boolean;
    topLineHeight: number;
}
interface FieldIndicator {
    data: Array<IndicatorDataType>;
}
declare const FieldIndicator: React.FC<FieldIndicator>;
export default FieldIndicator;
