import { useEffect } from "react";
import { createPortal } from "react-dom";
var Portal = function (props) {
    var children = props.children, mount = props.mount;
    var el = document.createElement("div");
    useEffect(function () {
        mount.appendChild(el);
        return function () { mount.removeChild(el); };
    }, [el, mount]);
    return createPortal(children, el);
};
export default Portal;
