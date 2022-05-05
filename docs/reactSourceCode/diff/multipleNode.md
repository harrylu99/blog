---
title: Diff -- Multiple Node
date: 2022-04-20
---

## Foreword

We have talked about the single node `Diff`, now, consider we have a `FunctionComponent` which looks like

```jsx
function List() {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  );
}
```

The `children` attribute of the return `JSX object` value is not the single node, it is an array which inclues four objects.

```js
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

In this case, the parameter type of `reconcileChildFibers`'s `newChild` is `Array`, which mean inside the `reconcileChildFibers` should be like

[You can check the soure code from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1352)

```js
if (isArray(newChild)) {
  // call reconcileChildrenArray
  // ...
}
```

In this chapter, we will focus on how `React` deal with multiple node `Diff`.

## Overview

At the beginning, we are going to summarize the cases we need to deal with.

We use **before** to represent the JSX object before the update and **after** to represent the JSX object after the update.

- **1. Node update**

```jsx
// Before
<ul>
  <li key="0" className="before">0</li>
  <li key="1">1</li>
</ul>

// After situation one —— node attribute change
<ul>
  <li key="0" className="after">0</li>
  <li key="1">1</li>
</ul>

// After situation two —— node type update
<ul>
  <div key="0">0</div>
  <li key="1">1</li>
</ul>
```

- **2. Node add or subtract**

```jsx
// Before
<ul>
  <li key="0">0</li>
  <li key="1">1</li>
</ul>

// After situation one —— add new node
<ul>
  <li key="0">0</li>
  <li key="1">1</li>
  <li key="2">2</li>
</ul>

// After situation two —— subtract a node
<ul>
  <li key="1">1</li>
</ul>
```

- **3. Node position change**

```jsx
// Before
<ul>
  <li key="0">0</li>
  <li key="1">1</li>
</ul>

// After
<ul>
  <li key="1">1</li>
  <li key="0">0</li>
</ul>
```

As for mutiple node `Diff`, it must belongs to at least one case shown above.

## Design a `Diff` Algorithm

How to desgin an algorithm? My plan for the `Diff` should be look like

1. Judge the type of update
2. `Add` if it is an add update
3. `Delete` if it is a delete update
4. `Update` if it is an update update

For implement this plan, we have to make sure that the priority between different operation should be the same.

In fact, `React` team has found out that the frequency of `update` component is higher than the `add` or `delete` in the daily development. As the result, `Diff` algorithm will check if the current node belongs to `update`.

::: tip
We usually use **two pointers** to traverse an array from the beginning and end at the same time when we do array-related algorithm problems, to improve efficiency, but it is not working here.

Although this updated `JSX object` `newChildren` is an array, but each component in `newChildren` is compared with the `current fiber`, the same level of `Fiber node` are linked by `sibling` pointers to form a single chain, that is, does not support two pointers traversal.

That is, `newChildren[0]` is compared with `fiber`, and `newChildren[1]` is compared with `fiber.sibling`.

So it is not possible to use **two pointers** optimization.
:::

Based on the reason, `Diff` algorithm will have two round traversal, the first round it will deal with the `update` node, and it will process with the rest in the second round.

## First Round Traversal

The steps of the first round traversal should be

1. `let i = 0`, traversal the `newChildren` and compare the `newChildren[i]` with `oldFiber`, to judge if the `DOM node` could be reused.
2. If it could be reused, `i++` and compare `newChildren[i]` with `oldFiber.sibling`, if it still could be reused, keep traversaling.
3. If it cannot be reused,
   - different `key`, end the first round immediately.
   - same `key` but different `type`, the `oldFiber` will be marked `DELETION` and keep traversal.
4. After the end of `newChildren` traversal or `oldFiber`, which means `i === newChildren.length - 1` or `oldFiber.sibling === null`, end the first round.

[You can check the source code of this round traversal.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L818)

It will have two kind of results after the first round traversal.

- End Traversal From the Step 3

In this case, `newChildren` did not finish traversal, neither as `oldFiber`. For example,

```jsx
// Before
<li key="0">0</li>
<li key="1">1</li>
<li key="2">2</li>

// After
<li key="0">0</li>
<li key="2">1</li>
<li key="1">2</li>
```

The first node could be resued, and when it has found out the `key` has changed, the node cannot be reused, the first round of traversal will stop and wait for the scond roud.

Right now, `keep === 1`, `key === 2` from `oldFiber` and `keep === 2`, `key === 1` from `newChildren` have not been traversed yet

- End Traversal From the Step 4

```jsx
// Before
<li key="0" className="a">0</li>
<li key="1" className="b">1</li>

// After situation 1 —— both newChildren and oldFiber finish traversal
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>

// After situation 2 —— newChildren did not finished but oldFiber finshed traversal
// key==="2" from newChildren is not traversaled
<li key="0" className="aa">0</li>
<li key="1" className="bb">1</li>
<li key="2" className="cc">2</li>

