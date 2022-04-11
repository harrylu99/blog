---
title: Commit -- Before Mutation
date: 2022-04-09
---

## Foreword

The code for the `before mutation` phase is very short, the whole process is to traversal through the `effectList` and call the `commitBeforeMutationEffects` function to process it.

[You can find the complete source code from here, we have deleted some unrelated logic for better understanding.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2104-L2127)

```js
// Save the previous priority, execute at synchronous priority, and restore the previous priority when execution is complete
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// Mark the current context as CommitContext, as a flag for the commit phase
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// Handle the focus state
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// The main function of the beforeMutation phase
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;
```

We will focus on the main fucntion `commitBeforeMutationEffects` from the `beforeMutation`.

## commitBeforeMutationEffects

We could start talking about it with the code

```js
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur
    }

    const effectTag = nextEffect.effectTag;

    // call getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // schedule useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

We could divide into three parts.

- Deal with the `autoFocus`, `blur` logic after `DOM node` rendered or deleted.
- Call the lefecycle hooks of `getSnapshotBeforeUpdate`.
- Schedule `useEffect`.

We will discuss the last two parts.

## Call getSnapshotBeforeUpdate

`commitBeforeMutationEffectOnFiber`, is also known as `commitBeforeMutationLifeCycles`.

[`getSnapshotBeforeUpdate` will be call in the method.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L222)

Since React v16, the `UNSAFE_ prefix` has been added before the `componentWillXXX` hook.

The reason of it is because after the `Stack Reconciler` is refactored to `Fiber Reconciler`, the tasks in the `render` phase may be interrupted or restarted, and the corresponding component's lifecycle hook (i.e. `componentWillXXX`) in the `render` phase may be triggered multiple times.

This behaviour is different with React v15, so we add `UNSAFE_` to mark it.

For solve this problem, `React` provides the alternative lifecycle hook `getSnapshotBeforeUpdate`.

We can see that `getSnapshotBeforeUpdate` is called in the `before mutation` phase within the `commit` phase, and because the commit phase is `synchronized`, the multiple calls problem will be sloved.

## Schedule `useEffect`

Within these lines of code, the `scheduleCallback` method is provided by the `Scheduler` module to asynchronously schedule a callback function at a certain priority.

```js
// schedule useEffect
if ((effectTag & Passive) !== NoEffect) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => {
      // trigger useEffect
      flushPassiveEffects();
      return null;
    });
  }
}
```

We could find out that the callback function that is dispatched asynchronously is the method `flushPassiveEffects` that triggers `useEffect`.

We will discuss how `useEffects` are dispatched asynchronously rather than synchronously and why they are dispatched asynchronously.

### How to dispatch asynchronously

Inside the `flushPassiveEffects` method, the `effectList` is obtained from the global variable `rootWithPendingPassiveEffects`.

From the previous section, we have talked about `effectList` store the `Fiber node` which need execute the side effect, includes

- Placement
- Update
- Deletion

Except these, the corresponding `Fiber node` of a `FunctionCopoment` will be assign the value `effectTag` when it has `useEffect` or `useLayoutEffect`.

[You can check the effectTag here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactHookEffectTags.js)

In the `flushPassiveEffects` method, it traversal through the `rootWithPendingPassiveEffects` (i.e. `effectList`) to execute the `effect` callback function.

If executed directly at this point, `rootWithPendingPassiveEffects === null`.

So when will `rootWithPendingPassiveEffects` be assigned a value?

The code snippet after the `layout` in the previous section will decide whether to assign `rootWithPendingPassiveEffects` based on `rootDoesHavePassiveEffects === true?`

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
}
```

So, the whole `useEffect` asynchronous call is divided into three steps

- `before mutation` stage, schedule `flushPassiveEffects` in `scheduleCallback`.
- assign `effectList` to `rootWithPendingPassiveEffects` after `layout`.
- `scheduleCallback` triggers `flushPassiveEffects`, traversal `rootWithPendingPassiveEffects` within `flushPassiveEffects`.

### Why do we need asynchronous

> Unlike `componentDidMount` and `componentDidUpdate`, the function passed to `useEffect` fires **after** layout and paint, during a deferred event. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen.

As you can see, the reason for asynchronous execution of `useEffect` is to prevent synchronous execution from blocking browser rendering.
