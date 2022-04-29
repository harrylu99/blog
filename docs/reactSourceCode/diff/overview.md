---
title: Diff Overview
date: 2022-04-18
---

## Foreword

From the previous article which we talked about `beginWork`, we know that as for the `update` component, it will compare the the current component with the Fiber node corresponding to the component at the last update (also known as `Diff` algorithm), and generate a new Fiber node as a result of the comparison.

And in this section, we will focus on the implement of `Diff` algorithm.

[You can check the defination of `Diff` from here.](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm)

::: tip
Something we have to mention again before we get into the detail.

A `DOM node` will have up to 4 nodes associated with it at a given time.

- `current Fiber`. If the `DOM node` is already in the page, `current Fiber` represents the `Fiber node` corresponding to the `DOM node`.

- `workInProgress Fiber`. If this `DOM node` will be rendered to the page in this update, `workInProgress` Fiber represents the `Fiber node` corresponding to this `DOM node`.

- `DOM node` itself.

- `JSX object`. The result of a `ClassComponent` `render` method, or a `FunctionComponent` call. `JSX object` should contains the infomation which used for describle the `DOM node`.

The essence of the `Diff algorithm` is to compare 1 and 4 to generate 2.
:::

## The Bottleneck of `Diff` and How `React` Solve It

Since the `Diff` comes with performance loss, the React documentation mentions that even in the most cutting-edge algorithms, the complexity of the algorithm that completely compares the two trees before and after is O(n3), where n is the number of elements in the tree.

If the algorithm was used in `React`, the amount of computation that would need to be performed to display 1000 elements would be in the order of a billion. This overhead is simply too high.

`React`'s `Piff` presupposes three limits for reducing the complexity of the algorithm,

- `Diff` only for the sibling elements. If a `DOM node` spans hierarchies in two updates before and after, `React` will not try to reuse it.

- Two elements of different types will have different trees. If an element changes from `div` to `p`, React will destroy the `div` and its decendents and create a new `p` and its decendents.

- The developer can use `key prop` to imply which child elements will keep stable under different renderings. Consider the following example

```js
// before update
<div>
  <p key="hello">hello</p>
  <h3 key="world">world</h3>
</div>

// after update
<div>
  <h3 key="world">world</h3>
  <p key="hello">hello</p>
</div>

```

Without `key`, `React` will think that the first child node of `div` is changed from `p` to `h3` and the second child node is changed from `h3` to `p`. This is in accordance with the setting of restriction 2, it will be destroyed and create a new one.

But when we use `key` to specify the node before and after the correspondence, `React` knows that `p` with `key === "hello"` still exists after the update, so the `DOM node` can be reused, just need to swap the order.

These are the three restrictions how `React` solving the bottleneck of the algorithm performance.

## Implement of Diff

Let's start with the start function `reconcileChildFibers` of `Diff`, it will use different to deal process based on the `newChild`, which is the `JSX object`.

[You can check the source code of `reconcileChildFibers` from here.](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactChildFiber.new.js#L1280)

```js
// use different diff fun based on the newChild
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // type of object, could be REACT_ELEMENT_TYPE or REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // call reconcileSingleElement 
      // ...
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // call reconcileSingleTextNode 
    // ...
  }

  if (isArray(newChild)) {
    // call reconcileChildrenArray 
    // ...
  }

  // other funciton
  // ...

  // cannot satisfy one of above, delete the node
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

We could devided `Diff` into two groups based on the node

- When the type of `newChild` is `object`, `number` or `string`, which means only one node in the same level.
- When the type of `newChild` is `Array`, which means mutiple node in the same level.

We will discuss those two different type of `Diff` separately.