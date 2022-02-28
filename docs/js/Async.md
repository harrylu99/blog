---
title: Async
Date: 2022-02-24
---

## async

We have async function since ES2017, it helps us much easier to do the asynchronous.

Async function is the syntactic sugar of the Generator fucntion. For example,

```js
// using generator
var fetch = require("node-fetch");
var co = require("co");

function* gen() {
  var r1 = yield fetch("https://api.github.com/users/github");
  var json1 = yield r1.json();
  console.log(json1.bio);
}

co(gen);
```

When you using async

```js
// using async
var fetch = require("node-fetch");

var fetchData = async function () {
  var r1 = await fetch("https://api.github.com/users/github");
  var json1 = await r1.json();
  console.log(json1.bio);
};

fetchData();
```

In fact, the implementation principle of the async function is to wrap the Generator function and the automaniator into a function.

```js
async function fn(args) {
  // ...
}

// as the same as

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

spawn function is an automaniator, like co.

And we will return a Promise object with async fucntion. You could alse think that async funcion is a layer of encapsulation based on Promise and Generator.

## async and Promise
