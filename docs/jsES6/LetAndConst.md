---
title: Let and Const
# date: 2022-01-27
---

## Block Scope

Variables declared through _var_ have hoisting feature.

```js
if (condition) {
  var value = 1;
}
console.log(value);
```

You might think it create value only when the condition is true and it should print error when the condition is false. However, the code is same the same as the code below because of the hoisting.

```js
var value;
if (condition) {
  value = 1;
}
console.log(value);
```

The result is undefined when the condition is false.

Besides, in the for loop

```js
for (var i = 0; i < 10; i++) {
    ...
}
console.log(i); // 10
```

We cloud get the value of i even after the loop.

ECMAScript6 brings the block scope for strengthen control over the lifecycle of variables and it existing inside of the function or in the block(the space between { and }).

## Let and Const

Block scope is used for declare the variables which are inaccessible and outside the scope of the block.

Both _let_ and _const_ are a type of the block declaration.

Some characteristics of the _let_ and _const_

1. Cannot be hoisting.

```js
if (false) {
  let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```

2. Dulicapte declaration returns error

```js
var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
```

3. Without binding the global scope.

When you are using _var_ for declaration in the global scope, it will created an brand new global scope for the attribute of the gobal object.

```js
var value = 1;
console.log(window.value); // 1
```

But it is not gonna happen when you using _let_ or _const_

```js
let value = 1;
console.log(window.value); // undefined
```

const is used for declare the constants, which cannot be modified after it has been set.

note: const declaration does not allow to modify the bindings, but the values cloud be update. This means it is okay to update the values in the object when the object is declared by the const.

```js
const data = {
  value: 1,
};

// Okay
data.value = 2;
data.num = 3;

// Error
data = {}; // Uncaught TypeError: Assignment to constant variable.
```

## Temporal Dead Zone(TDZ)

The variable declared by _let_ and _const_ would not hosting to the top of the scope, it gives error when you tring to use the variable before it has been declared.

```js
console.log(typeof value); // Uncaught ReferenceError: value is not defined
let value = 1;
```

The reason of it is that in JavaScripte enginee, either hosting them to the top of the scope(using var) or save the declaration in the TDZ. Visting the variables in the TDZ will triggers error. It can be visited after the variable declaration has been excuted and removed from the TDZ.

```js
var value = "global";

// Example 1
(function () {
  console.log(value);

  let value = "local";
})();

// Example 2
{
  console.log(value);

  const value = "local";
}
```

In the examples above, error Uncaught ReferenceError: value is not defined will be given rather than print the "global" because of the TDZ.

## Block Scope in the Loop

```js
var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs[i] = function () {
    console.log(i);
  };
}
funcs[0](); // 3
```

```js
var funcs = [];
for (var i = 0; i < 3; i++) {
  funcs[i] = (function (i) {
    return function () {
      console.log(i);
    };
  })(i);
}
funcs[0](); // 0
```

ES6 let provide a new solution

```js
var funcs = [];
for (let i = 0; i < 3; i++) {
  funcs[i] = function () {
    console.log(i);
  };
}
funcs[0](); // 0
```

The question is, why the value of i could be print here? In the pervious secrion, we have talked about _let_ cannot hosting, cannot be dulicapte declarate and cannot binding with the global scope, but why?

If it is not dulicapte declarate, it should be given error when it process the second time's loop.

```js
for (let i = 0; i < 3; i++) {
  let i = "abc";
  console.log(i);
}
// abc
// abc
// abc
```

```js
for (var i = 0; i < 3; i++) {
  var i = "abc";
  console.log(i);
}
// abc
```

Wired, right?

Here we should take a look with the [ECMAScript pecification 13.7.4.7](https://262.ecma-international.org/6.0/#sec-for-statement-runtime-semantics-labelledevaluation)

And we will find out that the uderlying layer uses different solution with using _let_ or _var_ in the _for_ loop.

What would layer do when we using the _let_

To put it simple, create a hidden scope inside the brackets. And that's why we cloud get this.

```js
for (let i = 0; i < 3; i++) {
  let i = "abc";
  console.log(i);
}
// abc
// abc
// abc
```

Then, create a new variable everytime iterate the loop and initial it by using the value of the same variable in the pervious iterate.

```js
var funcs = [];
for (let i = 0; i < 3; i++) {
  funcs[i] = function () {
    console.log(i);
  };
}
funcs[0](); // 0
```

As the same as

```js
//Pseudocode

(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
```

When executing a function, the correct value could be found according to the lexical scope, another way of saying it is that the _let_ declaration imitates the practice of closure to simplify the looping process.

## Let and Const in the Loop

What if we use _const_ ?

```js
var funcs = [];
for (const i = 0; i < 10; i++) {
  funcs[i] = function () {
    console.log(i);
  };
}
funcs[0](); // Uncaught TypeError: Assignment to constant variable.
```

The reason why we got error here is that we are tring to modify the value of the i.

Let's check about for in loop.

```js
var funcs = [],
  object = { a: 1, b: 1, c: 1 };
for (var key in object) {
  funcs.push(function () {
    console.log(key);
  });
}

funcs[0]();
```

the result is 'c'

What if we change _var_ to _let_ or _const_?

There is no dobut that the result would be 'a' when we using _let_.

And here, the result will be 'a' as well when we using _const_. The reason is that in the for in loop, it will create a new binding when iterate.

## Babel

How are they be compiled in Babel? Let's check the code after compilation.

```js
let value = 1;
```

Compiled

```js
var value = 1;
```

We can find out that Babel have been compile the _let_ to _var_. Let's look at this example.

```js
if (false) {
  let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```

If it compile to _var_, the result must be undefined. However, Babel is smart, the compilation of it should be

```js
if (false) {
  var _value = 1;
}
console.log(value);
```

Take a look at this example

```js
let value = 1;
{
  let value = 2;
}
value = 3;
```

```js
var value = 1;
{
  var _value = 2;
}
value = 3;
```

The only difference between these two is that the variable names are different.

So, what about the _let_ in the loop?

```js
var funcs = [];
for (let i = 0; i < 10; i++) {
  funcs[i] = function () {
    console.log(i);
  };
}
funcs[0](); //0
```

It have been compiled to

```js
var funcs = [];

var _loop = function _loop(i) {
  funcs[i] = function () {
    console.log(i);
  };
};

for (var i = 0; i < 10; i++) {
  _loop(i);
}
funcs[0](); // 0
```
