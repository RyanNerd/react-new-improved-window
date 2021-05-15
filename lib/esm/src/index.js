import Portal from "../example/src/Portal";
var NewImprovedWindow = function (props) {
    var _a = props.url, url = _a === void 0 ? '' : _a, _b = props.name, name = _b === void 0 ? '' : _b, _c = props.title, title = _c === void 0 ? '' : _c, _d = props.features, features = _d === void 0 ? { width: '600px', height: '640px' } : _d, onBlock = props.onBlock, onOpen = props.onOpen, onUnload = props.onUnload, _e = props.center, center = _e === void 0 ? 'parent' : _e, _f = props.copyStyles, copyStyles = _f === void 0 ? true : _f, children = props.children;
    // const [mounted, setMounted] = useState(false);
    // const [newWindow, setNewWindow] = useState<Window | null>(null);
    // const [windowContainer, setWindowContainer] = useState<Element | null>(null);
    // @ts-ignore
    var stfu = { title: title, features: features, onUnload: onUnload, onOpen: onOpen, onBlock: onBlock, center: center, copyStyles: copyStyles };
    var portal;
    var win = window.open(url, name, '');
    if (win) {
        win.document.title = title;
        //        portal = ReactDOM.createPortal(children, windowContainer as Element);
    }
    // useEffect(() => {
    //     return () => {
    //         if (newWindow && "close" in newWindow) {
    //             newWindow.close();
    //         }
    //     }
    // }, []);
    if (win && portal) {
        var windowContainer = win.document.createElement('div');
        win.document.body.appendChild(windowContainer);
        return (React.createElement(Portal, { mount: windowContainer }, children));
    }
    return null;
};
export default NewImprovedWindow;
