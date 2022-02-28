---
title: Scope Chain
date: 2022-01-20
---

## Foreword

When JavaScript code executes a piece of executable code, a corresponding execution context is created.
For each execution context, there are three important attributes:

- Variable object (VO)
- Scope chain
- this

This article will focus on the scope chain.

## Scope Chain

From the last article, we know that when we are looking for a variable, it will look up the variable object in the current context first and if it is not found, it will go to look up from the variable object of the context executed by the parent (the parent at the lexical level) and the variable object of the global context will be found to the global context, that is the global object. Thus a linked list consisting of multiple variable objects of an execution context is called a scope chain.

Now, let's explain how a scope chain is created and changed in terms of the creation and activation of a function.

## Creation of The Function

Each function has an internal attribute scope and when the function has been created, it will hold all the parent variables into it. We could say that scope is the hierarchical chain of all parent variables. But remember that scope is not a complete scope chain.

Let's take an example

```js
function foo() {
    function bar() {
        ...
    }
}
```

When the function created, the scope should be

```js
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

## Activate Functions

When the function is activated, it enters the function context, after the VO/AO is created, the active object is added to the front of the action chain.

At this point the scope chain of the execution context, we name it Scope:

```js
Scope = [AO].concat([[Scope]]);
```

Now, the scope chain is created.

## Example

Let's summarize the creation process of the scope chain and variable object in the function execution context with the variable object and execution context stack mentioned earlier.

```js
var scope = "global scope";
function checkscope() {
  var scope2 = "local scope";
  return scope2;
}
checkscope();
```

Procedure:

1.  The checkscope function is created, saving the scope chain to the inner attribute [[scope]].

```js
checkscope.[[scope]] = [
    globalContext.VO
];
```

2. Execute the checkscope function, function execution context has been created, execution context of checkscope function has been put into the execution context stack.

```js
ECStack = [checkscopeContext, globalContext];
```

3. The checkscope function is not executed immediately, it start doing the preparatory work, the first step: copy the function [[scope]] property to create a scope chain.

```js
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4. Second step: Create active object by using arguments and initialize the active object, with the formal parameters, function declarations and variable declarations.

```js
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: checkscope.[[scope]],
}
```

5. Step three: Put the active object into the top of the checkscope scope chain.

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: undefined,
  },
  Scope: [AO, [[Scope]]],
};
```

6. After the perp-work, the function had been start executing and the attribute values of the AO had been modifing.

```js
checkscopeContext = {
  AO: {
    arguments: {
      length: 0,
    },
    scope2: "local scope",
  },
  Scope: [AO, [[Scope]]],
};
```

7.  Find the value of scope2, the function context popped out of the execution context stack.

```js
ECStack = [globalContext];
```

## Q&A

Q:
When the checkscope function had been created, before saving to the scope chain of [[scope]] and preparing checkscope is executed, is there any difference between the scope chain created by the copy function [[scope]] property? Why are there two scope chains?

A:
When the checkscope function is created, it saves the scope chain generated according to the lexical method and when the checkscope is executed, it will copy the scope chain as the initialization of its scope chain. Then, generate a variable object according to the environment, then add this variable object to the scope chain of this copy which completely builds its scope chain. As for why there are two scope chains, it is because the final scope cannot be determined when the function is created, so why copy instead of directly modifying? Probably because the function will be called many times.
