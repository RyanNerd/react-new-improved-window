// import {useEffect, useState} from "react";
//
// const PopupWindowWithHooks = props => {
//     const [containerEl] = useState(
//         document.createElement('div')
//     )
//     let externalWindow = null
//
//     useEffect(
//         () => {
//             externalWindow = window.open(
//                 '',
//                 '',
//                 `width=600,height=400,left=200,top=200`
//             )
//
//             externalWindow.document.body.appendChild(containerEl)
//             externalWindow.addEventListener(
//                 'beforeunload',
//                 () => {
//                     props.closePopupWindowWithHooks()
//                 }
//             )
//             console.log('Created Popup Window')
//             return function cleanup() {
//                 console.log('Cleaned up Popup Window')
//                 externalWindow.close()
//                 externalWindow = null
//             }
//         },
//         // Only re-renders this component if the variable changes
//         []
//     )
//     return ReactDOM.createPortal(props.children, containerEl)
// }
//
// export default PopupWindowWithHooks;
