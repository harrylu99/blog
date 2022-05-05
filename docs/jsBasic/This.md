---
title: Understanding This With the ECMAScript Specification
date: 2022-01-14
---

## Foreword

When JavaScript code executes a piece of executable code, a corresponding execution context is created.
For each execution context, there are three important attributes:

- Variable object (VO)
- Scope chain
- this

This article will focus on the **this**.

---

We will get into **this** with ECMASciript5.

[You can read complete ECMASciript5 doc here](http://es5.github.io/#x8)

## Types

From the ECMASciript5 chapter 8

> Types are further subclassified into ECMAScript language types and specification types.

> An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Number, and Object.

> A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and ECMAScript language types. The specification types are Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, and Environment Record.

Overall, we only need to know that there is another type that only exists in the ECMAScript specification and their role is to describe the underlying behaviour logic of the language.
This article will focus on the Reference. It is closely related to the direction of **this**.

## Reference

From the ECMASciript5 Chapter 8.7

> The Reference type is used to explain the behaviour of such operators as delete, typeof, and the assignment operators.

So, the Reference is used to explain operations such as delete, typeof and assignment.

> A Reference is a resolved name binding.

> A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag.

> The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1).

> A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.

This paragraph describes the composition of the Reference, which consists of three components, namely:

- base value
- referenced name
- strict reference

But what are they?

The base value is the object in which the property resides or environmentRecord and its value can only be undefined, an Object, a Boolean, a String, a Number or an environment record.

Referenced name is the name of the attribute.

For example

```js
var foo = 1;

// Reference is：
var fooReference = {
  base: EnvironmentRecord,
  name: "foo",
  strict: false,
};
```

```js
var foo = {
  bar: function () {
    return this;
  },
};

foo.bar(); // foo

// bar's Reference is：
var BarReference = {
  base: foo,
  propertyName: "bar",
  strict: false,
};
```

The specification provides the method for getting Reference components, such as GetBase and IsPropertyReference.

These two methods are very simple, let's take a quick look:

1.GetBase

> GetBase(V). Returns the base value component of the reference V.

2.IsPropertyReference

> IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

Simple understanding: It returns true when the base value is an object.

## GetValue

In addition, a method for obtaining the corresponding value from the Reference type is described in the 8.7.1: GetValue.

```js
var foo = 1;

var fooReference = {
  base: EnvironmentRecord,
  name: "foo",
  strict: false,
};

GetValue(fooReference); // 1;
```

GetValue returns the true value of the object.
Notice that it will returns a specific value but not an object.

## How To Define The Value of This

We have talked so much about the Reference, what exactly does Reference relate to the topic of this article, **this**?

Let's take a look with chapter 11.2.3 Function Calls

> 1.Let ref be the result of evaluating MemberExpression.

> 6.If Type(ref) is Reference, then
>
> a.If IsPropertyReference(ref) is true, then
>
> i.Let thisValue be GetBase(ref).
>
> b.Else, the base of ref is an Environment Record
>
> i.Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).

> 7.Else, Type(ref) is not Reference.
>
> a. Let thisValue be undefined.

To put it simple,

1. The result of calculating MemberExpression is assigned to ref.
2. Determine if ref is a Reference type
   2.1

   2.1 If ref is Reference and IsPropertyReference(ref) is true, then the value of **this** is GetBase(ref).

   2.2 If ref is Reference and the base value value is Environment Record, then the value of **this** is ImplicitThisValue(ref).

   2.3 If ref is not a Reference, then the value of **this** is undefined.

☕Take a break here and we are going to explore more about **this**.

## Step By Step

Let's take it step-by-step :

#### 1. The result of calculating MemberExpression is assigned to ref.

See specification chapter 11.2 Left-Hand-Side Expressions:

MemberExpression :

- PrimaryExpression // Primitive expressions
- FunctionExpression // Function defines an expression
- MemberExpression [ Expression ] // Property Access Expression
- MemberExpression . IdentifierName // property access expression
- new MemberExpression Arguments // Object Creation Expression

