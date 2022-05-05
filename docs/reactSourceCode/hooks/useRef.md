---
title: Hooks -- useRef
date: 2022-05-29
---

## Foreword

`reference`, as known as `ref`. We are getting used to save `DOM` by using `ref` in `React`. In fact, every data needed to be referenced could save in `ref`.

We are going to focus on the implementation of `useRef` and the workflow of `ref`. Since the `string` type `ref` is not recommended, we will focus on the `function | {current: any}` type `ref`.

## useRef

Just like other `Hook`, `useRef` has two different `dispatcher` for `mount` and `update`.

```js
function mountRef<T>(initialValue: T): {| current: T |} {
  // get the current useRef hook
  const hook = mountWorkInProgressHook()
  // create ref
  const ref = { current: initialValue }
  hook.memoizedState = ref
  return ref
}

function updateRef<T>(initialValue: T): {| current: T |} {
  // get the current useRef hook
  const hook = updateWorkInProgressHook()
  // return the saved data
  return hook.memoizedState
}
```

[You can find the complete source code of this logic from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.old.js#L1208-L1221)

As you can see here, `useRef` return an `object` with `current` property.

## Workflow of `ref`

In `React`, `HostComponent`, `ClassComponent` and `ForwardRef` can assigned the `ref` property.

```jsx
// HostComponent
<div ref={domRef}></div>
// ClassComponent / ForwardRef
<App ref={cpnRef} />
```

`ForwardRef` use the `ref` as the second parameter for passing into the function, it will not get into the workflow of `ref`.

```js
let children = Component(props, secondArg)
```

[You can find the source code here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.old.js#L415)

We know that `HostComponent` is opearting `DOM` during the `commit stage`'s `mutation`.

Same as the update of the corresponding `ref`.

Furthermore, `effectTag` is the key for operating `DOM` during the `mutation stage`.

As the result, if `HostComponent` or `ClassComponent` have the opration of `ref`, it will assign the same value `effectTag`.

```js
// ...
export const Placement = /*                    */ 0b0000000000000010
export const Update = /*                       */ 0b0000000000000100
export const Deletion = /*                     */ 0b0000000000001000
export const Ref = /*                          */ 0b0000000010000000
// ...
```

In conclusion, the workflow of `ref` could be described as:

- `render` stage, adding `RefeffectTag` to the `fiber` which has the `ref` property.
- `commit` stage, executing corresponding operation for `fiber` those have `Ref effectTag`.

## render Stage

There is a method `markRef` in both `beginWork` and `completeWork` during the `render` stage, it is used to add `Ref effectTag` for these `fiber` which has the `ref` property.

```js
// markRef of beginWork
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref
  if (
    (current === null && ref !== null) ||
    (current !== null && current.ref !== ref)
  ) {
    // Schedule a Ref effect
    workInProgress.effectTag |= Ref
  }
}
// markRef of completeWork
function markRef(workInProgress: Fiber) {
  workInProgress.effectTag |= Ref
}
```

[You can find the `markRef` of `beginWork` here,](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.old.js#L693)[and the `markRef` of `completeWork` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCompleteWork.old.js#L153)

`markRef` called in `beginWork`

- `finishClassComponent` of `updateClassComponent`, which is the `ClassComponent`. Note that `markRef` will be called even`shouldComponentUPdate` is `false` in `ClassComponent`.
- `updateHostComponent`, which is the `HostComponent`.

In the `completeWork`, `markRef` will be called in these

- `HostComponent` type of `completeWork`
- `ScopeComponent` type of `completeWork`

In conclusion, corresponding `fiber` of the `component` assinged `Ref effectTag` needed meet the following conditions:

- the type of `fiber` is `HostComponent`, `ClassComponent` or `ScopeComponent`。
- for `mount`, `workInProgress.ref !== null`, which means `ref` attribute existing.
- for `update`, `current.ref !== workInProgress.ref`, which means the `ref` attribute has been changed.

## commit Stage

In the `mutation` stage of the `commit` stage, `ref` needed to be removed when the `ref` attribute is changed.

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;
    // ...

    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        // remove the old ref
        commitDetachRef(current);
      }
    }
    // ...
  }
  // ...
```

[You can find the source code here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2342)

```js
function commitDetachRef(current: Fiber) {
  const currentRef = current.ref
  if (currentRef !== null) {
    if (typeof currentRef === 'function') {
      // function type ref，parameter is null
      currentRef(null)
    } else {
      // object type ref，current assign as null
      currentRef.current = null
    }
  }
}
```

Next, during the `mutation` stage, for the `fiber` of the `Deletion effectTag`, the child tree need to be traversed and executing the similar `commitDetachRef` for the `ref` of the descendant fiber.

From the previous `mutation` section, we know that `commitDeletion` will be executed for `Eletion effectTag`'s `fiber`.

For `commitDeletion`, `unmountHostComponents`, `commitUnmount`, `ClassComponent | HostComponent` type, the `safelyDetachRef` method in charge of executing the opration similar to `commitDetachRef`.

```js
function safelyDetachRef(current: Fiber) {
  const ref = current.ref
  if (ref !== null) {
    if (typeof ref === 'function') {
      try {
        ref(null)
      } catch (refError) {
        captureCommitPhaseError(current, refError)
      }
    } else {
      ref.current = null
    }
  }
}
```

[You can find the source code here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L183)

Next, we are get into the assign stage of the `ref`.

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref
  if (ref !== null) {
    // get the corresponding Component instance of the ref
    const instance = finishedWork.stateNode
    let instanceToUse
    switch (finishedWork.tag) {
      case HostComponent:
        instanceToUse = getPublicInstance(instance)
        break
      default:
        instanceToUse = instance
    }

    // assign ref
    if (typeof ref === 'function') {
      ref(instanceToUse)
    } else {
      ref.current = instanceToUse
    }
  }
}
```

We have know the workflow of `ref` now.
