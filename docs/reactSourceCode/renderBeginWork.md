---
title: render beginWork
date: 2022-04-06
---

## Foreword

In the previous section, we learned that the render phase has two phases. In this section, we'll look at what the `beginWork` method does.

## Method Overview

[You can find the defination of `beginWork` though the source code](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3075)

From the previous section we already know that the job of `beginWork` is to pass in the `current Fiber node` and create `child Fiber node`, let's see exactly how to do it from passing in the parameters.

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...
}
```

Including these parameters

- `current`, the `Fiber node` corresponding to the current component at the last update, i.e. `workInProgress.alternate`.
- `workInProgress`, the `Fiber node` corresponding to the current component.
- `renderLanes`, prioritization related, we will talk about it when we talking about `Scheduler`. 

From the previous section `double buffer`, we know that except the `rootFiber`, when a component is `mount`, because it is rendered for the first time, there is no `Fiber node` corresponding to the current component at the last update, as the reslut, `current === null` when it is `mount`.

When the component is `update`, `current !== null` since it has been `mount`.

Sowe could know the component is `mount` or `update` by judge `current === null ?`.

Based on that, we could devided `beginWork` into two parts.

- `update`, if `current` exists, you can reuse `current node` when certain conditions are met, so that you can clone `current.child` as `workInProgress.child` instead of creating new `workInProgress.child`.



- `mount`, except for `fiberRootNode`, `current === null`. different types of `child Fiber node` will be created depending on `fiber.tag`.

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {

  // update
  if (current !== null) {

    // reuse current
    return bailoutOnAlreadyFinishedWork(
      current,
      workInProgress,
      renderLanes,
    );
  } else {
    didReceiveUpdate = false;
  }

  // mount
switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...
    case LazyComponent: 
      // ...
    case FunctionComponent: 
      // ...
    case ClassComponent: 
      // ...
    case HostRoot:
      // ...
    case HostComponent:
      // ...
    case HostText:
      // ...
    // ...
  }
}
```

## update

We can find out that when `didReceiveUpdate === false`, which means the `child Fiber` could be reuse and do not need to create the new `child Fiber`.

- `oldProps === newProps && workInProgress.type === current.type`, which means `props` and `fiber.type` do not changed.
- `!includesSomeLane(renderLanes, updateLanes)`, which means the priority of the current `Fiber node` does not meet the priority requirement. We will discuss more when we talking about `Scheduler`.

```js
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        //...
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }
```

## mount 

When the optimization path is not satisfied, we move to the second part, the creation of new `child Fiber`.

We can see the logic to enter the creation of different types of `Fiber` depending on the `fiber.tag`.

[you can see the component type corresponding to the tag](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactWorkTags.js)

```js
switch (workInProgress.tag) {
  case IndeterminateComponent: 
    // ...
  case LazyComponent: 
    // ...
  case FunctionComponent: 
    // ...
  case ClassComponent: 
    // ...
  case HostRoot:
    // ...
  case HostComponent:
    // ...
  case HostText:
    // ...
  // ...
}
```

For some common component types, such as `FunctionComponent`, `ClassComponent` or `HostComponent`, they will enter the [`reconcilerChildren`](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L233) method.

## reconcilerChildren

We could find out that this is the core part of the Reconciler through the name of the function. Let us explore it.

- For `mount` component, it will create new `child Fiber node`.
- For `update` compoennt, it will compare the current component with the `Fiber node` corresponding to the component at the last update (also known as `Diff` algorithm), and generate a new `Fiber node` as a result of the comparison.

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // for mount
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    // for update
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

As you can see from the code, same as `beginWork`, it also uses `current === null ?` to judge the `mount` or `update`.

Regardless of the logic, it will eventually generate a new child `Fiber node` and assign it to `workInProgress.child`, which will be used as the [`return value of the beginWork`](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L1158) and [as a `reference` to `workInProgress` in the next `performUnitOfWork` execution](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1702).

::: tip
Mentioning that, the logic of both methods, `mountChildFibers` and `reconcileChildFibers`, is basically the same. The only difference is that `reconcileChildFibers` takes the `effectTag` attribute for the generated `Fiber node`, while `mountChildFibers` does not.
:::

## effectTag

As we know, the `render` phase works in memory, and when the work is finished the `Renderer` is notified of the `DOM` operations that need to be performed. The specific type of `DOM` operation to be performed is stored in `fiber.effectTag`.

[You can see the DOM operations corresponding to the effectTag from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

For example,

```js
// insert DOM
export const Placement = /*                */ 0b00000000000010;
// DOM required update
export const Update = /*                   */ 0b00000000000100;
// insert DOM and required update
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// delete DOM
export const Deletion = /*                 */ 0b00000000001000;
```

The binary representation of the `effectTag` makes it easy to assign multiple `effects` to `fiber.effectTag` using bit manipulation.

For notifing the `Renderer` to insert the `DOM node` corresponding to the `Fiber node` into the page, two conditions need to be satisfied.

1. `fiber.stateNode` exists, which means the `corresponding DOM node` is saved in the `Fiber node`.

2. `(fiber.effectTag & Placement) ! == 0`, that is, the `Fiber node` exists `Placement effectTag`.

We know that when `mount`, `fiber.stateNode === null`, and the `mountChildFibers` called in `reconcileChildren` will not assign `effectTag` to the Fiber node. So how is the first screen rendering done?

To answer the first question, `fiber.stateNode` is created in `completeWork`, which we will cover in the next section.

The answer to the second question is very clever. Assuming that `mountChildFibers` will also assign `effectTag`, then it is foreseen that all nodes in the whole `Fiber tree` will have `Placement effectTag` at the time of `mount`, then each node will perform an insertion operation during the `commit` phase when performing `DOM` operations, so a large number of `DOM` operations is extremely inefficient.

In order to solve this problem, only the `rootFiber` will be assigned the `Placement effectTag` at the time of `mount`, and only one insertion operation will be performed at the `commit` stage.