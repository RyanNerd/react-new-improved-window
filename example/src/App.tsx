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
                name="example"
                title="The Amazing Popup Window"
                center="parent"
                onOpen={(w) => {
                    setDidOpen(true);
                    w.focus();
                    console.log('popup window title', w.document.title);
                }}
                onBlock={() => alert('Unable to open popup window')}
                onUnload={() => setShow(false)}
                closeWithParent={true}
            >
                <h1 style={{textAlign: "center"}}> Example Window Popup!</h1>
                <article>
                    <section>
                        {/* tslint:disable-next-line:max-line-length */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet nulla vel massa tincidunt, vel ultricies diam volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et nunc lobortis, varius tortor vel, semper justo. In hac habitasse platea dictumst. Nunc vel tortor a ligula maximus euismod a vel dui. Vivamus pretium congue felis, ac commodo nulla ultricies in. Sed fringilla ex ex, quis elementum nisi rhoncus ut. Sed scelerisque accumsan ultrices. Praesent nulla magna, pellentesque at convallis id, euismod in felis. Nulla fermentum, elit vel pulvinar iaculis, ante lectus vulputate sem, in tristique eros nisl id massa. Vestibulum eget elit ut ipsum auctor mattis. Duis vulputate eget urna quis aliquet. Curabitur sed dapibus nulla, a ornare felis. Etiam suscipit dui vitae consectetur ullamcorper.
                    </section>
                    <p> </p>
                    <section>
                        {/* tslint:disable-next-line:max-line-length */}
                        Vivamus congue ultrices dui, vitae accumsan lacus blandit dignissim. Pellentesque tincidunt quam nec tortor commodo posuere quis ut metus. Vivamus ut mi ligula. Praesent maximus tellus massa, eu egestas tortor sollicitudin sed. Integer nunc metus, venenatis nec magna sit amet, blandit varius quam. Proin ultrices metus vitae mattis ultrices. Vivamus mattis turpis vel velit vestibulum suscipit. Nullam hendrerit vitae ligula id rhoncus. Nullam placerat sed sem sed pulvinar. Curabitur vehicula molestie nisi ac imperdiet. Donec eu massa orci.
                    </section>
                </article>
                <button onClick={() => window.alert('show message')}>
                    Show alert
                </button>
                <button onClick={() => window.close()}>
                    Close me
                </button>
            </NewImprovedWindow>
            }
        </>
    )
}

export default App;
