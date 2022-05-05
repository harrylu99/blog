---
title: State -- Overview
date: 2022-04-22
---

## Key Nodes

Before we jump into this section, we could start to know the key nodes from the source code, those calls of the key function.

- Begining of the render stage

  As we talked in the previous `render` stage, we know that `render stage` start with the `performSyncWorkOnRoot` or `performConcurrentWorkOnRoot` based on the type of the update.

- Begining of the commit stage

  `commit` stage start with the `commitRoot` method. by using `rootFiber` as the parameter. We already know that after `render`, it will go to the `commit` stage, the path from `trigger update` to `render` should be look like

  ```
    trigger state update
        |
        |
        v

        ？

        |
        |
        v

    render（`performSyncWorkOnRoot` or `performConcurrentWorkOnRoot`）

        |
        |
        v

    commit（`commitRoot`）
  ```

- create update object

  In `React`, events could trigger state update including

  - ReactDOM.render
  - this.setState
  - this.forceUpdate
  - useState
  - useReducer

  How could these events use the same state update method?

  The answer is, everytime when `state update`, an object which save the updateing related infos will be created, we named it `Update`. In the `beginWork` of the `render`, `state` will be recaculated based on the `Update`. We will dicuss `Update` in the following chapter.

- from fiber to root

  Now we know that the `fiber which trigger state update` includes `Update` object.

  `render` stage start traversal from the top of `rootFiber`. The question is how could we get `rootFiber` from the `fiber which trigger state update`.

  I can tell you that we use `markUpdateLaneFromFiberToRoot` method for implement it. [You can check the source code of `markUpdateLaneFromFiberToRoot` from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L636)

  The work have done here could be summarized as, traversal from the `fiber` to the `rootFiber` and return `rootFiber`.

- update schedule
  
  Now, we have a `rootFiber` and the corresponding `Fiber tree` includes a `Fiber node` which has an `Update`.

  Then, `Scheduler` will decided if the update `synchronous` or `asynchronous` based on the priority of the `Upadte`.

  `ensureRootIsScheduled` is the method used here. Here is the core part of the `ensureRootIsScheduled` method.

  ```js
    if (newCallbackPriority === SyncLanePriority) {
    // task expired，render synchronous.
    newCallbackNode = scheduleSyncCallback(
        performSyncWorkOnRoot.bind(null, root)
        );
    } else {
    // render based on the priority of the task asynchronous
    var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
        newCallbackPriority
    );
    newCallbackNode = scheduleCallback(
        schedulerPriorityLevel,
        performConcurrentWorkOnRoot.bind(null, root)
    );
    }
  ```
  [You can check the `ensureRootIsScheduled` source code from here.](https://github.com/facebook/react/blob/b6df4417c79c11cfb44f965fab55b573882b1d54/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L602)

  Besides, both `scheduleCallback` and `scheduleSyncCallback` will executed by the `priority` by using the method provided by `Scheduler`. We can find the callback function here is

  ```js
    performSyncWorkOnRoot.bind(null, root);
    performConcurrentWorkOnRoot.bind(null, root);
  ```

  This is the entry point of the `render`.

## Conclusion

Let's summary the whole path of the `state update`.

```sh
trigger state updates

    |
    |
    v

create Update object

    |
    |
    v

from fiber to root (`markUpdateLaneFromFiberToRoot`)

    |
    |
    v

update schedule (`ensureRootIsScheduled`)
    |
    |
    v

render (`performSyncWorkOnRoot`) or (`performConcurrentWorkOnRoot`)

    |
    |
    v

commit (`commitRoot`)
```

We will discuss how `Update` work in `React` in the following article.
