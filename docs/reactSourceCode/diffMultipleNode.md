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

### 1. Node update

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

### 2. Node add or subtract

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

### 3. Node position change

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

## Idea of the `Diff`

🚧 Under Construction
