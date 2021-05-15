var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
var NewImprovedWindow = function (props) {
    var _a = props.url, url = _a === void 0 ? '' : _a, _b = props.name, name = _b === void 0 ? '' : _b, _c = props.title, title = _c === void 0 ? document.title : _c, _d = props.features, features = _d === void 0 ? { height: 600, width: 640 } : _d, onBlock = props.onBlock, onOpen = props.onOpen, onUnload = props.onUnload, center = props.center, 
    //        copyStyles,
    closeWithParent = props.closeWithParent, children = props.children;
    var container = useState(document.createElement('div'))[0];
    var mutFeatures = __assign({}, features);
    if (center) {
        mutFeatures.width = (mutFeatures === null || mutFeatures === void 0 ? void 0 : mutFeatures.width) ? mutFeatures.width : 600;
        mutFeatures.height = (mutFeatures === null || mutFeatures === void 0 ? void 0 : mutFeatures.height) ? mutFeatures.height : 640;
        if (center === 'parent') {
            mutFeatures.left = window.top.outerWidth / 2 + window.top.screenX - mutFeatures.width / 2;
            mutFeatures.top = window.top.outerHeight / 2 + window.top.screenY - mutFeatures.height / 2;
        }
        else if (center === 'screen') {
            var screenLeft_1 = window.screenLeft;
            var screenTop_1 = window.screenTop;
            var width = window.innerWidth
                ? window.innerWidth
                : document.documentElement.clientWidth
                    ? document.documentElement.clientWidth
                    : window.screen.width;
            var height = window.innerHeight
                ? window.innerHeight
                : document.documentElement.clientHeight
                    ? document.documentElement.clientHeight
                    : window.screen.height;
            mutFeatures.left = width / 2 - mutFeatures.width / 2 + screenLeft_1;
            mutFeatures.top = height / 2 - mutFeatures.height / 2 + screenTop_1;
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(function () {
        /**
         * Convert features props to window features format (name=value,other=value).
         * @param {IFeatures} obj
         * @return {String}
         */
        var toWindowFeatures = function (obj) {
            return Object.keys(obj)
                .reduce(function (features, name) {
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
        /**
         * Beforeunload event handler
         */
        var handleBeforeunload = function () {
            if (onUnload) {
                onUnload();
            }
        };
        /**
         * Close event handler
         */
        var handleClose = function () {
            if (win) {
                win.close();
            }
        };
        // Create a new popup window
        var win = window.open(url, name, toWindowFeatures(mutFeatures));
        // Did the popup window get created?
        if (win) {
            // Fire props.onOpen()
            if (onOpen) {
                onOpen(win);
            }
            win.document.title = title;
            // Add before
            win.addEventListener('beforeunload', function () { return handleBeforeunload(); });
            // If the parent window closes and closeWithParent is true then close the new window as well.
            if (closeWithParent) {
                window.addEventListener('unload', function () { return handleClose(); });
            }
            // Add the div container element to the popup window
            win.document.body.appendChild(container);
        }
        else {
            if (onBlock) {
                onBlock();
            }
        }
        // Clean up
        return function () {
            // Fire props.onUnload()
            if (onUnload) {
                onUnload();
            }
            if (win) {
                win.removeEventListener('beforeunload', handleBeforeunload);
                win.close();
                window.removeEventListener('unload', function () { return handleClose; });
            }
        };
    }, []);
    if (container) {
        return ReactDOM.createPortal(children, container);
    }
    return null;
};
export default NewImprovedWindow;
// import React, {PropsWithChildren} from 'react'
// import ReactDOM from 'react-dom'
//
// interface IFeatures {
//     width?: number,
//     height?: number,
//     left?: number,
//     top?: number,
//     toolbar?: boolean,
//     menubar?: boolean,
//     location?: boolean,
//     status?: boolean,
//     resizable?: boolean,
//     scrollbars?: boolean,
//     noopener?: boolean,
//     noreferrer?: boolean
// }
//
// interface IProps extends PropsWithChildren<any>{
//     url?: string
//     name?: string
//     title?: string
//     features?: IFeatures
//     onBlock?: () => void
//     onOpen?: (window: Window) => void
//     onUnload?: () => void
//     center?: 'parent' | 'screen'
//     copyStyles?: boolean
//     closeWithParent?: boolean
// }
//
// type TState = {
//     mounted: boolean
// }
//
// /**
//  * The NewWindow class object.
//  * @public
//  */
// class NewImprovedWindow extends React.PureComponent<IProps, TState> {
//     private container: null | Element;
//     private window: Window | null;
//     private windowCheckerInterval: number | null;
//     private released: boolean;
//
//     /**
//      * The NewWindow function constructor.
//      * @param {Object} props
//      */
//     constructor(props: IProps) {
//         super(props);
//         this.container = null
//         this.window = null
//         this.windowCheckerInterval = null
//         this.released = false;
//         this.state = {
//             mounted: false
//         }
//     }
//
//     /**
//      * Render the NewWindow component.
//      */
//     render() {
//         if (!this.state.mounted) return null
//         return ReactDOM.createPortal(this.props.children, this.container as Element)
//     }
//
//     componentDidMount() {
//         this.openChild()
//         this.setState({mounted: true})
//     }
//
//     /**
//      * Create the new window when NewWindow component mount.
//      */
//     openChild() {
//         const {
//             url = '',
//             name = '',
//             title = document.title,
//             features,
//             onBlock,
//             onOpen,
//             center,
//             copyStyles = true,
//         } = this.props;
//
//         const mutFeatures = {...features} as IFeatures;
//
//         if (center) {
//             mutFeatures.width = mutFeatures?.width ? mutFeatures.width : 600;
//             mutFeatures.height = mutFeatures?.height ? mutFeatures.height : 640;
//
//             if (center === 'parent') {
//                 mutFeatures.left = window.top.outerWidth / 2 + window.top.screenX - mutFeatures.width / 2;
//                 mutFeatures.top = window.top.outerHeight / 2 + window.top.screenY - mutFeatures.height / 2;
//             } else if (center === 'screen') {
//                 const screenLeft = window.screenLeft;
//                 const screenTop = window.screenTop;
//                 const width = window.innerWidth
//                     ? window.innerWidth
//                     : document.documentElement.clientWidth
//                         ? document.documentElement.clientWidth
//                         : window.screen.width;
//                 const height = window.innerHeight
//                     ? window.innerHeight
//                     : document.documentElement.clientHeight
//                         ? document.documentElement.clientHeight
//                         : window.screen.height;
//
//                 mutFeatures.left = width / 2 - mutFeatures.width / 2 + screenLeft;
//                 mutFeatures.top = height / 2 - mutFeatures.height / 2 + screenTop;
//             }
//         }
//
//         // Open a new window.
//         this.window = window.open(url, name, toWindowFeatures(mutFeatures))
//         if (this.window && "document" in this.window) {
//             // TODO: Wrap this entire function with this nonsense.
//             this.container = this.window.document.createElement('div');
//         }
//
//         // When a new window use content from a cross-origin there's no way we can attach event
//         // to it. Therefore, we need to detect in a interval when the new window was destroyed
//         // or was closed.
//         this.windowCheckerInterval = setInterval(() => {
//             if (!this.window || this.window.closed) {
//                 this.release();
//             }
//         }, 50);
//
//         // Check if the new window was successfully opened.
//         if (this.window) {
//             this.window.document.title = title
//             if (this.container) {
//                 this.window.document.body.appendChild(this.container);
//             }
//
//             // If specified, copy styles from parent window's document.
//             if (copyStyles) {
//                 if ("document" in this.window) {
//                     setTimeout(() => copyTheStyles(document, this.window?.document as Document), 0);
//                 }
//             }
//
//             if (onOpen) {
//                 onOpen(this.window);
//             }
//
//             // Release anything bound to this component before the new window unload.
//             this.window.addEventListener('beforeunload', () => this.release());
//
//             // If the parent window closes and closeWithParent is true then close the new window as well.
//             if (this.props.closeWithParent) {
//                 window.addEventListener('unload', () => this.window?.close());
//             }
//         } else {
//             // Attempt to stop the onUnload() from firing before onBlock() fires.
//             clearInterval(this.windowCheckerInterval);
//
//             // Handle error on opening of new window.
//             if (onBlock) {
//                 onBlock();
//             } else {
//                 console.warn('A new window could not be opened. Maybe it was blocked.');
//             }
//         }
//     }
//
//     /**
//      * Close the opened window (if any) when NewWindow will unmount.
//      */
//     componentWillUnmount() {
//         if (this.window) {
//             this.window.close();
//         }
//     }
//
//     /**
//      * Release the new window and anything that was bound to it.
//      */
//     release() {
//         // This method can be called once.
//         if (this.released) {
//             return;
//         }
//         this.released = true;
//
//         // Remove checker interval.
//         clearInterval(this.windowCheckerInterval as number);
//
//         // Call any function bound to the `onUnload` prop.
//         const {onUnload} = this.props;
//
//         if (onUnload) {
//             onUnload();
//         }
//     }
// }
//
// /**
//  * Utility functions.
//  * @private
//  */
//
// /**
//  * Copy styles from a source document to a target.
//  * @param {Object} source
//  * @param {Object} target
//  * @private
//  */
//
// const copyTheStyles = (source: Document, target: Document) => {
//     // Store style tags, avoid reflow in the loop
//     const headFrag = target.createDocumentFragment()
//
//     Array.from(source.styleSheets).forEach(styleSheet => {
//         // For <style> elements
//         let rules;
//         try {
//             rules = styleSheet.cssRules;
//         } catch (err) {
//             console.error(err);
//         }
//         if (rules) {
//             // IE11 is very slow for appendChild, so use plain string here
//             const ruleText = [] as string[];
//
//             // Write the text of each rule into the body of the style element
//             Array.from(styleSheet.cssRules).forEach(cssRule => {
//                 const {type} = cssRule;
//
//                 /**
//                  * Skip unknown rules
//                  * CSSRule.UNKNOWN_RULE is deprecated.
//                  * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSRule/type
//                  */
//                 if (type === 0 /* CSSRule.UNKNOWN_RULE (DEPRECATED) */) {
//                     return;
//                 }
//
//                 let returnText = '';
//                 if (type === CSSRule.KEYFRAMES_RULE) {
//                     // IE11 will throw error when trying to access cssText property, so we
//                     // need to assemble them
//                     returnText = getKeyFrameText(cssRule);
//                 } else if (
//                     [CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)
//                 ) {
//                     // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5)
//                     // to handle local imports on a about:blank page
//                     // '/custom.css' turns to 'http://my-site.com/custom.css'
//                     returnText = fixUrlForRule(cssRule);
//                 } else {
//                     returnText = cssRule.cssText;
//                 }
//                 ruleText.push(returnText);
//             })
//
//             const newStyleEl = target.createElement('style');
//             newStyleEl.textContent = ruleText.join('\n');
//             headFrag.appendChild(newStyleEl);
//         } else if (styleSheet.href) {
//             // for <link> elements loading CSS from a URL
//             const newLinkEl = target.createElement('link');
//
//             newLinkEl.rel = 'stylesheet';
//             newLinkEl.href = styleSheet.href;
//             headFrag.appendChild(newLinkEl);
//         }
//     })
//
//     target.head.appendChild(headFrag);
// }
//
// /**
//  * Make keyframe rules.
//  * @param {CSSRule} cssRule
//  * @return {String}
//  * @private
//  */
// const getKeyFrameText = (cssRule: any) => {
//     const tokens = ['@keyframes', cssRule.name, '{'];
//     // @ts-ignore
//     Array.from(cssRule.cssRules).forEach(cssRule => {
//         // type === CSSRule.KEYFRAME_RULE should always be true
//         // @ts-ignore
//         tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}');
//     })
//     tokens.push('}');
//     return tokens.join(' ');
// }
//
// /**
//  * Handle local import urls.
//  * @param {CSSRule} cssRule
//  * @return {String}
//  * @private
//  */
// const fixUrlForRule = (cssRule: CSSRule) => {
//     return cssRule.cssText
//         .split('url(')
//         .map(line => {
//             if (line[1] === '/') {
//                 return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`
//             }
//             return line;
//         })
//         .join('url(');
// }
//
// /**
//  * Convert features props to window features format (name=value,other=value).
//  * @param {Object} obj
//  * @return {String}
//  * @private
//  */
// const toWindowFeatures = (obj: IFeatures) => {
//     return Object.keys(obj)
//         .reduce((features, name) => {
//             const value = obj[name];
//             if (typeof value === 'boolean') {
//                 // @ts-ignore
//                 features.push(`${name}=${value ? 'yes' : 'no'}`);
//             } else {
//                 // @ts-ignore
//                 features.push(`${name}=${value}`);
//             }
//             return features;
//         }, [])
//         .join(',');
// }
//
// /**
//  * Component export.
//  * @private
//  */
// export default NewImprovedWindow;
