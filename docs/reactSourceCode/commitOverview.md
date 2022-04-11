---
title: Commit Overview
date: 2022-04-08
---

## Foreword

In the last section, we have introduced the `commitRoot` method is the begining of the `commit stage` work. And `fiberRootNode` will be the parameter.

```js
commitRoot(root);
```

An one-way linked list `effectList` which needed to excute the side-effect `Fiber node` has stored in the `rootFiber.firstEffect`.

The `DOM` operations corresponding to these side effects are executed in the `commit` phase.

Besdies, some lifecycle hooks, for example `componentDidXXX`, hook, such as `useEffect`, need to be executed in the `commit` stage.

The main job of the `commit` stage, same as the workflow of the `Renderer` could be devided into three parts,

- before mutation stage, which before the DOM execution.
- mutation stage, when the DOM is executing.
- layout stage, after the DOM executed.

[You can check the complete code of the `commit` stage](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2001)

There are some extra work before the `before mutation` stage and after `commit` stage, inclues the trigger of `useEffect`, reset of the `priority` or binding of `ref`, etc.

For now, these should not be discussed in the `commit` section, so we are going to talk about these briefly in this section for the sake of content integrity.

## before `before mutation`

From the begining to the first `if (firstEffect !== null)` in the `commitRootImpl`

```js
do {
  // Triggers the useEffect callback with other synchronized tasks. Since these tasks may trigger new renders, iterate through the execution here until there are no more tasks.
  flushPassiveEffects();
} while (rootWithPendingPassiveEffects !== null);

// root means fiberRootNode.
// root.finishedWork means the current rootFiber.
const finishedWork = root.finishedWork;

// Any variable name with lane is priority related.
const lanes = root.finishedLanes;
if (finishedWork === null) {
  return null;
}
root.finishedWork = null;
root.finishedLanes = NoLanes;

// Reset the callback fucntion binding by the Scheduler.
root.callbackNode = null;
root.callbackId = NoLanes;

let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
// Reset the related variables of priority.
markRootFinished(root, remainingLanes);

// Clears completed discrete updates, e.g., updates triggered by user mouse clicks.
if (rootsWithPendingDiscreteUpdates !== null) {
  if (!hasDiscreteLanes(remainingLanes) && rootsWithPendingDiscreteUpdates.has(root)) {
    rootsWithPendingDiscreteUpdates.delete(root);
  }
}

// Reset global variables
if (root === workInProgressRoot) {
  workInProgressRoot = null;
  workInProgress = null;
  workInProgressRootRenderLanes = NoLanes;
} else {
}

// Assign effectList to firstEffect
// Since each fiber's effectList contains only its children's nodes
// So the root node with effectTag is not included.
// So the root node with effectTag is inserted at the end of the effectList.
// This ensures that all fibers with effects are in the effectList.
let firstEffect;
if (finishedWork.effectTag > PerformedWork) {
  if (finishedWork.lastEffect !== null) {
    finishedWork.lastEffect.nextEffect = finishedWork;
    firstEffect = finishedWork.firstEffect;
  } else {
    firstEffect = finishedWork;
  }
} else {
  // There is no effectTag in the root node.
  firstEffect = finishedWork.firstEffect;
}
```

As you can see, `before mutation`, we mainly do some variable assignment and state reset work.

We only need to focus on the last assignment of the `firstEffect`, which will be used in all three sub-stages of `commit`.

## After layout

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

// useEffect
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
} else {
}

// performance optimization
if (remainingLanes !== NoLanes) {
  if (enableSchedulerTracing) {
    // ...
  }
} else {
  // ...
}

// performance optimization
if (enableSchedulerTracing) {
  if (!rootDidHavePassiveEffects) {
    // ...
  }
}

// detection of infinite loop synchronization tasks
if (remainingLanes === SyncLane) {
  // ...
}

// ...called before leaving the commitRoot function to trigger a new dispatch and ensure that any additional tasks are dispatched
ensureRootIsScheduled(root, now());

// ...handle uncaught errors and legacy boundary issues from older versions

// Execute synchronized tasks so that they don't have to wait until the next event loop
// For example, updates created by executing setState in componentDidMount will be synchronized here
// or useLayoutEffect
flushSyncCallbackQueue();

return null;
```

[You can find the complete code from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2195)
