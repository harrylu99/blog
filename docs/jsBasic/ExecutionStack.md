---
title: Execution Context Stack
date: 2022-01-19
---

## Order Execution

Compare the code

```js
var foo = function () {
  console.log("foo1");
};

foo(); // foo1

var foo = function () {
  console.log("foo2");
};

foo(); // foo2
```

```js
function foo() {
  console.log("foo1");
}

foo(); // foo2

function foo() {
  console.log("foo2");
}

foo(); // foo2
```

Because the JavaScript engine does not analyze and execute programs line by line but analyzes executions piece by piece. When executing a piece of code, there is a "preparation work", such as the variable promotion in the first example and function promotion in the second example.

But how is the "piece" in this "piece by piece" divided?

What kind of code does the JavaScript engine need to do the "pre-work"?

## Executable Code

This brings us to the types of executable code in JavaScript

It is very simple, there are three kinds, global code, function code and eval code.

For example, when a function is executed, there is preparation work and we give the "pre-work" here a technical name, "execution context".

## Execution Context Stack

Here is our problem, we have so many functions and how to manage the execution contexts that have been created?

So the JavaScript engine creates an Execution context stack (ECS) to manage the execution context.

To simulate the behaviour of the ECS, let's define the ECS as an array:

```js
ECStack = [];
```

Imagine when JavaScript starts to explain the execution code, the first thing you will meet is the global code. As a result, when initializing, you will press a global execution context into the ECS, we use globalContext to represent it here and only when the entire application ends, ECStack will be emptied. So, before the end of the program, there will always be a globalContext at the bottom of the ECStack:

```js
ECStack = [globalContext];
```

And here is code we will have

```js
function fun3() {
  console.log("fun3");
}

function fun2() {
  fun3();
}

function fun1() {
  fun2();
}

fun1();
```

When a function is executed, an execution context is created and pushed into the execution context stack, and when the function is finished executing, the execution context of the function is popped out of the stack. Let's take a look at how to handle the above code:

```js
// Pseudocode

// fun1()
ECStack.push(<fun1> functionContext);

// fun1 call fun2, create execution context of fun2
ECStack.push(<fun2> functionContext);

// fun2 call fun3
ECStack.push(<fun3> functionContext);

// fun3 execution completed
ECStack.pop();

// fun2 execution completed
ECStack.pop();

// fun1 execution completed
ECStack.pop();

// JavaScript keep executing,But there always got a globalContext at the bottom of the ECStack.

```

## Answer For the Last Article

Okay, now we understand how the execution context stack handles execution context, let's take a look at the question of the previous article:

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f();
}
checkscope();
```

```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
checkscope()();
```

The results of the two pieces of code are the same, but what exactly is the difference between these two?

The answer is their execution context stack changes differently.

Let's mock the first part:

```js
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```

And here is the second part:

```js
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

To explain the difference in the execution of the two functions in more detail, we need to explore what the execution context contains, so welcome to the next article, Variable Object.
