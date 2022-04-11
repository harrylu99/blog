---
title: Commit -- Mutation
date: 2022-04-11
---

## Foreward

Same as `before mutation` stage, `mutation` stage is aslo traverse the `effectList`, executaion function which is `commitMutationEffects`.

```js
nextEffect = firstEffect;
do {
  try {
    commitMutationEffects(root, renderPriorityLevel);
  } catch (error) {
    invariant(nextEffect !== null, "Should be working on an effect.");
    captureCommitPhaseError(nextEffect, error);
    nextEffect = nextEffect.nextEffect;
  }
} while (nextEffect !== null);
```

## commitMutationEffects

[You can find the source code from here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L2091)

```js
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // traverse effectList
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;

    // reset text node based on ContentReset effectTag
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // ref update
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // process by effectTag
    const primaryEffectTag = effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // insert DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // insert DOM and update DOM
      case PlacementAndUpdate: {
        // insert
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // update
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // update DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // delete DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}
```

`commitMutationEffects` will traversal `effectList` and have three process

- reset text node by `ContentReset effectTag`
- update `ref`
- process by `effectTag`, `effectTag` includes `Placement`, `Update`, `Deletion` and `Hydrating`

`Hydrating` as server-side rendering related, we will not focus on it for now.

## Placement effect

When `Fiber node` contains `Placement effectTag`, it means that the `DOM node` corresponding to the `Fiber node` needs to be `inserted` into the page.

`commitPlacement` is the method for insert.

[You can find the source code of `commitPlacement` here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1156)

The method need three steps to complete.

1. get the `parent DOM node`, `finishedWork` is the incoming `Fiber node`.

```js
const parentFiber = getHostParentFiber(finishedWork);
// Father DOM node
const parentStateNode = parentFiber.stateNode;
```

2. Get the `DOM sibling node` of Fiber node.

```js
const before = getHostSibling(finishedWork);
```

3. Depending on whether the `DOM sibling node` exists or not, it is decided to call `parentNode.insertBefore` or `parentNode.appendChild` to perform the `DOM` insert operation.

```js
if (isContainer) {
  insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
} else {
  insertOrAppendPlacementNode(finishedWork, before, parent);
}
```

Have to notice that the execution of `getHostSibling` (fetching `sibling DOM node`) is time-consuming. When multiple insertion operations are performed sequentially under the same parent `Fiber node`, the complexity of the `getHostSibling` algorithm is exponential.

This is due to the fact that `Fiber node` do not include only `HostComponent`, so the `Fiber tree` and the rendered `DOM tree` nodes do not correspond one-to-one. To find the `DOM node` from the `Fiber node` is likely to traverse across the hierarchy.

Let us take a look at this example.

```jsx
function Item() {
  return <li><li>;
}

function App() {
  return (
    <div>
      <Item/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

The `Fiber tree` and `DOM tree` structure should be look like

```
// Fiber tree
          child      child      child       child
rootFiber -----> App -----> div -----> Item -----> li

// DOM tree
#root ---> div ---> li
```

When we insert a new node `p` before the child node `Item` of `div`, which means the `App` be like

```jsx
function App() {
  return (
    <div>
      <p></p>
      <Item />
    </div>
  );
}
```

The `Fiber tree` and `DOM tree` structure should be look like

```
// Fiber tree
          child      child      child
rootFiber -----> App -----> div -----> p
                                       | sibling       child
                                       | -------> Item -----> li
// DOM tree
#root ---> div ---> p
             |
               ---> li
```

Right now, the sibling node of the `DOM node` `p` is `li`, the `Fiber node` `p`'s sibling `DOM node` is

```js
fiberP.sibling.child;
```

Which is the `sibling fiber` of `fiber p`, `child fiber` of `Item`, `li`.

## Update effect

When the `FIber node` include the `Update effectTag`, which means the `Fiber node` needs to be updated. The method for calling is `commitWork`, it will process by the `Fiber.tag`.

[You can find the source code of `commitWork` from here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1441)

We are going to focus on the `FunctionComponent` and `HostComponent`.

### FunctionComponent mutation

`commitHookEffectListUnmount` will be called when the `fiber.tag` is `FunctionComponent`, which will traversal the `effectList` and execute the destroy function of `useLayoutEffect hook`.

[You can find the source code of `commitHookEffectListUnmount` from here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L314)

```js
useLayoutEffect(() => {
  // ...some side efect logic

  return () => {
    // ...this is the destroy function
  };
});
```

We will talk about `useLAyoutEffect` in the future section, for now, we only need to know that the destroy function of `useLayoutEffect` will be exectute in the `mutation` stage.

### HostComponent mutation

`commitUpdate` will be called when the `fiber.tag` is `HostComponet`.

[You can check the source code of `commitUpdate` from here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-dom/src/client/ReactDOMHostConfig.js#L423)

In the end, render the context of `updateQueue` assigned by `Fiber node` in the `updateDOMProperties` 's `completeWork`.

```js
for (let i = 0; i < updatePayload.length; i += 2) {
  const propKey = updatePayload[i];
  const propValue = updatePayload[i + 1];

  // style
  if (propKey === STYLE) {
    setValueForStyles(domElement, propValue);
    // DANGEROUSLY_SET_INNER_HTML
  } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    setInnerHTML(domElement, propValue);
    // children
  } else if (propKey === CHILDREN) {
    setTextContent(domElement, propValue);
  } else {
    // rest props
    setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
  }
}
```

## Deletion effect

When the `Fiber node` contains `Deletion effectTag`, it means that the `DOM node` corresponding to this `Fiber node` needs to be deleted from the page. The method to be called is `commitDeletion`.

[You can check the source code of `commitDeletion` from here](https://github.com/facebook/react/blob/970fa122d8188bafa600e9b5214833487fbf1092/packages/react-reconciler/src/ReactFiberCommitWork.new.js#L1421)

This method performs the following actions,

- Recursively calls the `componentWillUnmount` lifecycle hook in the `Fiber node` and its `descendant Fiber node` with `fiber.tag` as `ClassComponent` to remove the corresponding `DOM node` of the `Fiber node` from the page.
- Unbind `ref`
- Scheduling the destroy function of `useEffect`
