---
title: Render -- completeWork
date: 2022-04-11
---

## Foreword

We have talked about the `child Fiber node` will be created after component executed `beginWork`, and `effectTag` might exsiting in the node.

We will talk about `completeWork` in this section, [you can find the definition of `completeWork` from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L673)

## Process Overview

Similar to `beginWork`, `completeWork` also calls different processing logic for different `fiber.tag`.

```js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;

  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent: {
      // ...
      return null;
    }
    case HostRoot: {
      // ...
      updateHostContainer(workInProgress);
      return null;
    }
    case HostComponent: {
      // ...
      return null;
    }
  // ...
```

We focus on the page rendering of the necessary `HostComponent` (that is, the native `DOM components` corresponding to the `Fiber node`), the handling of other types of `Fiber` left in the implementation of specific functions to explain.

## HostComponent

As with `beginWork`, we determine whether it is a `mount` or an `update` based on `current === null ?`.

Also for `HostComponent`, when determining `update` we also need to consider `workInProgress.stateNode ! = null ?` (that is, whether the `Fiber node` exists corresponding `DOM node`)

```js
case HostComponent: {
  popHostContext(workInProgress);
  const rootContainerInstance = getRootHostContainer();
  const type = workInProgress.type;

  if (current !== null && workInProgress.stateNode != null) {
    // update
    // ...
  } else {
    // mount
    // ...
  }
  return null;
}
```

## update

When `update`, `Fiber node` already exist corresponding `DOM node`, so there is no need to generate `DOM node`. What we need to do is mainly to handle the `props`, such as

- Registration of callback functions such as `onClick`, `onChange`, etc.
- `style prop`
- `DANGEROUSLY_SET_INNER_HTML prop`
- `children prop`

We could remove some functions that do not need attention at the moment, like `ref`. You can see that the main logic is to call the `updateHostComponent` method.

```js
if (current !== null && workInProgress.stateNode != null) {
  // update
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```

[You can find the difination of `updateHostComponent` method here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L225)

In the `updateHostComponent`, the processed `props` are assigned to `workInProgress.updateQueue` and will be rendered on the page during the `commit` phase.

```js
workInProgress.updateQueue = (updatePayload: any);
```

Where `updatePayload` is in array form and the value of its even index is the changed `prop key`, and the value of the odd index is the changed `prop value`.

We will talk about the specific rendering process in the future section.

## mount

Again, we omitted the irrelevant logic. The main logic at mount time consists of three.

- Generating the corresponding `DOM node` for the `Fiber node`.
- Inserting the descendant `DOM node` into the newly generated `DOM node`.
- The process of handling `props` is similar to `updateHostComponent` in the `update` logic.

```js
// mount

// ...server-side rendering-related logic

const currentHostContext = getHostContext();
// create DOM node for fiber
const instance = createInstance(
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
    workInProgress,
  );
// bring the descendant DOM node to the exsiting DOM node
appendAllChildren(instance, workInProgress, false, false);
// sign DOM Node to fiber.stateNode
workInProgress.stateNode = instance;

// similar ti the process of updateHostComponent in update
if (
  finalizeInitialChildren(
    instance,
    type,
    newProps,
    rootContainerInstance,
    currentHostContext,
  )
) {
  markUpdate(workInProgress);
}
```

Remember what we said in the last section, when `mount`, only the `Placement effectTag` will exist in `rootFiber`, so how does the `commit` stage insert the whole `DOM tree` into the page in one time?

The reason lies in the `appendAllChildren` method in `completeWork`.

Since `completeWork` is a function called at the "return" stage, each time when `appendAllChildren` is called, the generated children `DOM node` will be inserted under the currently generated `DOM node`. So when "return" to `rootFiber`, we already have a built off-screen `DOM tree`.

## effectList

Most of the work in the `render` phase is now complete.

We do have one more question needs to be answer. As the basis of `DOM` operation, the `commit` phase needs to find all the `Fiber node` with `effectTag` and execute the corresponding `effectTag` operations in turn. Do we need to traverse the `Fiber tree` again in the `commit` phase to find the `Fiber node` with `effectTag ! == null`?

Obviously, this is very inefficient.

To solve this problem, in the upper-level function `completeUnitOfWork` of `completeWork`, each `Fiber node` that has finished executing `completeWork` and has an `effectTag` is saved in a one-way chain called `effectList`.

The first `Fiber node` in the `effectList` is stored in `fiber.firstEffect` and the last element is stored in `fiber.lastEffect`.

Similar to `appendAllChildren`, all `Fiber nodes` with `effectTag` are appended to the `effectList` in the "return" phase, resulting in a unidirectional chain starting from `rootFiber.firstEffect`.

```
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```

As the result, you can execute all the `effects` in the `commit` phase by just iterating through the `effectList`.

[You can see the logic of this code here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1744)

Dan Abramov offered an analogy for an effects list. He likes to think of it as a Christmas tree, with “Christmas lights” binding all effectful nodes together. 

## Conclusion

Now, the `render` phase is complete. The `fiberRootNode` in the `performStncWorkOnRoot` function is passed to the `commitRoot` method and start the `commit` ohase workflow.

```js
commitRoot(root);
```