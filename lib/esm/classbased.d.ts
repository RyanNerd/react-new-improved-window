import React, { PropsWithChildren } from 'react';
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
    onOpen?: (window: Window) => void;
    onUnload?: () => void;
    center?: 'parent' | 'screen';
    copyStyles?: boolean;
    closeWithParent?: boolean;
}
declare type TState = {
    mounted: boolean;
};
/**
 * The NewWindow class object.
 * @public
 */
declare class NewImprovedWindow extends React.PureComponent<IProps, TState> {
    private container;
    private window;
    private windowCheckerInterval;
    private released;
    /**
     * The NewWindow function constructor.
     * @param {Object} props
     */
    constructor(props: IProps);
    /**
     * Render the NewWindow component.
     */
    render(): React.ReactPortal | null;
    componentDidMount(): void;
    /**
     * Create the new window when NewWindow component mount.
     */
    openChild(): void;
    /**
     * Close the opened window (if any) when NewWindow will unmount.
     */
    componentWillUnmount(): void;
    /**
     * Release the new window and anything that was bound to it.
     */
    release(): void;
}
/**
 * Component export.
 * @private
 */
export default NewImprovedWindow;
