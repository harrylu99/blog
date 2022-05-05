---
title: Fiber -- Implementation
date: 2022-04-15
---

## Foreword

[Here is a background article about Fiber from the React team Acdlite](https://github.com/acdlite/react-fiber-architecture)

`Reconciler` create virtual DOM recursively in React15 which cannot be paused. For solving this, `React` use the new `Fiber Architecture` since React16.

## Meaning of Fiber

`Fiber` has three layer meanings.

- As an architecture, `Reaconciler` was recursive in React15 and the states are stored in the recursive stack so we call it `stack Reconciler`. `Reconciler` in React16 is implement based on the `Fiber Node`, that is the reason why we named it `Fiber Reconciler`.

- As a static data structure, each `Fiber Node` corresponding a `React element`, which save the structure of the component and its DOM infos.

- As a dynamic work unit, each `Fiber Node` save the changes of the updating.

## Structure of Fiber

[You can check the definition of the Fiber from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117). We could group them by different meanings.

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode
) {
  // as the attribute of the static data structure
  this.tag = tag
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null

  // for connect with other Fiber node
  this.return = null
  this.child = null
  this.sibling = null
  this.index = 0

  this.ref = null

  // as the attribute of the dynamic work unit
  this.pendingProps = pendingProps
  this.memoizedProps = null
  this.updateQueue = null
  this.memoizedState = null
  this.dependencies = null

  this.mode = mode

  this.effectTag = NoEffect
  this.nextEffect = null

  this.firstEffect = null
  this.lastEffect = null

  // priority related
  this.lanes = NoLanes
  this.childLanes = NoLanes

  // corresponding fiber which needed in the update
  this.alternate = null
}
```

### As for Architecture

We know that each `Fiber Node` has its corresponding `React element`, so, how could mutilple `Fiber Node` connect as a tree? In fact, it depends on these attributes.

```js
// points to the father Fiber Node
this.return = null
// points to the child Fiber Node
this.child = null
// points to the first brother Fiber Node from the right
this.sibling = null
```

for example,

```js
function App() {
  return (
    <div>
      I am
      <span>Harry</span>
    </div>
  )
}
```

The Fiber Tree should be looks like

![Fiber Tree](../../images/fiber1.png)

### As for Static data structure

As a static data structure, it saves the infos about the component

```js
// Type of the compoent, such as Function/Class/Host...
this.tag = tag
// key attribute
this.key = key
// In some case, type might be different, for example, FunctionComponent wrapped by React.memo
this.elementType = null
// As for FunctionComponent, it means the function; as for ClassComponent, it means the class; As for HostComponent, it means the tagName of the DOM node
this.type = null
// Fiber corresponding the real DOM node
this.stateNode = null
```

### As for Dynamic work unit

As a dynamic unit of work, the following parameters in `Fiber` saved the information related to this update.

```js
// update related state infos
this.pendingProps = pendingProps
this.memoizedProps = null
this.updateQueue = null
this.memoizedState = null
this.dependencies = null

this.mode = mode

// update DOM opration infos
this.effectTag = NoEffect
this.nextEffect = null

this.firstEffect = null
this.lastEffect = null
```

The following two is about the priority of the `Scheduler`

```js
this.lanes = NoLanes
this.childLanes = NoLanes
```

## Summary

We learned about the origin and architecture of `Fiber` and `Fiber Nodes` can form a `Fiber tree`. So what is the relationship between the `Fiber tree` and the `DOM tree` and how does React update the DOM? We will talk about these in the next section.
