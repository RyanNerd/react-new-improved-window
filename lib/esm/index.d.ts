import { PropsWithChildren } from 'react';
interface IFeatures {
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    toolbar?: boolean;
    menubar?: boolean;
    location?: boolean;
    status?: boolean;
    resizable?: boolean;
    scrollbars?: boolean;
    noopener?: boolean;
    noreferrer?: boolean;
}
interface IProps extends PropsWithChildren<any> {
    url?: string;
    name?: string;
    title?: string;
    features?: IFeatures;
    onBlock?: () => void;
    onOpen?: () => void;
}
declare const NewImprovedWindow: (props: IProps) => import("react").ReactPortal | null;
export default NewImprovedWindow;
