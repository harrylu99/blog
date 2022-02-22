---
title: ES6 for...of
date: 2022-02-22
---

## Foreword

Today is 22-02-2022 on the calander, just looks like 0 and 2 are doing a loop. So in this article, we will talk about the loop with ES6.

Let's start with a standard for loop

```
var colors = ["red", "green", "blue"];

for (var i = 0, len = colors.length; i < len; i++) {
    console.log(colors[i]);
}
```

It looks goes smooth, but check this one

```
function unique(array) {
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++) {
            if (array[i] === res[j]) {
                break;
            }
        }
        if (j === resLen) {
            res.push(array[i]);
        }
    }
    return res;
}
```

Yeah... And I think it uauslly happened in our daily development. For reduce the complex of the code and avoid errors, ES6 provide iterator and for...of loop to slove this problem.

## Iterator

Iterator is an object which have next() method. You will get a result object as return and it inclueds two attributes, value and done. Value means the value of the current stuff and done means if the loop finish or not.

We could create an iterator by ES5

```
function createIterator(items) {
    var i = 0;
    return {
        next: function() {
            var done = i >= item.length;
            var value = !done ? items[i++] : undefined;

            return {
                done: done,
                value: value
            };
        }
    };
}

// iterator is an object
var iterator = createIterator([1, 2, 3]);

console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }
```

## for...of

ES6 provide for...of for us as a mothod to loop the iterator object. Let's try to use it to rewirte the code above.

```
var iterator = createIterator([1, 2, 3]);

for (let value of iterator) {
    console.log(value);
}
```

And you will get an error that shows >TypeError: iterator is not iterable.

So, what can be iterabled?

Actually, we could call the data iterable when it have the iterator interface, and the default iterator interface is in the Symbol.iterator attribute in ES6. In other words, as long as it have the Symbol.iterator attribute, we could think it is iterable.

For example,

```
const obj = {
    value: 1
};

for (value of obj) {
    console.log(value);
}

// TypeError: iterator is not iterable
```

If we add Symbol.iterator to this object

```
const obj = {
    value: 1
};

obj[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (value of obj) {
    console.log(value);
}

// 1
// 2
// 3
```

Therefore, we know that what for...of loop for, is the Symbol.iterator of the object.

## Default Iterator Object

If we use for...of loop an array object

```
const colors = ["red", "green", "blue"];

for (let color of colors) {
    console.log(color);
}

// red
// green
// blue
```

Althought we have not add Symbol.iterator, it still working. The reason of it is that ES6 have set the Stmbol.iterator attribute as a defult setting. Also, we could change it by ourselves.

```
var colors = ["red", "green", "blue"];

colors[Symbol.iterator] = function() {
    return createIterator([1, 2, 3]);
};

for (let color of colors) {
    console.log(color);
}

// 1
// 2
// 3
```

Besides array, Symbol.itertator also have been set in other data structure, inclues

1. Array
2. Set
3. Map
4. Class Array Object like arguments, DOM NodeList...
5. Generator
6. String
