---
title: Commit -- Layout
date: 2022-05-01
---

## Foreword

This phase is called `layout` because the code in this phase is executed after the `DOM` rendering is completed (`mutation` phase is completed).

The lifecycle hooks and `hooks` triggered in this phase have direct access to the changed `DOM`. This phase is the phase that can participate in `DOM layout`.

Similar to the first two phases, the `layout` phase also traversal through the `effectList` and executes the functions.

The specific function to be executed is `commitLayoutEffects`.

```js
root.current = finishedWork

nextEffect = firstEffect
do {
  try {
    commitLayoutEffects(root, lanes)
  } catch (error) {
    invariant(nextEffect !== null, 'Should be working on an effect.')
    captureCommitPhaseError(nextEffect, error)
    nextEffect = nextEffect.nextEffect
  }
} while (nextEffect !== null)

nextEffect = null
```

## commitLayoutEffects

[You can check the source code of `commitLayoutEffects` from here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2302)

```js
function commitLayoutEffects(root: FiberRoot, committedLanes: Lanes) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag

    // call the lifecycle hook and hook
    if (effectTag & (Update | Callback)) {
      const current = nextEffect.alternate
      commitLayoutEffectOnFiber(root, current, nextEffect, committedLanes)
    }

    // ref
    if (effectTag & Ref) {
      commitAttachRef(nextEffect)
    }

    nextEffect = nextEffect.nextEffect
  }
}
```

`commitLayoutEffects` have done two things, includes

- commitLayoutEffectOnFiber(which use the lifecycle hook and hook)
- commitAttachRef

## commitLayoutEffectOnFiber

`commitLayoutEffectOnFiber` method will process by the different `fiber.tag`.

[You can check the source code of `commitLayoutEffectOnFiber` from here, notice that the origin name is `commitLifeCycles`](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L459).

- For `ClassComponent`, it will find out if its `mount` or `update` through `current === null?`, and call the `componentDidMount` or `componentDidUpdate`.

`This.setState`, which triggers a `state update`, will also be called at this point if it assigns a second parameter to the callback function.

```js
this.setState({ xxx: 1 }, () => {
  console.log('updating')
})
```

- As for `FunctionComponent` and related types, it will call the `callback function` of `useLayoutEffect hook`, schedule the `destory` and `callback` function of `useEffect`.

> Note: Related types in here, means the `FunctionComponent` which had been special processed, such as `ForwardRef`, `FunctionComponent` wrapped by `React.memo`.

```js

  switch (finishedWork.tag) {
    // unctionComponent and related types
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // execute useLayoutEffect callback
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
      // schedule destory and callback of useEffect
      schedulePassiveEffects(finishedWork);
      return;
    }
```

[You can find the complete source code from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L465-L491)

In the last section, we have talked about the `destory function` of `useLayoutEffect hook` will be executed during the `mutation` stage.

Combined here we can find that the `useLayoutEffect` hook is executed `synchronously` from the last update's `destroy function` call to this update's `callback function` call.

In contrast, `useEffect` needs to be dispatched first and then executed asynchronously after the `Layout phase` is completed.

This is the difference between `useLayoutEffect` and `useEffect`.

- For `HostRoot`, which as known as `rootFiber`, will be called if it gets the third parameter, `callback function`.

```jsx
ReactDOM.render(<App />, document.querySelector('#root'), function () {
  console.log('i am mount~')
})
```

## commitAttachRef

The second process in the `commitLayoutEffects` is `commitAttachRef`.

[You can check the source code of `commitAttachRef` here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L823)

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref
  if (ref !== null) {
    const instance = finishedWork.stateNode

    // get the instance of DOM.
    let instanceToUse
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance)
        break
      default:
        instanceToUse = instance
    }

    if (typeof ref === 'function') {
      // call the callback if ref is function.
      ref(instanceToUse)
    } else {
      // assign ref.current if ref is the instance of ref.
      ref.current = instanceToUse
    }
  }
}
```

To sum up, get the instace of the `DOM` and update `ref`.

## Switch between the current Fiber tree

At this point, the whole `layout` phase have been talked.

Before we end this section, let's focus on this line of code.

```js
root.current = finishedWork
```

In the previous section, we described that the `workInProgress Fiber tree` will change to the `current Fiber tree` after the `commit` phase finishes rendering. The purpose of this line of code is to switch the `current Fiber tree` pointed to by the `fiberRootNode`.

So why is this line of code here? (After the `mutation` phase ends and before the `layout` phase begins.)

We know that `componentWillUnmount` will be executed during the `mutation` phase. At this point the `current Fiber tree` is still pointing to the previous updated `Fiber tree` and the `DOM` fetched within the lifecycle hook is still the same as before the update.

`componentDidMount` and `componentDidUpdate` are executed at the `layout` stage. At this point, the `current Fiber tree` is already pointing to the updated `Fiber tree`, and the DOM fetched in the lifecycle hook is the updated one.
