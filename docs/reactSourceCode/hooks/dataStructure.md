---
title: Hooks -- Data Structure
date: 2022-05-23
---

## Foreword

We have implemented a simple `useState` in tha last article for understanding the operational principle of `Hooks`.

In this article, we will focus on the data structure of the `Hooks`.

## dispatcher

We know that `isMount` is used for indentified the `mount` and `update` from the last article.

In the real `Hooks`, the `hook` when the component `mount` or the `hook` when the component `update` come from different objects, which we named them `dispatcher`.

```js
// Dispatcher when mount
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  // ...
}

// Dispatcher when update
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  // ...
}
```

As we can see here, the fucntion of the `hook` called when `mount` is different with the funtion of the `hook` called when `update`.

Before `FunctionComponent` `render`, `mount` or `update` will be judged by the different conditions of the `FunctionComponent` corresponding fiber.

```js
current === null || current.memoizedState === null
```

And assign the `dispatcher` corresponding to the different cases to the `current` property of the global variable `ReactCurrentDispatcher`.

```js
ReactCurrentDispatcher.current =
  current === null || current.memoizedState === null
    ? HooksDispatcherOnMount
    : HooksDispatcherOnUpdate
```

[You can find these code from here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L409)

So, when `FunctionComponent` `render`, it will looking for the `hook` from `ReactCurrentDispatcher.current`.

Different call stack context assgin different `dispatcher` to the `ReactCurrentDispatcher.current`, and when `FunctionComponent` `render`, the `hook` called is different.

> Besides these two `dispather`, [you can check the defination of other `dispatcher`.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1775)

## Scenario

When we got a wrong `hook`, like

```js
useEffect(() => {
  useState(0)
})
```

Right now, `ReactCurrentDispatcher.current` points to the `ContextOnlyDispatcher`, so actually, `useState` will call `throwInvalidHookError` to throw an error.

```js
export const ContextOnlyDispatcher: Dispatcher = {
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  // ...
```

[You can find the source code from here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L458)

## Data Structure of Hook

```js
const hook: Hook = {
  memoizedState: null,

  baseState: null,
  baseQueue: null,
  queue: null,

  next: null,
}
```

[You can find the source code of creating `hook` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L546)

Besides `memoizedState`, other properties are the same as the `updateQueue` we have talked in the last article.

## memoizedState

::: tip
Note: Both `hook` and `FunctionComponent fiber` have the `memoizedState` property.

- `fiber.memoizedState`: Saved `Hooks` chain table of the `FunctionComponent` corresponding `fiber`.
- `hook.memeoizedState`: Saved `hook` corresponding data in the `Hooks` chain table.
  :::

Differnet `hook`'s `memoizedState` save different type of data.

- useState: for `const [state, updateState] = useState(initialState)`, `memoizedState` save the value of `state`.
- useReducer: for `const [state, dispatch] = useReducer(reducer, {});`, `memoizedState` save the value of `state`.
- useEffect: `memoizedState` save the `effect` includings `useEffect callback function` and `dependencies`'s chain table data structure. [You can find the create process of the `effect`.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1181) `effect` chain table will save in the `fiber.updateQueue`.
- useRef: for `useRef(1)`, `memoizedState` save `{current: 1}`.
- useMEmo: for `useMemo(callback, [depA])`, `memoizedState` save `[callback(), depA]`.
- useCallback: for `useCallback(callback, [depA])`, `memoizedState` save `[callback, depA]`. Compare with `useMemo`, `useCallback` save the `callback` function itself, not the result of the `callback`.

Some `hook` does not have `memoizedState`, for example, `useContext`.
