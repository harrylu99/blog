---
title: State -- this.setState
date: 2022-04-27
---

## Workflow Overview

We could see `this.updater.enqueueSteState` method called in the `this.setState`

```js
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === "object" || typeof partialState === "function" || partialState == null)) {
    {
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    }
  }
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};
```

[You can find the source code here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactBaseClasses.js#L57)

`enqueueSetState` includings the workflow of `create update` and `schudle update`.

```js
enqueueSetState(inst, payload, callback) {
  // 通过组件实例获取对应fiber
  const fiber = getInstance(inst);

  const eventTime = requestEventTime();
  const suspenseConfig = requestCurrentSuspenseConfig();

  // get priority
  const lane = requestUpdateLane(fiber, suspenseConfig);

  // create update
  const update = createUpdate(eventTime, lane, suspenseConfig);

  update.payload = payload;

  // callbakc function
  if (callback !== undefined && callback !== null) {
    update.callback = callback;
  }

  // insert update to the updateQueue
  enqueueUpdate(fiber, update);
  // schedule update
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

[You can find the source code of `enqueueSetState` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L196)

For `ClassComponent`, `update.payload` is the first parameter of `this.setState`.

## this.forceUpdate

Now we are going to talk about `this.update`. Besides `enqueueSetState`, we will use `enqueueForceUpdate` when we call the `enqueueForceUpdate`.

We can see the logic is as same as `this.setState`, except that `update.tag = ForceUPdate;` and there is no `payload` here.

```js
enqueueForceUpdate(inst, callback) {
    const fiber = getInstance(inst);
    const eventTime = requestEventTime();
    const suspenseConfig = requestCurrentSuspenseConfig();
    const lane = requestUpdateLane(fiber, suspenseConfig);

    const update = createUpdate(eventTime, lane, suspenseConfig);

    // tag = ForceUpdate
    update.tag = ForceUpdate;

    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
};
```

[You can find the source code of `enqueueForceUpdate` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L260)

So, what does `update.tag = ForceUpdate` do?

When we judge if `ClassComponent` need to update, there are two conditions

```js
const shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(
    workInProgress, 
    ctor, 
    oldProps, 
    newProps, 
    oldState, 
    newState, 
    nextContext
 );
```

[You can check the source code from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L1137)

- chechHasForceUpdateAfterProcessing: check if the `Update` is the `ForceUpdate`. And if the `Update` has the `ForceUpdate` tag, return true.
- checkShouldComponentUpdate: `shouldComponentUpdate` will be called.When `ClassComponent` is `PureComponent`, will compare `state` and `props`.

[You can check the source code of `checkShouldComponentUpdate` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberClassComponent.old.js#L294)

As the result, if the `update` include the `ForceUpdate` tag, current `ClassComponent` will be updated.

## Summary

At this point, we have finished learning the update process for `Update` used by `HostRoot` or `ClassComponent`.

In the next section we will talk another data structure for `Update` - `Update` for `Hooks`.