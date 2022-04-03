---
title: File Structure
date: 2022-04-02
---

## Root Directory

Excluding the configuration files and hidden folders, the root directory consists of three folders.

```
Root Directory
├── fixtures        // Includes some small React testing projects for contributors
├── packages        // Contains metadata (e.g. package.json) and source code for all packages in the React repository (subdirectory src)
├── scripts         // Scripts for various toolchains, such as git, jest, eslint, etc.
```

We are going to focus on the `packages` directory.

## packages Directory

There are a lot of folders in the `packages` directory, so let's look at these.

### [react Floder](https://github.com/facebook/react/tree/main/packages/react)

The core of React, containing all the global React APIs, such as

- React.createElement
- React.Component
- React.Children

These APIs are common across the platform, it does not contain platform specific code such as `ReactDOM`, `ReactNative`, etc. It is released as a [separate package](https://www.npmjs.com/package/react) on NPM.

### [scheduler Floder](https://github.com/facebook/react/tree/main/packages/scheduler)

Implementation of Scheduler.

### [shared Floder](https://github.com/facebook/react/tree/main/packages/shared)

Commmon `methods` and `global variables` other modules in the source code, such as in [shared/ReactSymbols.js](https://github.com/facebook/react/blob/main/packages/shared/ReactSymbols.js) which holds the definitions of React's different component types.

```js
// ...
export let REACT_ELEMENT_TYPE = 0xeac7;
export let REACT_PORTAL_TYPE = 0xeaca;
export let REACT_FRAGMENT_TYPE = 0xeacb;
// ...
```

### `Renderer` related folders

The following folders are the corresponding `Renderer`

```
- react-art
- react-dom                 // entrance of DOM and SSR
- react-native-renderer
- react-noop-renderer       // for debug fiber
- react-test-renderer
```

### Folders for experimental packages

`React` pulls out parts of its own process into packages that can be used independently, and because they are experimental in nature, they are not recommended for use in production environments. The following folders are included

```
- react-server        // create custom SSR streams
- react-client        // create custom streams
- react-fetch         // for data request
- react-interactions  // for testing interaction-related internal features, such as React's event model
- react-reconciler    // implement of Reconciler, you can create your own Renderer by using it
```

### Folders for utilities

`React` puts some helper functions into separate packages.

```
- react-is       // used to test if a component is of a certain type
- react-client   // create custom streams
- react-fetch    // for data request
- react-refresh  // hot reload
```

### [react-reconciler Floder](https://github.com/facebook/react/tree/main/packages/react-reconciler)

We need to focus on `react-reconciler`

Although he is an experimental package, many of the internal features are not yet open in the official version. However, he docks the Scheduler on one side and the `Renderer` on the other side of different platforms, forming the architecture of the whole React16 system.
