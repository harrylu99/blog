---
title: New Architecture
date: 2022-03-03
---

## Foreword

We are going to talk about how does `React` support asynchronous updates in React 16.

## Architecture

There are three layers in React15, which are

- Scheduler -- In charge for rank the priority of the tasks. Make sure the task with high priority would enter Reconciler first.
- Reconciler -- Find the modified components.
- Renderer -- Render the modified components to the page.

You might find out that React16 has the brand new Scheduler compare with React15.

### Scheduler

As we talked in the previous article concept, we know that `React` use the remaining time of the browser to judge if the update finish or need to be paused. Therefore, we need the browser tell us if they still got time.

In fact, some browser have [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) for implement the requriment. However, React gave up using it based on

- Browser Compatibility.
- Trigger event is not stable. For example, the frequency of requestIdleCallback for triggering the former tab will decrease after we switch the tab in the browser.

Based on that, `React` has a more functional requestIdleCallback polyfill, which is _Scheduler_. Scheduler also provides mutiple settings for set the priority of the tasks.

[Scheduler is an independce package of React](https://github.com/facebook/react/tree/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler)

### Reconciler

Reconciler update the virtual DOM recursively in React 15. [Check it in React16](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)

From the code we know that the updating have changed to be pasued friendly. And each loop will call `shouldYield` for checking the remaining time.

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

And how React16 handle the problem when we paued the updating?

The answer is, in `React16`, Reconciler will give a tag to the changed DOM after Scheduler handle the tasks to Reconciler.

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

[You can find the complete file here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

The whole process of Scheduler and Reconciler are processing in the Memory, Renderer will receive them when the whole process is done.

[How React team explain the new Reconciler](https://reactjs.org/docs/codebase-overview.html#fiber-reconciler)

### Renderer

Renderer will do what they required to do, based on the tag with virtual DOM from Reconciler.

As a result, if you pause the updating in the React16, it would not show you the incomplete updates based on the Scheduler and the new Reconciler.

## Conclusion

From this article, we know that `React16` is using the new `Reconciler` which is `Fiber` architecture.

We will talk about what is `Fiber` and how does it related to `Reconciler` or `React` in the next.

## Reference

[Building a Custom React Renderer | Sophie Alpert](https://www.youtube.com/watch?v=CGpMlWVcHok&list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh&index=7)