// After situation 3 —— newChildren finsihed the traversal but oldFiber did not
// key==="1" from oldFiber is not traversaled
<li key="0" className="aa">0</li>
```

We are going to bring the result we have from the fisrt round to the second round.

## Second Round Traversal

We are going to discuss the result from the first round traversal separately.

- Both `newChildren` and `oldFiber` finish traversal.

  In this case, [`update`](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L825) on the first round traversal, diff end.

- `newChildren` did not finished but `oldFiber` finshed traversal.

  In this case, the existing `DOM node` are reused, there are new nodes added at this time, which means that this update has new nodes inserted. We just need to traverse the remaining `newChildren` for the generated `workInProgress fiber` in turn marked `Placement`.

  [You can check the source code of this logic from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L869)

- `newChildren` finsihed the traversal but `oldFiber` did not.

  In this case, it means that this update has fewer nodes than the previous one and some nodes are deleted. So you need to traversal through the remaining `oldFiber` and mark `Deletion` in turn.

  [You can check the source code of this logic from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L863)

- Both `newChildren` and `oldFiber` did not finish traversal.

  This means that there are nodes that have changed their positions in this update. This is the core heart and is hardest part of the Diff algorithm to understand. We will focus on it next.

  [You can check the source code of this logic from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L893)

## Deal with the Moving Nodes

Since we do have some nodes changed their position, so we cannot use index `i` for compare the before and after. How could we match the same node from these two updates?

`key` is what we nned to use.

For find the corresponding `key` of the `oldFiber` faster, we are going to save all of these unprocessed `oldFiber` to the `Map` and we use `key` as the key, `oldFiber` as the value.

```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
```

[You can check the source code of this logic from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L890)

Next, we are going to traversal the rest `newChildren`, we can find the `oldFiber` which has the same `key` in the `exisitingChildren` by `newChildren[i].key`.

## Mark If Node Move

Our goal is to find the move nodes, based on that, there is a thing needed to be declare first. What is the reference for whether the node is moving or not?

The reference that we used here is the position index of the last reusable node in `oldFiber`, which we use `lastPlacedIndex` to present.

The nodes updated is ordered by the order of `newChildren`. In the traversal of the `newChildren`, every `traversed reusable node` must be the most right node of the `all reusable node`. Which means, it must in the back of the position of the `lastPlacedIndex` corresponding `reusable node`.

So, we only need to compare if the position of the `traversed nodes` is in the back of the `lastPlacedIndex` corresponding `reusable node`. If so, we can only that the position of these two nodes have been changed.

We use variable `oldIndex` to present the position index of the `traversed nodes` in the `oldFiber`. If `oldIndex < lastPlacedIndex`, that means the node updated should be move to the right.

Initial value of the `lastPlacedIndex` is `0`, everytime a node has been traversed, if `oldIndex >= lastPlacedIndex`, then `lastPlacedIndex = oldIndex`.

You could tring to understanding this by checking the following demos.

### Demo 1

In the demo, we use one single letter stands for each node, the value of the node presents the `key` of the node.

```
// Before
abcd

// After
acdb

===First round traversal===

a(Before) VS a(After)
key did not change and it can be reused
rn, the inde of the corresponding `oldFiber` of a is 0
so lastPlacedIndex = 0;

keep traversaling...

c(After)vs b(Before)
key changed and it cannot be reused, first round stop
lastPlacedIndex === 0;

===First round end===

===Second round traversal===

newChildren === cdb, does not need to execute the old node deletion
oldFiber === bcd, does not need to execute the new node insert

save the rest oldFiber(bcd) as map

// current oldFiber：bcd
// current newChildren：cdb

keep traversal the rest newChildren

key === c existing in the oldFiber
const oldIndex = c(Before).index;
rn, oldIndex === 2;  // the previous node is abcd，so c.index === 2
compare oldIndex and lastPlacedIndex;

If oldIndex >= lastPlacedIndex, then it does not need to move
and lastPlacedIndex = oldIndex;
If oldIndex < lastplacedIndex, then the node needs to be moved to the right

With the example above,oldIndex 2 > lastPlacedIndex 0，
so lastPlacedIndex = 2;
node position c does not changed

keep traversaling the rest newChildren

// Current oldFiber：bd
// Current newChildren：db

key === d existing in the oldFiber
const oldIndex = d(Before).index;
oldIndex 3 > lastPlacedIndex 2 // previous node is abcd d.index === 3
So, lastPlacedIndex = 3;
node position d did not changed

keep tarversal the rest newChildren

// current oldFiber：b
// current newChildren：b

key === b exsiting in the oldFiber
const oldIndex = b(Before).index;
oldIndex 1 < lastPlacedIndex 3 // b.index === 1
So node b needs to move right

===Second round end===

In the end, node acd did not move and node b marked as move.
```

### Demo 2

```
// Before
abcd

// After
dabc

===First round traversal===
d(Before) VS a(After)
key changed and it cannot be reused, first round stop
===First round end===

===Second round traversal===
newChildren === dabc, does not need to execute the old node
oldFiber === abcd, does not need to execute the new node insert

save the rest oldFiber(bcd) as map

// oldFiber：abcd
// newChildren dabc

key === d existing in the oldFiber
const oldIndex = d(Before).index;
rn, oldIndex === 3; // d.index === 3
compare oldIndex with lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
so lastPlacedIndex = 3;
position of node d does not need changed

keep traversal the rest newChildren

// oldFiber：abc
// newChildren abc

key === a existing in the oldFiber
const oldIndex = a(Before).index; // a.index === 0
oldIndex === 0;
compare oldIndex with lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
node a needs to move to the right

keep traversal

// oldFiber：bc
// newChildren bc

key === b exsiting in the oldFiber
const oldIndex = b(Before).index; // b.index === 1
oldIndex === 1;
Comapare oldIndex wih lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
node b needs to move to the right

keep traversal

// oldFiber：c
// newChildren c

key === c existing in the oldFiber
const oldIndex = c(Before).index; // c.index === 2
oldIndex === 2;
compare oldIndex with lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
node c needs to move to the right

===Second round end===
```

As we can see, we thought that changing from `abcd` to `dabc` only need to move `d` to the front.

However, For keeping `d`, `React` moves `abc` to the back of `d`.

From that point, we could know that we should minimize the opeation of moving nodes from the back to the front.
