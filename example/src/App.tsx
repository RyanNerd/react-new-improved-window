import React, {useState} from "react";
import NewImprovedWindow from "react-new-improved-window";

function App() {
    const [show, setShow] = useState(false);
    const [didOpen, setDidOpen] = useState(false);

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

            {didOpen && show &&
                <h1>
                    The popup window opened!
                </h1>
            }

            {show &&
            <NewImprovedWindow
                title="The Amazing Popup Window"
                center="parent"
                features={{resizable: false}}
                onOpen={(w) => {
                    setDidOpen(true);
                    console.log('popup window title', w.document.title);
                }}
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
