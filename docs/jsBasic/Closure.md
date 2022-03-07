---
title: Closure
date: 2022-01-21
---

## Definition

Definition of closure from MDN

> A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.

Take a look with this example

```js
var a = 1;

function foo() {
  console.log(a);
}

foo();
```

Foo function could get the variable a, but it is neither a local variable of the foo function nor an argument to the foo function. As a result, foo function + a seems to be like a closure.

Technically, all JavaScript functions are closures.

In ECMAScript, the closure has multiple definitions from a different angle.

1. From theory, all functions are a closure. Because they all save the data of the upper context when they are created. Even for simple global variables, accessing global variables in a function is using the outermost scope to accessing free variables.

2. From practice, the following functions are closures:

   2.1 Even if the context in which it was created has been destroyed, it still exists (for example, an intrinsic function returns from a parent function)

   2.2 Free variables are used in the code

We are going to focus on the practice view of closure.

## What Is Closure

Start with an example

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}

var foo = checkscope();
foo();
```

First, we will analyze how the execution context stack and execution context change in this code. We have talked about this in the artile "Execution Context".

1. Start running the code, a global execution context have been created and pressed into the execution context stack.
2. Global execution context initialization.
3. Executes the checkscope function, creates the checkscope function execution context and the checkscope execution context is pressed into the stack.
4. Execution context of checkscope start initializing, creating variable objects, scope chains, this, and so on.
5. After the checkscope function finishes executing, the checkscope execution context pops out of the stack.
6. Executes the f function, creates the f function execution context and the f execution context is pressed into the stack.
7. F Performs context initialization, creates variable objects, scope chains, this, and so on.
8. When the f function finishes executing, the f function context pops out of the execution context stack.

The question here will be

How could the value of scope under the checkscope be accessed when the f function is executed? The checkscope function context has been destroyed(popped out of the stack).

And if you try to run this code in PHP, it will give you an error because f function could only get the value from its own scope or global scope in PHP. However, it works in JavaScript!

After we draw the execution process, we know that the f execution context maintains a scope chain

```js
fContext = {
  Scope: [AO, checkscopeContext.AO, globalContext.VO],
};
```

And yes, thanks to this scope chain, the f function could access the value of checkscopeContext.AO which means JavaScript will make checkscopeContext.AO 'alive' in the Memory when f function uses the checkscopeContext.AO. So that f function could find it through its scope chain. And this is the closure we are talking about.

## Interview Question

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```

All the answer will be 3. Let's start analyzing it.

Before execuate data[0] function, the VO of the Global Context is

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

When execuate the data[0], the scope chain of data[0] should be

```js
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

AO of data[0]Context does not contain value i, so it will look up to the globalContext.VO which is 3.

Same as data[1] and data[2].

If we changed it to the closure

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
    return function () {
      console.log(i);
    };
  })(i);
}

data[0]();
data[1]();
data[2]();
```

Before execuate data[0] function, the VO of the Global Context is

```js
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

As the same as before.

AO of the anonymous function's context

```js
AnonymousFunctionContext = {
  AO: {
    arguments: {
      0: 0,
      length: 1,
    },
    i: 0,
  },
};
```

AO of data[0]Context does not have value i, so it will go to the Context.AO of anonymous function by scope chain, which is 0 will stop here cause it finds the variable here.

Same as data[1] and data[2].
