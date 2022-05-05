---
title: Architecture
date: 2022-04-07
---

## Foreword

We have talked about the concept of `React` in the last article. To sum up, the concept of `React` is fast response.

`React` have refactored the entie software architecture in V16. We will start from talking about the architecture of V15 and to think about why `React` refactored in V16.

## Architecture of React15

There are two layers in React15, which are

- Reconciler -- Find the modified components.
- Renderer -- Render the modified components to the page.

### Reconciler

You should know that we could use `this.setState`, `this.forceUpdate`, `ReactDOM.render`, etc APIs for trigger the updates in `React`.

`Reconciler` will do the following steps when upodates are in process.

- Translate JSX to virtual DOM by using function component or `render` method of class component.
- Compare the virtual DOM with the virtual DOM from the last updated.
- Find out the update virtual DOMs through the compartion.
- Notice Renderer for rendering the updated virtual DOM to the page.

[You can find more about Reconciler here](https://reactjs.org/docs/codebase-overview.html#reconcilers)

### Renderer

`React` support mutil-platfrom and each platform has different Renderer. What we are going to talking about here is `ReactDOM`, which take resposibility for rendering in the browser.

Besides, `React` has

- `ReactNative` for rendering App component
- `ReactTest` for rendring plain JS object for test
- `ReactArt` for rendring Canvas, SVG or VML(IE8)

Everytime when it is updated, Renderer receive the notification from Reconciler and then it rendering the latest component.

[Check what React say about Renderer](https://reactjs.org/docs/codebase-overview.html#renderers)

## Problems

`mount` component uses [mountComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L498) and `update` component uses [updateComponent](https://github.com/facebook/react/blob/15-stable/src/renderers/dom/shared/ReactDOMComponent.js#L877) in `Reconciler`. Those two methods update the children components recursively.

Updates cannot be puaused or stopped cause the recursive. When it update with a deep layer, the interaction might be stutter.

So, what if we paused the updating manually in React 15?

The result is, the page will show with the part have updated and the part have not updated yet at the same time, which means the update cannot be asynchronously. And that is the reason why `React` team want to rebuild their architecture.
