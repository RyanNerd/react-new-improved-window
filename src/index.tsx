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
    noreferrer?: boolean
}

interface IProps extends PropsWithChildren<any>{
    url?: string
    name?: string
    title?: string
    features?: IFeatures
    onBlock?: () => void
    onOpen?: () => void
    //onUnload?: () => void
    // center?: 'parent' | 'screen'
    // copyStyles?: boolean
    // closeWithParent?: boolean
}

const NewImprovedWindow = (props: IProps) => {
    const {
        url = '',
        name = '',
        title = document.title,
        features = {height: 600, width: 640},
        onBlock,
        onOpen,
        onUnload,
//        center,
//        copyStyles,
//        closeWithParent,
        children
    } = props;

    const [container] = useState(document.createElement('div'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        /**
         * Convert features props to window features format (name=value,other=value).
         * @param {Object} obj
         * @return {String}
         * @private
         */
        const toWindowFeatures = (obj: IFeatures) => {
            return Object.keys(obj)
                .reduce((features, name) => {
                    // @ts-ignore
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


        const win = window.open(url, name, toWindowFeatures(features));

        if (win) {
            if (onOpen) {
                onOpen();
            }

            win.document.title = title;

            // @ts-ignore
            win.document.body.appendChild(container);
        } else {
            if (onBlock) {
                onBlock();
            }
        }

        return () => {
            if (onUnload) {
                onUnload();
            }
            win?.close();
        }
    }, [])

    if (container) {
        // @ts-ignore
        return ReactDOM.createPortal(children, container);
    }
    return null;
}

export default NewImprovedWindow;
