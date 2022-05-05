---
title: Hooks -- Concept
date: 2022-05-19
---

::: warning
Before you start this scetion, you need to understand the basic usage of `Hooks`.

If you have not used `Hooks` yet, [you can start from the official documentation](https://reactjs.org/docs/hooks-intro.html).
:::

[You can find the motivation of `Hooks` from here.](https://reactjs.org/docs/hooks-intro.html#motivation) As a framework user, it is enough for you to know the motivation of `Hooks`. However, for better understanding of the `source code architecture`, we will find the design motivation of `Hooks` from the perspective of a `framework architecturer`.

Let's start with the logo of `React`. YOu must seem familiar with it.

![React logo](../../images/hooksConcept.png)

The design of the `React logo` is a symbol representing the `atom`. Everything in the world is made up of `atoms`, and the types and `properties` of `atoms` determine how things look and behave.

Similarly, in `React`, we can split the `UI` into many separate units, each called a `Component`, whose `properties` and `types` determine how the `UI` looks and behaves.

Ironically, the Greek word for `atom` means `indivisible`, but then scientists discovered smaller particles in atoms - `electrons`. `Electrons` can explain very well how `atoms` work.

In `React`, we can say that `ClassComponent` is a class of `atoms`.

But for `Hooks`, instead of being a class of `atoms`, it's more like `electrons` that are closer to the way things work.

We know that `React`'s architecture follows the `schedule - render - commit` runtime flow, and this flow is the lowest level of the React world runtime law.

`ClassComponent`, as an `atom` of the `React` world, its `lifecycle` (componentWillXXX/componentDidXXX) is a higher-level abstraction implemented to intervene in `React`'s runtime flow, and this is done to make it easier for framework users to get started.

`Hooks` are closer to the various concepts (`state` | `context` | `life-cycle`) of `React`'s inner workings than the higher-level abstraction of `ClassComponent`.

As developers using the `React` technology stack, when we first learn `Hooks`, both the official documentation and our experienced colleagues always compare the `life cycle` of `ClassComponent` to the execution timing of the `Hooks API`.

This is certainly a good way to get started, but when we become proficient in `Hooks`, we will find that there is a lot of fragmentation between the two concepts, and they are not the same level of abstraction that can replace each other.

For example, some of you might think `useEffect` could replace `componentWillReceiveProps`,

```js
useEffect(() => {
  console.log('something updated')
}, [props.something])
```

But in fact, `componentWillReceiveProps` is executed in the `render` phase, while `useEffect` is executed asynchronously after the rendering is completed in the `commit` phase.

So, it may be a better perspective to look at `Hooks` from the point of view of source code operation laws. This is why the above article says `Hooks` are the `electrons` of the `React` world rather than `atoms`.

[YOu can watch the React Conf 2018 here](https://www.youtube.com/watch?v=dpw9EHDh2bM&feature=youtu.be)

To sum up, `Concurrent Mode` is the future of `React`, and `Hooks` is the way to build `Components` that maximize the potential of `Concurrent Mode`.