e.g.

```js
function foo() {
  console.log(this);
}

foo(); // MemberExpression is foo

function foo() {
  return function () {
    console.log(this);
  };
}

foo()(); // MemberExpression is foo()

var foo = {
  bar: function () {
    return this;
  },
};

foo.bar(); // MemberExpression is foo.bar
```

So a simple understanding of MemberExpression is actually the left part of ().

#### 2. Determine if ref is a Reference type.

The key is to see how the specification handles the various MemberExpressions, and whether the returned result is a Reference type.

e.g.

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  },
};

//example 1
console.log(foo.bar());
//example 2
console.log(foo.bar());
//example 3
console.log((foo.bar = foo.bar)());
//example 4
console.log((false || foo.bar)());
//example 5
console.log((foo.bar, foo.bar)());
```

#### Example 1 foo.bar()

In Example 1, the result of MemberExpression is foo.bar, is foo.bar a Reference?

Check out the specification 11.2.1 Property Accessors, which shows a computational process and we just focus on the last step:

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

So we know that expression will return a Refrence type and the value is

```js
var Reference = {
  base: foo,
  name: "bar",
  strict: false,
};
```

Then we follow the step 2.1, the value is Reference type so what is the result of IsPropertyReference(ref)?

We have explain the isPropertyReference method earlier, the result returns true when if the base value is an object.

The base value is foo, which is an object, so the IsPropertyReference(ref) result is true.

And we can know the value of **this** now.

```js
this = GetBase(ref),
```

After we get the value of base value, which is foo in this example, so that the value of **this** is foo, means the result is 2.

We do spend a lot of time to prove this point to foo, but after we knowing the principle, the rest part will be faster.

#### Example 2 (foo.bar)()

```js
console.log(foo.bar());
```

foo.bar wrapped by (), check specification 11.1.6 The Grouping Operator.

> Return the result of evaluating Expression. This may be of type Reference.

> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

In fact, () doesn't compute The MemberExpression, a sa result, it's the same as the example 1

#### Example 3 (foo.bar = foo.bar)()

Check specification 11.13.1 Simple Assignment ( = ).

Third step of caculate

> 3.Let rval be GetValue(rref).

The return value is not Refrence type caused it used GetValue

Based on the logic 2.3,

**this** is undefined, and in non-strict mode, when the value of this is undefined, its value is implicitly converted to a global object.

#### Example 4 (false || foo.bar)()

Check specification 11.11 Binary Logical Operators.

Second step of caculate

> 2.Let lval be GetValue(lref).

The return value is not Refrence type caused it used GetValue and this is undefined.

#### Example 5 (foo.bar, foo.bar)()

Check specification 11.14 Comma Operator ( , ).

Second step of caculate

> 2.Call GetValue(lref).

The return value is not Refrence type caused it used GetValue and this is undefined.

#### Result

```js
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  },
};

//Example 1
console.log(foo.bar()); // 2
//Example 2
console.log(foo.bar()); // 2
//Example 3
console.log((foo.bar = foo.bar)()); // 1
//Example 4
console.log((false || foo.bar)()); // 1
//Example 5
console.log((foo.bar, foo.bar)()); // 1
```

Note: In strict mode, example 2.3 will report error.

#### Bonus

```js
function foo() {
  console.log(this);
}

foo();
```

MemberExpression is foo, parses identifiers, check the specification 10.3.1 Identifier Resolution, it returns a value of type Reference:

```js
var fooReference = {
  base: EnvironmentRecord,
  name: "foo",
  strict: false,
};
```

Think with logic 2.1, since the base value is EnvironmentRecord, not an Object type, remember the value of base value mentioned earlier? It can only be one of undefined, an Object, a Boolean, a String, a Number, or an environment record.

The result of IsPropertyReference(ref) is false, so we check with logic 2.2. The base value is the Environment Record, so implicit this value(ref) is called.

Check specification 10.2.1.1.6，ImplicitThisValue method always returns undefined.

Therefore, the value of **this** is undefined.
