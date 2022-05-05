---
title: Throttle
date: 2022-01-25
---

## Foreword

We have talked about why we have to limit the frequent trigger of events and how to do that in the last article and we will focus on the throttle in this article.

## Throttle

The principle of throttle is quite simple, which is if you keep trigger events, execution-only happened once in a time.

And the solution might be different based on if execute in the beginning or after the finish. We use _leading_ stands for executing in the beginning and _trailing_ stands for executing once after finished.

There are two mainstream solutions for throttle, one is using the timestamp and the other is setting a timer.

## Use Timestamp

Let's take a look at the timestamp solution.

We take the current timestamp when the event is triggered, subtract the previous timestamp(the initial value is set to 0), execute the function when the result is greater than the time period. And when the result is less than the time period, the function would not be executed.

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;

  return function () {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

Test it with the example from the last article.

```js
container.onmousemove = throttle(getUserAction, 1000);
```

## Use Timer

And next, we talk about the second solution which is to use the timer.

We could set a timer when triggering an event and when it has been triggered again, depending on if the timer exists or not. If the timer exists, it will not execute until the timer executes and then execute the function, empty the timer so the next timer could be set.

```js
function throttle(func, wait) {
  var timeout;
  var previous = 0;

  return function () {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

Compare these two solutions, we could find out that the first solution will execute immediately but the second one will execute after n seconds. Besides, it cannot execute an event when it stops triggering when you use the timestamp but it still executes the event once after stopping triggering by using the timer.

## Combination

We have talked and compared those two solutions and we could have a complete throttle function by combining these two.

```js
function throttle(func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  var later = function () {
    previous = +new Date();
    timeout = null;
    func.apply(context, args);
  };

  var throttled = function () {
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

Now, we have a requirement that needs to custom the result have or have not the beginning and the ending.

We could have _options_ as our third parameter and judge the result based on the value of _options_. And we regulate that if the value of leading is false, that means to disable the first execution. And the false of trailing stands for disabling the callback of trigger.

```js
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}
```

## Cancel

Let's add cancel method for throttle as well.

```js
throttled.cancel = function () {
  clearTimeout(timeout);
  previous = 0;
  timeout = null;
};
```

## Note

We need to be aware that we cannot set leading: false and trailing: false at the same time. The reason for it is that when you move your mouse out, the timer would not be set cause the trailing is false and it will execute immediately when you move the mouse in, it against the leading: false. As a result, this throttle could only use in three cases.

```js
container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
  leading: false,
});
container.onmousemove = throttle(getUserAction, 1000, {
  trailing: false,
});
```

And now, we have finally implemented a completed throttle function from the underscore!
