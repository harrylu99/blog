---
title: Hooks -- useState and useReducer
date: 2022-05-01
---

## Foreword

After `Dan`(who created `Redux`) joined the `React` core team, he bring the concept of `Redux` to the `React` core team.

Specifically, `useState` and `useReducer` are introduced in the `React` core team.

We will focus on these two `hooks` in this article.

## Workflow Overview

We can sperate the workflow of these two `hooks` into two stage,

```js
function App() {
  const [state, dispatch] = useReducer(reducer, { a: 1 });

  const [num, updateNum] = useState(0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "a" })}>{state.a}</button>
      <button onClick={() => updateNum((num) => num + 1)}>{num}</button>
    </div>
  );
}
```

`Declaration stage`, when `App` called, `useRenducer` and `useState` will be executed.
`Calling stage`, after cliked the button, `dispatch` or `updateNum` will be executed.

## Declaration Stage

When `FunctionComponent` get into the `beginWork` of the `render stage`, `renderWithHooks` will be called. [You can check the source code of `renderWithHooks` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1419)

The corresponding function of `FuncitonComponent` will be called.

[You can check the complete source code here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L415)

For these two `Hook`, their code looks like

```js
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

As we talked in the last aritle, same `Hook` might call different function for processing under different senario.

### mount

When `mount`, `useReducer` will call `mountReducer` and `useState` will call `mountState`.

[You can find the source code of `mountReducer` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L638)
[You can find the source code of `mountState` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1143)

```js
function mountState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>] {
  // create and return current hook
  const hook = mountWorkInProgressHook();

  // ...assign the initial state value

  // create queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState: any),
  });

  // ...create dispatch
  return [hook.memoizedState, dispatch];
}

function mountReducer<S, I, A>(reducer: (S, A) => S, initialArg: I, init?: (I) => S): [S, Dispatch<A>] {
  // create and return current hook
  const hook = mountWorkInProgressHook();

  // ...assign the initial state value

  // create queue
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: (initialState: any),
  });

  // ...create dispatch
  return [hook.memoizedState, dispatch];
}
```

The `mountWorkInProgreddHook` method will create and return the corresponding `hook`, correspond the `isMount` of the `useState` method.

As we can see here, the different between these `Hook` when `mount`, is the `lastRenderedReducer` field of the `queue` parameter.

The data structure of `queue` is

```js
{
  pending: null,
  // save the value of dispatchAction.bind()
  dispatch: null,
  // last render reducer
  lastRenderedReducer: reducer,
  // last render state
  lastRenderedState: (initialState: any),
}
```

`lastRenderedReducer` is the `reducer` parameter of `useReducer` method. `basicStateReducer` is the parameter of `lastRenderedReducer`.

The `basicStateReducer` method is

```js
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === "function" ? action(state) : action;
}
```

So, the parameter of `useState` is the `useReducer` of `basicStateReducer`.

### update

When `update`, `useReducer` and `useState` call the same fucntion `updateReducer`.

[You can check the source code of `updateReducer` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L665)

```js
function updateReducer<S, I, A>(reducer: (S, A) => S, initialArg: I, init?: (I) => S): [S, Dispatch<A>] {
  // get the current hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  // ...

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

To sum up the whole process, the process is finding the corresponding `hook`, caculate the new `state` of the `hook` by `update` and return it.

When `mount`, current `hook` use the `mountWorkInProgressHook`, and when `update`, current `hook` use the `updateWorkInProgressHook`. The reson is

- when `mount`, we can know the `Update` is from calling `ReactDOM.render` or initializing the `API`, it could only execute once.
- when `update`, the `Update` could be triggered by the event callback function or side effect, or during the `render` stage. For avoiding infinite loop, we need to separate the senario.

Given a example of trigger `Update` in the `render` stage.

```js
function App() {
  const [num, updateNum] = useState(0);

  updateNum(num + 1);

  return <button onClick={() => updateNum((num) => num + 1)}>{num}</button>;
}
```

From the above example, when `App` called, which means `renderWithHooks` been executed and have already into the `redner` stage.

In the `App`, calling `updateNum` will trigger an `Update`. If we do not limit the update under this situation, it will cause an infinite loop.

Based on that, `React` use a mark variable `didScheduleRenderPhaseUpdate` to judge if the `Update` is from `render` stage.

`updateWorkInProgresshook` method will identify the situation for getting corresponding `hook`.

After get the corresponding `hook`, `state` will be recauculated by the saved `state` in `hook`, as the same as `Update`.

## Calling Stage

During the calling stage, `dispatch` will be executed. In this time, corresponding `fiber` of `FunctionComponent` and `hook.queue` have been pre-passed as a parameter by calling the `bind` method.

[You can check he `dispatchAction` source code here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1662)

```js
function dispatchAction(fiber, queue, action) {
  // ...create update
  var update = {
    eventTime: eventTime,
    lane: lane,
    suspenseConfig: suspenseConfig,
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  };

  // ...add update to queue.pending

  var alternate = fiber.alternate;

  if (fiber === currentlyRenderingFiber$1 || (alternate !== null && alternate === currentlyRenderingFiber$1)) {
    // updates trigger in the render stage
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
  } else {
    if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
      // ...updateQueue of fiber is null
    }

    scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}
```

The whole process is, create `update`, adding `update` to the `queue.pending` and start shceduling.

Note the `if...else...` logic here,

```js
if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1)
```

`currentlyRenderingFiber`, which is the `workInProgress` here and that means it is in the `render` stage.

The update is triggered by `bind` the pre-saved `fiber` with `workInProgress` all equal, representing that this `update` occurs in the `render` phase of the corresponding `fiber` of the `FunctionComponent`.

As the result, it is an `Update` triggered during the `render` stage, variable `didScheduleRenderPhaseUpdate` needed marked.

```js
if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes))
```

`fiber.lanes` saving the `priority` of the `fiber`'s `update`.

`fiber.lanes === NoLanes` means there is no `update` in the `fiber`.

So far, we have know the claculating `state` by `update` happen in the `declaration stage`. The reason is that there could be multiple `update` with different `priority` existing in the `hook`. The value of `state` decided by multiple `update`.

When there is no `update` in t he `fiber`, the `update` created during the `declaration stage` is the last `update`. And that is the only dependency of the `state` during the `declaration stage`.

The good side of it is, if the `state` calculated here is as the same as the saved `state`, we do not need another schedule. Even if they are different, the `state` calulated in the `calling stage` could be used in the `declaration stage`.

[You can find the source code of calculate `state` here.](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1727)
