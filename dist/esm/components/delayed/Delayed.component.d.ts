import { ReactElement } from 'react';
interface DelayedComponentTypes {
    children: ReactElement;
    waitBeforeShow: number;
}
declare const Delayed: React.FC<DelayedComponentTypes>;
export default Delayed;
