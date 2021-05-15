var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import React from 'react';
import ReactDOM from 'react-dom';
/**
 * The NewWindow class object.
 * @public
 */
var NewImprovedWindow = /** @class */ (function (_super) {
    __extends(NewImprovedWindow, _super);
    /**
     * The NewWindow function constructor.
     * @param {Object} props
     */
    function NewImprovedWindow(props) {
        var _this = _super.call(this, props) || this;
        _this.container = null;
        _this.window = null;
        _this.windowCheckerInterval = null;
        _this.released = false;
        _this.state = {
            mounted: false
        };
        return _this;
    }
    /**
     * Render the NewWindow component.
     */
    NewImprovedWindow.prototype.render = function () {
        if (!this.state.mounted)
            return null;
        return ReactDOM.createPortal(this.props.children, this.container);
    };
    NewImprovedWindow.prototype.componentDidMount = function () {
        this.openChild();
        this.setState({ mounted: true });
    };
    /**
     * Create the new window when NewWindow component mount.
     */
    NewImprovedWindow.prototype.openChild = function () {
        var _this = this;
        var _a = this.props, _b = _a.url, url = _b === void 0 ? '' : _b, _c = _a.name, name = _c === void 0 ? '' : _c, _d = _a.title, title = _d === void 0 ? document.title : _d, features = _a.features, onBlock = _a.onBlock, onOpen = _a.onOpen, center = _a.center, _e = _a.copyStyles, copyStyles = _e === void 0 ? true : _e;
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
        // Open a new window.
        this.window = window.open(url, name, toWindowFeatures(mutFeatures));
        if (this.window && "document" in this.window) {
            // TODO: Wrap this entire function with this nonsense.
            this.container = this.window.document.createElement('div');
        }
        // When a new window use content from a cross-origin there's no way we can attach event
        // to it. Therefore, we need to detect in a interval when the new window was destroyed
        // or was closed.
        this.windowCheckerInterval = setInterval(function () {
            if (!_this.window || _this.window.closed) {
                _this.release();
            }
        }, 50);
        // Check if the new window was successfully opened.
        if (this.window) {
            this.window.document.title = title;
            if (this.container) {
                this.window.document.body.appendChild(this.container);
            }
            // If specified, copy styles from parent window's document.
            if (copyStyles) {
                if ("document" in this.window) {
                    setTimeout(function () { var _a; return copyTheStyles(document, (_a = _this.window) === null || _a === void 0 ? void 0 : _a.document); }, 0);
                }
            }
            if (onOpen) {
                onOpen(this.window);
            }
            // Release anything bound to this component before the new window unload.
            this.window.addEventListener('beforeunload', function () { return _this.release(); });
            // If the parent window closes and closeWithParent is true then close the new window as well.
            if (this.props.closeWithParent) {
                window.addEventListener('unload', function () { var _a; return (_a = _this.window) === null || _a === void 0 ? void 0 : _a.close(); });
            }
        }
        else {
            // Attempt to stop the onUnload() from firing before onBlock() fires.
            clearInterval(this.windowCheckerInterval);
            // Handle error on opening of new window.
            if (onBlock) {
                onBlock();
            }
            else {
                console.warn('A new window could not be opened. Maybe it was blocked.');
            }
        }
    };
    /**
     * Close the opened window (if any) when NewWindow will unmount.
     */
    NewImprovedWindow.prototype.componentWillUnmount = function () {
        if (this.window) {
            this.window.close();
        }
    };
    /**
     * Release the new window and anything that was bound to it.
     */
    NewImprovedWindow.prototype.release = function () {
        // This method can be called once.
        if (this.released) {
            return;
        }
        this.released = true;
        // Remove checker interval.
        clearInterval(this.windowCheckerInterval);
        // Call any function bound to the `onUnload` prop.
        var onUnload = this.props.onUnload;
        if (onUnload) {
            onUnload();
        }
    };
    return NewImprovedWindow;
}(React.PureComponent));
/**
 * Utility functions.
 * @private
 */
/**
 * Copy styles from a source document to a target.
 * @param {Object} source
 * @param {Object} target
 * @private
 */
var copyTheStyles = function (source, target) {
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
 * Make keyframe rules.
 * @param {CSSRule} cssRule
 * @return {String}
 * @private
 */
var getKeyFrameText = function (cssRule) {
    var tokens = ['@keyframes', cssRule.name, '{'];
    // @ts-ignore
    Array.from(cssRule.cssRules).forEach(function (cssRule) {
        // type === CSSRule.KEYFRAME_RULE should always be true
        // @ts-ignore
        tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}');
    });
    tokens.push('}');
    return tokens.join(' ');
};
/**
 * Handle local import urls.
 * @param {CSSRule} cssRule
 * @return {String}
 * @private
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
 * Convert features props to window features format (name=value,other=value).
 * @param {Object} obj
 * @return {String}
 * @private
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
 * Component export.
 * @private
 */
export default NewImprovedWindow;
