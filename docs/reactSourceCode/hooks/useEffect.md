---
title: Hooks -- useEffect
date: 2022-05-27
---

## Foreword

We have talked about the workflow of the `useEffect` in the previous chapter, `commit`.

> Inside the `flushPassiveEffects` method, the `effectList` is obtained from the global variable `rootWithPendingPassiveEffects`.

In this aritcle, we will get in deep detail about the `useEffect` inside the `flushPassiveEffects`.

## flushPassiveEffectsImpl

`priority` will be setted in the `flushPassiveEffects` method and `flushPassiveEffectsImpl` will be executed.

[You can find the source code of `flushPassiveEffects` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2458)

`flushPassiveEffectsImpl` will focus on these processes:

- call the destroy function of the `useEffect` in the last `render`.
- call the callback function of the `useEffect` in current `render`.
- If there is a synchronous task, do not wait for the next event `loop macro task`, execute it in advance.

We will focus on the first two steps.

## Stage One: Execution of the Destroy Function

Execution of `useEffect` needs to makes sure the `destroy function` of the `useEffect` is called before execute the `callback function` of the `useEffect`.

The reason is that these `component` might share the same `ref`.

If it does not follow the order of destroy all and then execute all, changing the `ref.current` in the `destroy function` of component's `useEffect` will affect the `current` property of the same `ref` in the `callback function` of another component `useEffect`.

The same problem exists in the `useLayoutEffect`, so they both follow the destroy all and then execute all order.

In stage one, all the `destroy function` of the `useEffect` are traversed and executed.

```js
// save the useEffect which needed destoryed in pendingPassiveHookEffectsUnmount
const unmountEffects = pendingPassiveHookEffectsUnmount
pendingPassiveHookEffectsUnmount = []
for (let i = 0; i < unmountEffects.length; i += 2) {
  const effect = ((unmountEffects[i]: any): HookEffect)
  const fiber = ((unmountEffects[i + 1]: any): Fiber)
  const destroy = effect.destroy
  effect.destroy = undefined

  if (typeof destroy === 'function') {
    // execute if the destroy function existing
    try {
      destroy()
    } catch (error) {
      captureCommitPhaseError(fiber, error)
    }
  }
}
```

The index `i` of the `pendingPaddiveHookEffectsUnmount` saves the `effect` which needs to be destroyed. `i+1` saves the corresponding `fiber` of the `effect`.

`push` data into `pendingPassiveHookEffectsUnmount` is done in the `commitLayoutffects`'s `schedulePassiveEffects` method during `layout`.

```js
function schedulePassiveEffects(finishedWork: Fiber) {
  const updateQueue: FunctionComponentUpdateQueue | null =
    (finishedWork.updateQueue: any)
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next
    let effect = firstEffect
    do {
      const { next, tag } = effect
      if (
        (tag & HookPassive) !== NoHookEffect &&
        (tag & HookHasEffect) !== NoHookEffect
      ) {
        // push effect needed destoryed to pendingPassiveHookEffectsUnmount
        enqueuePendingPassiveHookEffectUnmount(finishedWork, effect)
        // push effect needed callbacked to pendingPassiveHookEffectsMount
        enqueuePendingPassiveHookEffectMount(finishedWork, effect)
      }
      effect = next
    } while (effect !== firstEffect)
  }
}
```

## Stage Two: Execution of the Callback Function

Same as the stage one, traversal the array and execute corresponding `callback function` of the `effect`.

The operation of `push` data to `pendingPassiveHookEffectsMount` is done in the `schedulePassiveEffects`.

```js
// save the useEffect which needed callback in pendingPassiveHookEffectsMount
const mountEffects = pendingPassiveHookEffectsMount
pendingPassiveHookEffectsMount = []
for (let i = 0; i < mountEffects.length; i += 2) {
  const effect = ((mountEffects[i]: any): HookEffect)
  const fiber = ((mountEffects[i + 1]: any): Fiber)

  try {
    const create = effect.create
    effect.destroy = create()
  } catch (error) {
    captureCommitPhaseError(fiber, error)
  }
}
```
