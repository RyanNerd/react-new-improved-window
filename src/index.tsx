import {PropsWithChildren, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

interface IFeatures {
    width?: number,
    height?: number,
    left?: number,
    top?: number,
    toolbar?: boolean,
    menubar?: boolean,
    location?: boolean,
    status?: boolean,
    resizable?: boolean,
    scrollbars?: boolean,
    noopener?: boolean,
    noreferrer?: boolean,
    [k: string]: any
}

interface IProps extends PropsWithChildren<any> {
    url?: string
    name?: string
    title?: string
    features?: IFeatures
    onBlock?: () => void
    onOpen?: (w: Window) => void
    onUnload?: () => void
    center?: 'parent' | 'screen'
    copyStyles?: boolean
    closeWithParent?: boolean
}

/**
 * NewImprovedWindow component
 * @param {IProps} props
 */
const NewImprovedWindow = (props: IProps) => {
    const {
        url = '',
        name = '',
        title = document.title,
        features = {},
        onBlock,
        onOpen,
        onUnload,
        center,
        copyStyles = true,
        closeWithParent,
        children
    } = props;

    // We need a container element for createPortal()
    const [container, setContainer] = useState(document.createElement('div'));

    // We need to override features in some cases so we make a mutable copy.
    const mutFeatures = {...features} as IFeatures;

    // If the center prop is given then the top and left features are calculated
    if (center) {
        // If width or height are not set then we use defaults
        mutFeatures.width = mutFeatures?.width ? mutFeatures.width : 600;
        mutFeatures.height = mutFeatures?.height ? mutFeatures.height : 640;

        if (center === 'parent') {
            mutFeatures.left = window.top.outerWidth / 2 + window.top.screenX - mutFeatures.width / 2;
            mutFeatures.top = window.top.outerHeight / 2 + window.top.screenY - mutFeatures.height / 2;
        } else if (center === 'screen') {
            const screenLeft = window.screenLeft;
            const screenTop = window.screenTop;
            const width = window.innerWidth
                ? window.innerWidth
                : document.documentElement.clientWidth
                    ? document.documentElement.clientWidth
                    : window.screen.width;
            const height = window.innerHeight
                ? window.innerHeight
                : document.documentElement.clientHeight
                    ? document.documentElement.clientHeight
                    : window.screen.height;

            mutFeatures.left = width / 2 - mutFeatures.width / 2 + screenLeft;
            mutFeatures.top = height / 2 - mutFeatures.height / 2 + screenTop;
        }
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        /**
         * Convert features props to window features format (name=value,other=value).
         * @param {IFeatures} obj
         * @return {String}
         */
        const toWindowFeatures = (obj: IFeatures) => {
            return Object.keys(obj)
                .reduce((features, name) => {
                    const value = obj[name];
                    if (typeof value === 'boolean') {
                        // @ts-ignore
                        features.push(`${name}=${value ? 'yes' : 'no'}`);
                    } else {
                        // @ts-ignore
                        features.push(`${name}=${value}`);
                    }
                    return features;
                }, [])
                .join(',');
        }

        /**
         * Copy styles from a source document to a target.
         * @param {Document} source
         * @param {Document} target
         */
        const __copyStyles = (source: Document, target: Document) => {
            // Store style tags, avoid reflow in the loop
            const headFrag = target.createDocumentFragment()

            Array.from(source.styleSheets).forEach(styleSheet => {
                // For <style> elements
                let rules;
                try {
                    rules = styleSheet.cssRules;
                } catch (err) {
                    console.error(err);
                }
                if (rules) {
                    // IE11 is very slow for appendChild, so use plain string here
                    const ruleText = [] as string[];

                    // Write the text of each rule into the body of the style element
                    Array.from(styleSheet.cssRules).forEach(cssRule => {
                        const {type} = cssRule;

                        /**
                         * Skip unknown rules
                         * CSSRule.UNKNOWN_RULE is deprecated.
                         * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSRule/type
                         */
                        if (type === 0 /* CSSRule.UNKNOWN_RULE (DEPRECATED) */) {
                            return;
                        }

                        let returnText = '';
                        if (type === CSSRule.KEYFRAMES_RULE) {
                            // IE11 will throw error when trying to access cssText property, so we
                            // need to assemble them
                            returnText = getKeyFrameText(cssRule);
                        } else if (
                            [CSSRule.IMPORT_RULE, CSSRule.FONT_FACE_RULE].includes(type)
                        ) {
                            // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5)
                            // to handle local imports on a about:blank page
                            // '/custom.css' turns to 'http://my-site.com/custom.css'
                            returnText = fixUrlForRule(cssRule);
                        } else {
                            returnText = cssRule.cssText;
                        }
                        ruleText.push(returnText);
                    })

                    const newStyleEl = target.createElement('style');
                    newStyleEl.textContent = ruleText.join('\n');
                    headFrag.appendChild(newStyleEl);
                } else if (styleSheet.href) {
                    // for <link> elements loading CSS from a URL
                    const newLinkEl = target.createElement('link');

                    newLinkEl.rel = 'stylesheet';
                    newLinkEl.href = styleSheet.href;
                    headFrag.appendChild(newLinkEl);
                }
            })

            target.head.appendChild(headFrag);
        }

        /**
         * Make keyframe rules
         * @param {CSSRule} cssRule
         * @return {string}
         */
        const getKeyFrameText = (cssRule: any) => {
            const tokens = ['@keyframes', cssRule.name, '{'];
            // @ts-ignore
            Array.from(cssRule.cssRules).forEach(cssRule => {
                // type === CSSRule.KEYFRAME_RULE should always be true
                // @ts-ignore
                tokens.push(cssRule.keyText, '{', cssRule.style.cssText, '}');
            })
            tokens.push('}');
            return tokens.join(' ');
        }

        /**
         * Handle local import urls
         * @param {CSSRule} cssRule
         * @return {String}
         */
        const fixUrlForRule = (cssRule: CSSRule) => {
            return cssRule.cssText
                .split('url(')
                .map(line => {
                    if (line[1] === '/') {
                        return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`
                    }
                    return line;
                })
                .join('url(');
        }

        /**
         * Beforeunload event handler
         */
        const handleBeforeunload = () => {
            if (onUnload) {
                onUnload();
            }
        }

        /**
         * Close event handler
         */
        const handleClose = () => {
            if (win) {
                win.close();
            }
        }

        /**
         * Here's where the ✨ magic ✨ really starts
         */

        // Create a new popup window
        const win = window.open(url, name, toWindowFeatures(mutFeatures));

        // Did the popup window get created?
        if (win) {
            win.document.title = title;

            // If specified, copy styles from parent window's document.
            if (copyStyles) {
                setTimeout(() => __copyStyles(document, win.document), 0);
            }

            // Add beforeunload event listener
            win.addEventListener('beforeunload', () => handleBeforeunload());

            // If the parent window closes and closeWithParent is true then close the new window as well.
            if (closeWithParent) {
                window.addEventListener('unload', () => handleClose());
            }

            // Add the div container element to the popup window
            win.document.body.appendChild(container);

            // Fire props.onOpen()
            if (onOpen) {
                onOpen(win);
            }
        } else {
            // Fire props.onBlock() if the popup window didn't get created.
            if (onBlock) {
                onBlock();
            }

            // @ts-ignore Set the container to null to flag the component as blocked.
            setContainer(null);
        }

        // Clean up
        return () => {
            // Fire props.onUnload()
            if (onUnload) {
                onUnload();
            }

            // Close the popup window and remove the listeners
            if (win) {
                win.removeEventListener('beforeunload', handleBeforeunload);
                win.close();
                if (closeWithParent) {
                    window.removeEventListener('unload', () => handleClose);
                }
            }
        }
    }, [])

    // If the window popup was created then open the window in a portal.
    if (container) {
        return ReactDOM.createPortal(children, container);
    }

    // Unable to create popup window return null
    return null;
}

export default NewImprovedWindow;
