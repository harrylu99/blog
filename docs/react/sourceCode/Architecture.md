---
title: Architecture
date: 2022-03-01
---

## Foreword

We have talked about the concept of `React` in the last article and to sum up, the concept of `React` is fast response.

`React` have refactored the entie software architecture from V15 to V16. And we will start from the architecture of V15 to think about why `React` did such a huge change in V16.

## Architecture of React15

There are two layers in React15, which are

- Reconciler -- Find the modified components
- Renderer -- Render the modified components to the page

### Reconciler

You should know that we could use `this.setState`, `this.forceUpdate`, `ReactDOM.render`, etc APIs for trigger the updates in `React`.

_Reconciler_ would do these when
