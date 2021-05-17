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
/**
 * Index component
 * @param {IProps} props
 */
var Index = function (props) {
    var _a = props.url, url = _a === void 0 ? '' : _a, _b = props.name, name = _b === void 0 ? '' : _b, _c = props.title, title = _c === void 0 ? document.title : _c, _d = props.features, features = _d === void 0 ? {} : _d, onBlock = props.onBlock, onOpen = props.onOpen, onUnload = props.onUnload, center = props.center, _e = props.copyStyles, copyStyles = _e === void 0 ? true : _e, closeWithParent = props.closeWithParent, children = props.children;
    // We need a container element for createPortal()
    var _f = useState(document.createElement('div')), container = _f[0], setContainer = _f[1];
    // We need to override features in some cases so we make a mutable copy.
    var mutFeatures = __assign({}, features);
    // If the center prop is given then the top and left features are calculated
    if (center) {
        // If width or height are not set then we use defaults
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
                    features.push(name + "=" + (value ? 'yes' : 'no'));
                }
                else {
                    features.push(name + "=" + value);
                }
                return features;
            }, [])
                .join(',');
        };
        /**
         * Copy styles from a source document to a target.
         * @param {Document} source
         * @param {Document} target
         */
        var cloneStyles = function (source, target) {
            // Store style tags, avoid reflow in the loop
            var headFrag = target.createDocumentFragment();
            Array.from(source.styleSheets).forEach(function (styleSheet) {
                // For <style> elements
                var rules;
                try {
                    rules = styleSheet.cssRules;
                }
                catch (err) {
                    console.error(err);
                }
                if (rules) {
                    // IE11 is very slow for appendChild, so use plain string here
                    var ruleText_1 = [];
                    // Write the text of each rule into the body of the style element
                    Array.from(styleSheet.cssRules).forEach(function (cssRule) {
                        var type = cssRule.type;
                        /**
                         * Skip unknown rules
                         * CSSRule.UNKNOWN_RULE is deprecated.
                         * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSRule/type
                         */
                        if (type === 0 /* CSSRule.UNKNOWN_RULE (DEPRECATED) */) {
                            return;
                        }
                        var returnText = '';
                        if (type === CSSRule.KEYFRAMES_RULE) {
                            // IE11 will throw error when trying to access cssText property, so we
                            // need to assemble them
                            returnText = getKeyFrameText(cssRule);
                        }
                        else if ([CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)) {
                            // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5)
                            // to handle local imports on a about:blank page
                            // '/custom.css' turns to 'http://my-site.com/custom.css'
                            returnText = fixUrlForRule(cssRule);
                        }
                        else {
                            returnText = cssRule.cssText;
                        }
                        ruleText_1.push(returnText);
                    });
                    var newStyleEl = target.createElement('style');
                    newStyleEl.textContent = ruleText_1.join('\n');
                    headFrag.appendChild(newStyleEl);
                }
                else if (styleSheet.href) {
                    // for <link> elements loading CSS from a URL
                    var newLinkEl = target.createElement('link');
                    newLinkEl.rel = 'stylesheet';
                    newLinkEl.href = styleSheet.href;
                    headFrag.appendChild(newLinkEl);
                }
            });
            target.head.appendChild(headFrag);
        };
        /**
         * Make keyframe rules
         * @param {CSSRule} cssRule
         * @return {string}
         */
        var getKeyFrameText = function (cssRule) {
            var tokens = ['@keyframes', cssRule.name, '{'];
            Array.from(cssRule.cssRules).forEach(function (cssRule) {
                // type === CSSRule.KEYFRAME_RULE should always be true
                // @ts-ignore
                tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}');
            });
            tokens.push('}');
            return tokens.join(' ');
        };
        /**
         * Handle local import urls
         * @param {CSSRule} cssRule
         * @return {String}
         */
        var fixUrlForRule = function (cssRule) {
            return cssRule.cssText
                .split('url(')
                .map(function (line) {
                if (line[1] === '/') {
                    return "" + line.slice(0, 1) + window.location.origin + line.slice(1);
                }
                return line;
            })
                .join('url(');
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
        /**
         * Here's where the ✨ magic ✨ really starts
         */
        // Create a new popup window
        var win = window.open(url, name, toWindowFeatures(mutFeatures));
        // Did the popup window get created?
        if (win) {
            win.document.title = title;
            // If specified, copy styles from parent window's document.
            if (copyStyles) {
                setTimeout(function () { return cloneStyles(document, win.document); }, 0);
            }
            // Add beforeunload event listener
            win.addEventListener('beforeunload', function () { return handleBeforeunload(); });
            // If the parent window closes and closeWithParent is true then close the new window as well.
            if (closeWithParent) {
                window.addEventListener('unload', function () { return handleClose(); });
            }
            // Add the div container element to the popup window
            win.document.body.appendChild(container);
            // Fire props.onOpen()
            if (onOpen) {
                onOpen(win);
            }
        }
        else {
            // Fire props.onBlock() if the popup window didn't get created.
            if (onBlock) {
                onBlock();
            }
            // @ts-ignore Set the container to null to flag the component as blocked.
            setContainer(null);
        }
        // Clean up
        return function () {
            // Fire props.onUnload()
            if (onUnload) {
                onUnload();
            }
            // Close the popup window and remove the listeners
            if (win) {
                win.removeEventListener('beforeunload', handleBeforeunload);
                win.close();
                if (closeWithParent) {
                    window.removeEventListener('unload', function () { return handleClose; });
                }
            }
        };
    }, []);
    // If the window popup was created then open the window in a portal.
    if (container) {
        return ReactDOM.createPortal(children, container);
    }
    // Unable to create popup window return null
    return null;
};
export default Index;
