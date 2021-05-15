import { useEffect, useRef } from "react";
function usePortal(win) {
    var rootElemRef = useRef(document.createElement('div'));
    useEffect(function setupElement() {
        // Look for existing target dom element to append to
        win.document.body.appendChild(rootElemRef.current);
        // This function is run on unmount
        return function removeElement() {
            rootElemRef.current.remove();
        };
    }, [win]);
    return rootElemRef.current;
}
export default usePortal;
