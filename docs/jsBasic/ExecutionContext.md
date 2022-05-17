---
title: Execution Context
# date: 2022-01-15
---

## Foreword

When JavaScript code executes a piece of executable code, a corresponding execution context is created.
For each execution context, there are three important attributes:

- Variable object (VO)
- Scope chain
- this

And in the previous articles, we have talked about Variable Object, Scope Chain and **this**, this article will combine everything and talk about the specific processing of the execution context.

## Think

Take a look at these code script.

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

Both of the scripts will print 'local scope'. So, what is the difference between them?

We could know that the changes in the execution context stack are not the same between these two from the previous article "Execution Context Stack". And this article will analyze the specific change process of the execution context stack and the execution context in detail.

## Specific Process

Let's start with the first script.

1. Global code executed and a global execution context has been created, the global context is pressed into the execution context stack.

```js
ECStack = [globalContext];
```

2. Global context initialization.

```js
globalContext = {
  VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO,
};
```

3. Execute the checkscope function, create the checkscope function execution context and the execution context of the checkscope function is pressed into the execution context stack.

```js
ECStack = [checkscopeContext, globalContext];
```

4. The execution context of the checkscope function starts initializing.

   4.1 scope chain have been created by copying the attributes of the [[scope]].

   4.2 created active object by arguments.

   4.3 initializing active object, includes adding formal parameters, function declarations and variable declarations.

   4.4 press the active object into the top of the checkscope's scope chain. The execution context of the checkscope function starts initializing.

At the same time, the f function has been created, saving the scope chain with the inside attribute [[scope]] of the f function.

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f(){}
    },
    Scope: [AO, globalContext.VO],
    this: undefined
}
```

5. Execute f function, execution context of f function has been created, execution context of f function press into the stack.

```js
ECStack = [fContext, checkscopeContext, globalContext];
```

6. The execution context of the f function starts initializing. Same as the step 4.

```js
fContext = {
  AO: {
    arguments: {
      length: 0,
    },
  },
  Scope: [AO, checkscopeContext.AO, globalContext.VO],
  this: undefined,
};
```

7. The f function starts executing, looking up the value of scope with the scope chain and returning the scope value.

8. The f function finished, execution context of f function pops out of the execution context stack.

```js
ECStack = [checkscopeContext, globalContext];
```

9. The checkscope function finished, execution context of the checkscope function pops out of the stack.

```js
ECStack = [globalContext];
```

Now, you could try to think about the process of the second script by yourself.

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
