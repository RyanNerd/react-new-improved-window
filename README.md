[comment]: <> ([![React New Window - Pop new windows in React, using window.open API.]&#40;.github/banner.svg&#41;]&#40;#features&#41;)

> Inspired by [David Gilbertson's article](https://hackernoon.com/using-a-react-16-portal-to-do-something-cool-2a2d627b0202).

> Pseudo-fork of [react-new-window](https://github.com/rmariuzzo/react-new-window)
> by [Rubens Mariuzzo](https://github.com/rmariuzzo)

## Features

- **Small footprint**
- **Support the full `window.open` api**.
- **Built for React 16 and 17** (uses `ReactDOM.createPortal`).
- **Handler for blocked popups** (via `onBlock` prop).
- **Center popups** according to the parent _window_ or _screen_.
- **No external dependencies** Only React 16 or 17 as a _peer_ dependency.

### What's different from `react-new-window`?
- Codebase has been rewritten in TypeScript with many bugs discovered and fixed in the process.
- `closeWithParent` property indicating to close the new window when the parent window closes.
- Installation doesn't require the `--force` switch since **both** React 16 and 17 are supported.
- If the `title` property is missing the new window will use the parent window's title.
- The `features` property no longer require `height` and `width` if not given and the `center`
  property is set then this will default to `height: 600, width: 640`.  
- **Note:** Internet Explorer will no longer be supported. 

## Installation

```sh
npm i react-new-improved-window --save
```

## Usage

```js
import React from 'react'
import NewWindow from 'react-new-improved-window'

const Demo = () => (
  <NewImprovedWindow>
    <h1>Hi 👋</h1>
  </NewImprovedWindow>
)
```

When **`<NewImprovedWindow />`** is mounted a popup window will be opened. When unmounted then the popup will be closed.

The `children` contents is what will be rendered into the new popup window. In that case `Hi 👋` will be the content. The content can include any react-stateful code.

## Documentation

| Properties | Type       | Default       | Description |
 | ---        | ---        | ---           | ---         |
| `url`      | `String`   | ` `           | The URL to open, if specified any `children` will be overriden ([more details on `url`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)). |
| `name`     | `String`   | ` `           | The name of the window ([more details on `windowName`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)). |
| `title`    | `String`   | ` `           | The title of the new window document. |
| `features` | `Object`   | `{}`          | The set of window features ([more details on `windowFeatures`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features)). |
| `onUnload` | `Function` | `undefined`   | A function to be triggered before the new window unload. |
| `onBlock`  | `Function` | `undefined`   | A function to be triggered when the new window could not be opened. |
| `closeWithParent` | `boolean` | `false` | When set to true when the parent window closes so will the popup window. |
| `center`   | `String`   | `parent`      | Indicate how to center the new window. Valid values are: `parent` or `screen`. `parent` will center the new window according to its _parent_ window. `screen` will center the new window according to the _screen_. |
| `copyStyles`  | `Boolean` | `true`   | If specified, copy styles from parent window's document. |

## Development

To start contributing to this project, please do:

1. Fork and clone this repo.
2. Make the changes you want to.
3. Create and push a PR.

To build the library you should have TypeScript installed globally `npm install -g typescript`

`npm run build`

## Test (example)

In the base directory:
```sh
cd example
npm install # You only need to do this once
npm start
```

This will start the example React App. The example app is linked directly to react-new-improved-window and will pick up
any changes made when the library is built.

See: `example/src/App.tsx`

### Prior work

- [react-popout](https://github.com/JakeGinnivan/react-popout).
- [react-new-window](https://github.com/rmariuzzo/react-new-window)
---

 <div align=center>

Special thanks to [Rubens Mariuzzo](https://github.com/rmariuzzo).

[MIT License](LICENSE)

 </div>