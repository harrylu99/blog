---
title: Lexical Scope and Dynamic Scope
date: 2022-01-06
---

## Scope

Scope refers to the area in the source code where variables are defined.

Scopes rule how variables are looked up and determine the access rights of the currently executing code with the variables.

JavaScript uses lexical scope, as known as static scope.

## Static Scope and Dynamic Scope

Because JavaScript uses lexical scope, the scope of the function is determined when the function is defined.

The opposite of the lexical scope is the dynamic scope which means the scope of the function is determined only when the function is called.

Try these code:

```js
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar();
// What is the result?
```

Static Scope:

Execute the foo function, the first step is trying to find if a variable value exists inside the foo function, if it is not, it will look for the code above, depending on where it was written, that is, value equals 1, so the result will print 1.

Dynamic Scope:

Execute the foo function, the first step is trying to find if a variable value exists inside the foo function, if it is not, it will look for the value variable from the scope of the calling function, that is, inside the bar function, so the result will print 2.

## Dynamic Scope

Some languages using dynamic scope

- Shell languages like bash, dash, and PowerShell.
- Pascal
- Logo
- Emacs Lisp
- LaTeX

## Bonus Questions

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

Guess the difference between these two pieces of code and we will try to explain them in the next article.
