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
