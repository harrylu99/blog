---
title: State -- Update
date: 2022-04-24
---

## Foreword

We will talk about the structure and workflow of `Update` in this article.

> You can think `Update` as a `commit` in the `mental model`.

## Type of Update

We could group the `update` by the way how it trigger updates.

- ReactDOM.render -- HostRoot
- this.setState -- ClassComponent
- this.forceUpdate -- ClassComponent
- useState -- FunctionComponent
- useRender -- FunctionComponent

We could find these three type of components could trigger the update, includings `HostRoot`, `ClassComponent` and `FunctionComponent`.

Based on the different type of the component, `React` has two `Update` structure, `HostRoot` and `ClassComponent` share the same `Update` structure and `FucntionComponent` has another `Update` structure.

Even those two `Update` have different srructure, but their workflow are similar.

We will talk about the `Update` for `HostRoot` and `ClassComponent` in this ariticle, will dicuss about the `Update` of `FunctionComponent` in the future section `Hooks`.

## Structure of Update

`ClassComponent` and `HostRoot` share the same `Update structure`.

The corresponding structure looks like

```js
const update: Update<*> = {
  eventTime,
  lane,
  suspenseConfig,
  tag: UpdateState,
  payload: null,
  callback: null,

  next: null,
};
```

> `update` return by `createUpdate`, [you can check the source code of `createUpdate` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.old.js#L189)

- eventTime: time get by `performance.now()`. This will rebuild soon, so we do not need get deep into it.
- lane: the `priority` of the tasks.
- suspenseConfig: `Suspense` related.
- tag: types of update, includings `UpdateState`, `ReplaceState`, `ForceUpdate` and `CaptureUpdate`.
- payload: updated mount data, different type of components mount different data. As for `ClassComponent`, `payload` is the first parameter of `this.setState`. As for `HostRoot`, `payload` is the first parameter of `ReactDOM.render`.
- callback: the callback fucntion of the update. This is the `callback fucntion` we have mentioned in the previous article `commit - layout`.
- next: generate a chain with other `Update`.

## Connection between Update and Fiber

We find out there is a field `next` connect with other `Update` exsiting on the `Update`. Does it related with another `Fiber` in `React` ? The answer is yes.

From the previous section `Double Buffer`, we know that there are maximun of two `Fiber tree` existing in the page. One is the `current Fiber tree` and another is `workInProgress Fiber tree`. Just like how `Fiber Node` make up the `Fiber tree`, the multiple `Update` in the `Fiber treee` will be inclued in the `fiber.updateQueue`.

::: tip
You might think about why there could be multiple `Update` on a `Fiber node`.

Check this example

```js
onClick() {
  this.setState({
    a: 1
  })

  this.setState({
    b: 2
  })
}
```

`this.onClick` triggers in the first `ClassComponent` and `this.setState` called twice inside the funtion which means there are two `Update` happened in the `fiber`.
:::

There could be maximum two `updateQueue` exsiting on the `Fiber node`. Which are the `current updateQueue` saved by the `current fiber` and the `workInProgress updateQueue` which saved by the `workInProgress fiber`.

# updateQueue

There are three types of `updateQueue`, we have talked about the type used for `HostComponent` in thr previous `completeWork` article.

Other two types are corresponding of the `Update` types.

The structure of `UpdateQueue` for `ClassComponent` and `HostRoot` looks like

```js
const queue: UpdateQueue<State> = {
  baseState: fiber.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    pending: null,
  },
  effects: null,
};
```

> `UpdateQueue` return by `initializeUpdateQueue`, [You can check the source code of `initializeUpdateQueue` from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L157)

- baseState: the `state` of the before updated `Fiber node`, and `Update` calculate the new `state` based on this.

  > It looks like the `master` branch from the mental model.

- `firstBaseUpdate` and `lastBaseUpdate`: the `Update` saved before the `Fiber node` updated. It saved as a chain with the chain header named `firstBaseUpdate` and the end of the chian named `lastBaseUpdate`.

  The reason why we got some `Update` in the unupdated `Fiber node`, is because some of the `low priority Update` was skipped in the last time update.

  > `baseUpdate` like the `commit` of the `git rebase` from the mental model.

- shared.pending: When trigger the updates, `Update` will save in the `shared.pending` as an one-way cyclic chain table. This chain will be clipped and connected after `lastBaseUpdate` when the `Update` start caculating `state`.

- effects: save `Update` which is `update.callback !== null`.

## Demo

For example, there is a `fiber` just finshed `commit stage` and rendered.

There are two `Update` did not processed in the last `render` because of the `low priority`, they will be the `baseUpdate` of next turn updating.

We name these `u1` and `u2`, which `u1.next === u2`.

```js
fiber.updateQueue.firstBaseUpdate === u1;
fiber.updateQueue.lastBaseUpdate === u2;
u1.next === u2;
```

If we use `-->` presents the direction of the chain.

```
fiber.updateQueue.baseUpdate: u1 --> u2
```

If we trigger update twice on `fiber`, there will be two new `Update` created, we call them `u3` and `u4`.

Each `update` will insert to the `updateQueue` queue by `enqueneUpdate` method.

After inserting `u3`

```js
fiber.updateQueue.shared.pending === u3;
u3.next === u3;
```

the circle chain relationship of `shared,pending` looks like

```
fiber.updateQueue.shared.pending:   u3 ─────┐
                                     ^      |
                                     └──────┘
```

after insert `u4`

```js
fiber.updateQueue.shared.pending === u4;
u4.next === u3;
u3.next === u4;
```

the circle chain look like

```
fiber.updateQueue.shared.pending:   u4 ──> u3
                                     ^      |
                                     └──────┘
```

`shared.pending` will promise that it points to the last insert `update`, [You can check the source code of `enqueueUpdate` here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L208)

After update, it will goes to `render`.

Right now, the circle chain of `shared.pending` is clipped and joined behind the `updateQueue.lastBaseUpdate`.

```
fiber.updateQueue.baseUpdate: u1 --> u2 --> u3 --> u4
```

Following by traverse the `updateQueue.baseUpdate` chain table. Use `fiber,updateQueue.baseState` as the `initialization state`, traversal and caculate the the `state` created by each `Update`.

The `Update` with `low priority` will be skipped when traversalling.

> `update` of the `render` finished by `processUpdaetQueue`, [you can check the source code of the `processUpdateQueue` from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactUpdateQueue.new.js#L405)

The changes of the `state` will have different `JSX object` when it rendering, have `effectTag` by `Diff algorithem` and render on the page during `commit`.

After rendering, the `workInProgress Fiber tree` becomes `current Fiber tree` and that is the end of this updating process.
