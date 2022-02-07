---
title: Debounce
date: 2022-02-07
---

## Foreword

Some events might triggered frequently in the development, for example

1. window's resize, scroll
2. mousedown, mousemove
3. keyup, keydown...

Let's take a look at this example.

```
// index.html

<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
    <title>debounce</title>
    <style>
        #container{
            width: 100%; height: 200px; line-height: 200px; text-align: center; color: #fff; background-color: #444; font-size: 30px;
        }
    </style>
</head>

<body>
    <div id="container"></div>
    <script src="debounce.js"></script>
</body>

</html>
```

```
// debounce.js

var count = 1;
var container = document.getElementById('container');

function getUserAction() {
    container.innerHTML = count++;
};

container.onmousemove = getUserAction;
```

If you try it with your localhost, you will find out that it triggers getUserAction function about 165 times when you move the mouse from the left to the right.

The above example is quite simple, however, think about if we are having a complicated callback function or ajax request? If it triggers 60 times in a second, every callback must finish in 1000/60 = 16.67ms, otherwise, the website might get stuck.

We usually have two solutions for solving this problem, they are debounce and throttle.

## Debounce

We will focus on debounce in this article.

The principle of debounce is that the execution has to be executed after n second followed by a trigger event. If you trigger the event within n seconds, it will use the time of the new event to execute in n seconds. Overall, it needs to be executed when you do not have to trigger an event within n seconds.

## First Version of Code

Based on the principle above, we could have this first version code

```
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}
```

To usr it, we could use the example above. Try it with your localhost.

```
container.onmousemove = debounce(getUserAction, 1000);
```

And you will find out that whatever you move the mouse, the event only executes 1000ms after you no longer trigger the mousemove.

The count decreased from 165 to 1 which is what we expect! We have done an amazing job here and now we could try to make this code looks better.

## This

When we console.log(this) in the getUserAction function without debounce function, the value of this should be

```
<div id="container"></div>
```

When we use debounce function, this will point to the Window object. So, we need to lead these points to the right object.

Here is the second version of our debounce code

```
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context)
        }, wait);
    }
}
```

## Event Object

JavaScript provides event object _event_ in the event handle function, let's edit getUserAction function.

```
function getUserAction(e) {
    console.log(e);
    container.innerHTML = count++;
};
```

It will print the MouseEvent object here if we do not use debounce function.

However, it will print undefined in our debounce function. Let's update our code for a bit.

```
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

We have fixed two small issues, point of this and event object so far.

## Execute Immediate

Our code seems good here, but to make this function more perfect, we need to think about a requirement.

Here we have a requirement that needs the function should be executed immediately when I trigger the event and it could be re-executed after n seconds. This requirement seems more reasonable in our daily life tbh. So, we could add a parameter _immediate_ to judge if execute immediately or not.

```
function debounce(func, wait, immediate) {

    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
}
```

## Return Value

Notice that getUserAction function might have the value of return so we also need the execution result of the return function. However, we could only return the execution result of the return function when the _immediate_ is true because of that we have used setTimeout and we have assigned the return value of func.apply(context, args) with the variables, the value will always be undefined when it returned when the values of _immediate_ are false.

```
function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // Do not execute if it have been execute.
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}
```

## Cancel Debounce

At least, we might need to meet another requirement which is I want to cancel the decounce function. For example, if I have set the time of the decouce function as 10 seconds and I want a button that could cancel the debounce function when I press it so that I could trigger again.

```
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```

Here is the way how to use to cancel function

```
var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    container.innerHTML = count++;
};

var setUseAction = debounce(getUserAction, 10000, true);

container.onmousemove = setUseAction;

document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancel();
})
```

So far, we have fully implemented a debounce function from underscore, Congratulations! And we will talk about the throttle in the next article.
