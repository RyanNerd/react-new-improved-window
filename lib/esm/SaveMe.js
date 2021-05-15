import { createPortal } from "react-dom";
import { useState } from "react";
var NewImprovedWindow = function (props) {
    var _a = props.url, url = _a === void 0 ? '' : _a, _b = props.name, name = _b === void 0 ? '' : _b, _c = props.title, title = _c === void 0 ? '' : _c, _d = props.features, features = _d === void 0 ? { width: '600px', height: '640px' } : _d, onBlock = props.onBlock, onOpen = props.onOpen, onUnload = props.onUnload, _e = props.center, center = _e === void 0 ? 'parent' : _e, _f = props.copyStyles, copyStyles = _f === void 0 ? true : _f, children = props.children;
    // @ts-ignore
    var stfu = { title: title, features: features, onUnload: onUnload, onOpen: onOpen, onBlock: onBlock, center: center, copyStyles: copyStyles, url: url, name: name };
    var mount = window.open('', '', 'width=600px,height=640px');
    var el = useState(mount === null || mount === void 0 ? void 0 : mount.document.createElement('div'))[0];
    //useEffect(() => {
    // @ts-ignore
    mount === null || mount === void 0 ? void 0 : mount.document.body.appendChild(el);
    /// return () => {
    // @ts-ignore
    // mount?.document.body.removeChild(el);
    //};
    //}, [mount, el]);
    if (el && el)
        return createPortal(children, el);
    return null;
};
export default NewImprovedWindow;
