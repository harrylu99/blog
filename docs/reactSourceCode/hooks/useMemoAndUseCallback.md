---
title: Hooks -- useMemo and useCallback
date: 2022-05-31
---

## Foreword

After we have learned about the implementation of other `hook`, it is very easy to understand the implementation of `useMemo` and `useCallback`.

In this article, we will discuss these two `hook` by different situation, includings `mount` and `update`.

## mount

```js
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null
): T {
  // create and return current hook
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  // calculate value
  const nextValue = nextCreate()
  // save the value and deps in hook.memoizedState
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // create and return current hook
  const hook = mountWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  // save the value and deps in hook.memoizedState
  hook.memoizedState = [callback, nextDeps]
  return callback
}
```

As we can see, the difference with `mountCallback` is

- `mountMemo` save the execution result of `callback function nextCreate` as `value`.
- `mountCallback` save the `callback function` as `value`.

## update

```js
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null
): T {
  // return current hook
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1]
      // judge if value changed before and after update
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // did not changed
        return prevState[0]
      }
    }
  }
  // changed, re-calculate the value
  const nextValue = nextCreate()
  hook.memoizedState = [nextValue, nextDeps]
  return nextValue
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  // return current hook
  const hook = updateWorkInProgressHook()
  const nextDeps = deps === undefined ? null : deps
  const prevState = hook.memoizedState

  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1]
      // judge if value changed before and after update
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // did not changed
        return prevState[0]
      }
    }
  }

  // changed, use the new callback as value
  hook.memoizedState = [callback, nextDeps]
  return callback
}
```

As the same as mount, the difference is use callback or the execution result of callback function as the value.

## Conclusion

We have now talked about `Hook` throughtout the source code and this is the end for the React source code topic. We might have some more section could be discussed in the future, so, stay tuned and please feel free to contact me if you have any question.
