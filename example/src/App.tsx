import React, {useState} from "react";
import NewImprovedWindow from "react-new-improved-window";

function App() {
    const [show, setShow] = useState(false);
    return (
        <>
            <p>
                This is the parent window.
            </p>
            <button
                onClick={() => {
                    setShow(!show)
                }}
            >
                <span>{show ? "Hide" : "Show"} New Improved Window</span>
            </button>

            {show &&
            <NewImprovedWindow
                center="parent"
                onUnload={() => setShow(false)}
                closeWithParent={true}
            >
                <h1>Example Window Popup!</h1>
            </NewImprovedWindow>
            }
        </>
    )
}

export default App;
