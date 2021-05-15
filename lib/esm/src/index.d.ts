/// <reference types="react" />
interface IProps {
    url?: string;
    name?: string;
    title?: string;
    features?: object;
    onBlock?: () => void;
    onOpen?: () => void;
    onUnload?: () => void;
    center?: 'parent' | 'screen';
    copyStyles?: boolean;
    children: any;
}
declare const NewImprovedWindow: (props: IProps) => JSX.Element | null;
export default NewImprovedWindow;
