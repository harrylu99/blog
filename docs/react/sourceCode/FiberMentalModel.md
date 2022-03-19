---
title: Fiber -- Mental Model
date: 2022-03-03
---

## Foreword

React core team member [Sebastian Markbåge](https://github.com/sebmarkbage/) once said: We React what is done in pratice is `Algebraic Effects`. So, what is `Algebraic Effects` and how does it related with React?

## Algebraic Effects

`Algebraic Effects` is a concept of the functional programming, it could be used for separating side effects from he functions.

We are going to use fake syntax for explain it.

Think about if we have a function `getTotalPicNum` and after I receive two `User Name`, it could search for the number of pics in the platform from both users and return a total pic number.

```js
function getTotalPicNum(user1, user2) {
  const picNum1 = getPicNum(user1);
  const picNum2 = getPicNum(user2);

  return picNum1 + picNum2;
}
```

We do not need to focus on the implement of `getPicNum` in the above function. What we do care is the process how it return the total of these two numbers.

Next, we trying to implement the `getPicNum`.

The number of pics is stored in the server so that we need to do an asynchronous request. And I think we could use `async await` for handle the request.

```js
async function getTotalPicNum(user1, user2) {
  const picNum1 = await getPicNum(user1);
  const picNum2 = await getPicNum(user2);

  return picNum1 + picNum2;
}
```

However, every function it has been used should be async after `getTotalPicNum` become `async`, which changed the synchronous of `getTotalPicNum`.

Any solutions for us to solve this problem? Unfortunally, there is no way for implement asynchronous requests when keep use the current `getTotalPicNum`.

But we will create a fake syntax for solving it. Let's create a syntax that is similar with `try...catch`. We could named it `try...handle` and two opeartors `perform` and `resume`.

```js
function getPicNum(name) {
  const picNum = perform name;
  return picNum;
}

try {
  getTotalPicNum('Evan', 'You');
} handle (who) {
  switch (who) {
    case 'Evan':
      resume with 120;
    case 'You':
      resume with 240;
    default:
      resume with 0;
  }
}
```

When `getPicNum` have been called, `perform name` would be executed, followed by the function execution stack will pop out from `getPicNum` and be catched by the nearest `try...handle`.

`Error` would be the parameter of `catch` after `throw Error` and `name` would be the parameter of `handle` after `perform name`.

After `Error` be catched by the `catch`, the previous stack will be destroyed and back to the execution stak of `perform` after `handle` execute the `resume`.

For `case 'Evan'`, the execution stack will back to `getPicNum` after execured `resume with 120`. And `picNum === 120` in this time.

:::tip Tip
`try...catch` is a fake syntax for explaining the `Algebraic Effects`.
:::

To sum up, `Algebraic Effects` could separate `side effects` which is getting the number of pics in the example from the function logic, help the focus point of the function stay pure. Furthemore, we could see that it does not need to care about synchronous or asynchronous in `perform resume`.

## Algebraic Effects in React

The most common thing we could find that implement `Algebraic Effects` in `React` is `Hooks`.

When we using the `Hook` like `useState`, `useReducer` and `useRef`, we do not need to think about how does the `state` of `FunctionComponent` saved in `Hook` which `React` have already implement for us.

We only need to write the business logic when we using `useState`.

```js
function App() {
  const [num, updateNum] = useState(0);

  return <button onClick={() => updateNum((num) => num + 1)}>{num}</button>;
}
```

[Check this Suspense Demo from React team](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/index.js:152-160)

`ProfileDetails` for showing the User's name in the `Demo` and User's name is `asynchronous request`. However, `Demo` is synchronous.

```js
function ProfileDetails() {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

## Algebraic Effects and Generator

One of the purpose of re-building Reconciler in React16 is to change the synchronous update to the asynchronous update which could be paused.

Which means, the updates could be paused or break from the middle of the tasks list and it could keep going with the former task in middle of the list.

And that is the effect from the `Algebraic Effects`.

`Generator` is very similar to this and it has been built in the browser. However, `React` team gave up for using it based on some disadvantages from the `Generator`.

- `Generators` does not just let you yield in the middle of a stack. You have to wrap every single function in a `generator`. This not only adds a lot of syntactic overhead but also runtime overhead in any existing implementation. It's fair that the syntax might be more helpful than not, but the perf issue still stands.
- The biggest reason, however, is that `generators` are stateful. You can not resume in the middle of it.

```js
function* doWork(A, B, C) {
  var x = doExpensiveWorkA(A);
  yield;
  var y = x + doExpensiveWorkB(B);
  yield;
  var z = y + doExpensiveWorkC(C);
  return z;
}
```

Everytime whn the browser has free time, it executes one of the `doExpensiveWorks` in turn and will be paused when the time runs out, then resumes from where it left off when it resumes again.

That could be a good case for using `Generator` when we only need to consider about one task pause or resume.

Besides, when we thinking about when the 'high priority' task is cutting the line after `doExpensiveWorkA` and `doExpensiveWorkB` have finished their job. For now, component `B` has recieve a `priority update`, however, since the `generators` are stateful, the value `x` and `y` cannot be reuse here, which means it has to be re-caculate.

Based on that, `React` did not choose use `Generator` for implement the `Reconciler`.

## Algebraic Effects and Fiber

`Fiber`, as the same as `Process`, `Thread` and `Coroutine`, it is the virtual concepts of the operating system. Most articles think `Fiber` is an implementation of the `Coroutine`. In JavaScript, the implementation of `Coroutine` is `Generator`.

Now, we could think both of `Fiber` and `Generator` as an implemetation of the Algebraic Effects in JS.

`React` has its own state update mechanism, which support task with different priority, could pause and resume and could resumes from where it left off. In fact, each updated task unit is the `Fiber` of the `React Element`.

We will talk about how `Fiber` implement in the next section.
