import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
var Portal = function (props) {
    var children = props.children;
    var mount = useState(function () { return window.open('', '', 'width=600px,height=640px'); })[0];
    var el = useState(function () { return mount.document.createElement('div'); })[0];
    useEffect(function () {
        mount.document.body.appendChild(el);
        return function () {
            mount.document.body.removeChild(el);
        };
    }, [el, mount]);
    return createPortal(children, el);
};
export default Portal;
