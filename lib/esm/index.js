import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
var NewImprovedWindow = function (props) {
    var _a = props.url, url = _a === void 0 ? '' : _a, _b = props.name, name = _b === void 0 ? '' : _b, _c = props.title, title = _c === void 0 ? document.title : _c, _d = props.features, features = _d === void 0 ? { height: 600, width: 640 } : _d, onBlock = props.onBlock, onOpen = props.onOpen, onUnload = props.onUnload, 
    //        center,
    //        copyStyles,
    //        closeWithParent,
    children = props.children;
    var container = useState(document.createElement('div'))[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(function () {
        /**
         * Convert features props to window features format (name=value,other=value).
         * @param {Object} obj
         * @return {String}
         * @private
         */
        var toWindowFeatures = function (obj) {
            return Object.keys(obj)
                .reduce(function (features, name) {
                // @ts-ignore
                var value = obj[name];
                if (typeof value === 'boolean') {
                    // @ts-ignore
                    features.push(name + "=" + (value ? 'yes' : 'no'));
                }
                else {
                    // @ts-ignore
                    features.push(name + "=" + value);
                }
                return features;
            }, [])
                .join(',');
        };
        var win = window.open(url, name, toWindowFeatures(features));
        if (win) {
            if (onOpen) {
                onOpen();
            }
            win.document.title = title;
            // @ts-ignore
            win.document.body.appendChild(container);
        }
        else {
            if (onBlock) {
                onBlock();
            }
        }
        return function () {
            if (onUnload) {
                onUnload();
            }
            win === null || win === void 0 ? void 0 : win.close();
        };
    }, []);
    if (container) {
        // @ts-ignore
        return ReactDOM.createPortal(children, container);
    }
    return null;
};
export default NewImprovedWindow;
