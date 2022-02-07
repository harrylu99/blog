---
title: Throttle
date: 2022-02-07
---

## Foreword

We have talked about why we have to limit the frequent trigger of events and how to do that in the last article and we will focus on the throttle in this article.

## Throttle

The principle of throttle is quite simple, which is if you keep trigger events, execution-only happened once in a time.

And the solution might be different based on if execute in the beginning or after the finish. We use _leading_ stands for executing in the beginning and _trailing_ stands for executing once after finished.

There are two mainstream solutions for throttle, one is using the timestamp and the other is setting a timer.

## Use Timestamp

Let's take a look with the timestamp solution.

We take the current timestamp when the event is triggered, subtract the previous timestamp(the initial value is set to 0), execute the function when the result greater than the time period. And when the result is less than the time period, function would not be execute.

```
function throttle(func, wait) {
    var context, args;
    var previous = 0;

    return function() {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}
```

Test it with the example from the last article.

```
container.onmousemove = throttle(getUserAction, 1000);
```

## Use Timer

And next, we talk about the second solution which is use the timer.

We could set a timer when trigger an event and when it has been trigger again, depends on if the timer existing or not. If the timer exists, it will not execute untill the timer execute and then execute the function, empty the timer so the next timer could be set.

```
function throttle(func, wait) {
    var timeout;
    var previous = 0;

    return function() {
        context = this;
        args = arguments;
        if (!timeout) {
            timeout = setTimeout(function(){
                timeout = null;
                func.apply(context, args)
            }, wait)
        }

    }
}
```

Compare these two solution, we could find out that the first solution will execute immidate but the second one will execute after n seconds. Besides, it cannot execute event when it stop triggering when you use the timestamp but it still execute the event once after stop triggering by using timer.

## Combination

We have talked and compared those two solutions and we could have a complete throttle function by combinate these two.

```
function throttle(func, wait) {
    var timeout, context, args, result;
    var previous = 0;

    var later = function() {
        previous = +new Date();
        timeout = null;
        func.apply(context, args)
    };

    var throttled = function() {
        var now = +new Date();
        // remaining time of func
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
         // if ran out of the time
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}
```

Try it with your localhost.

## Optimize
