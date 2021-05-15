/// <reference types="react" />
interface IProps {
    children: any;
    mount: HTMLElement;
}
declare const Portal: (props: IProps) => import("react").ReactPortal;
export default Portal;
