---
title: Variable Object
date: 2022-01-19
---

## Foreword

We have talked about when JavaScript code executes a piece of executable code, a corresponding execution context is created in the previous chapter.
For each execution context, there are three important attributes:

- Variable object (VO)
- Scope chain
- this

This chapter will focus on the process of creating variable objects.

## Variable Object

Variable objects are data scopes related to the execution context and store the declarations of variables and functions defined in the context.

Because the variable objects in different execution contexts are slightly different, let's talk about the variable objects in the global execution context and the function context.

## Global Execution Context

Let's begin with a concept, global object

> A global object is an object that always exists in the global scope.
>
> In JavaScript, there's always a global object defined. In a web browser, when scripts create global variables defined with the var keyword, they're created as members of the global object. (In Node.js this is not the case.) The global object's interface depends on the execution context in which the script is running. For example:
>
> - In a web browser, any code which the script doesn't specifically start up as a background task has a Window as its global object. This is the vast majority of JavaScript code on the Web.
> - Code running in a Worker has a WorkerGlobalScope object as its global object.
> - Scripts running under Node.js have an object called global as their global object.

Some explain examples:

With this reference, in JavaScript the global object is the Window object.

```
console.log(this); //Window
```

The global object is an object that instantiated by the Object constructor.

```
console.log(this instanceof Object); // true
```

In JavaScript, global objects have the window attribute pointing to themselves.

```
var a = 1;
console.log(window.a); // 1

this.window.b = 2;
console.log(this.b); // 2
```

To sum up, the variable object in a global execution context is the global object.

## Function Context

We use the activation object (AO) to represent the variable object in the context of a function.

The AO and the variable object(VO) are actually one thing, but the differences is that AO is normative or engine implementation, it can not be accessed in the JavaScript environment, the execution context of the variable object will be activated when entering an execution context.

The AO is created when it enters the function context and is initialized by the function's arguments property. The value of arguments property is an Arguments object.

## Execution Procedure

The code for the execution contexts is processed in two phases: parsing and execution

### Parsing

When it get into the execution contexts, the code has not been executed at this time yet,

Variable objects include:

- All formal parameters of the function (if it is a function context)

  - A property of a variable object consisting of a name and corresponding value is created.

  - If there do not have arguments, the property value will set to undefined.

- Function declarations

  - Properties of a variable object consisting of a name and corresponding value are created.

  - If a same name variable object already exists with a property , it will completely replaced.

- Variable declarations

  - Properties of a variable object consisting of a name and corresponding value are created.

  - If the variable name is the same as a formal parameter or function that has already been declared, the variable declaration will not interfere with the properties.

For Example:

```
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

After entering the execution contexts, the AO is

```
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

### Execution

During the code execution phase, the code is executed sequentially, modifying the value of the variable object according to the code.

Again, in the example above, when the code is finished executing, the AO is:

```
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

In conslusion,

- The initialization of variable object in a global execution context is a global object.

- Variable object initialization for function context only includes Arguments objects.

- Initial property values such as formal parameters, function declarations, and variable declarations are added to the variable object when entering the execution contexts.

- During the code execution phase, the property values of the variable object are modified again.

## Thinking Questions

1.

```
function foo() {
    console.log(a);
    a = 1;
}

foo(); // ???

function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```

2.

```
console.log(foo);

function foo(){
    console.log("foo");
}

var foo = 1;
```
