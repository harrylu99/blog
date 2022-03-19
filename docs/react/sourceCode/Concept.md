---
title: Concept of React
date: 2022-02-28
---

## Concept of React

We could find the concept of `React` from their website

> React is, in our opinion, the premier way to build big, fast Web apps with JavaScript. It has scaled very well for us at Facebook and Instagram.

You might notice that React team use the word `fast` to describle this tool. So, we start from disscuss the element that might affect the speed of response. In our daily life, there might be some scenarios could limit the speed of response, which includes

- When encountering large computation operations or insufficient performance of the device, the FPS frops, result in stuttering.
- After sending internet request, it might take while for get response so that cannot be consider as fast response.

And we could summary these two as

- CPU Bottleneck
- IO Bottleneck

How does `React` handle these problems?

## Bottleneck of CPU

It is very easy to geet the bottleneck of CPU when the project is huge and has a lot of components.

Think about the example when we render 3000 `li`.

```js
function App() {
  const len = 3000;
  return (
    <ul>
      {Array(len)
        .fill(0)
        .map((_, i) => (
          <li>{i}</li>
        ))}
    </ul>
  );
}

const rootEl = document.querySelector("#root");
ReactDOM.render(<App />, rootEl);
```

The screen refresh rate of the most browsers is 60Hz, which mean the browser refresh every 16.6ms (1000ms / 60Hz).

As we known, JS could manipulate the DOM and the thread of GUI rendering is mutex with the thread of JS. So that the execution of JS script, browser layout and render cannot happen synchronously.

Which means these work needs to be done in 16.6ms

```
JS script --> layout --> render
```

It could be not time left for layout or render if the runtime of script needs more than 16.6ms.

From the example above, the script might needs more time for execution based on the amount of the components, which is 3000. And we could find out that the runtime of the JS is 73.65ms from the execution stack, which is much more than a FPS, it causes the FPS drops and page stutter.

![execution stack of js](../../images/concept1.png)

How can we solve this? Ans yes, `React` have already slove this for us.

`React` leave some space time for JS thread in each FPS and use the time for update the component. And you can [check here](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119) to find out that React leave 5ms for JS thread in default.

When the time is not enough for the script, `React` will give the control back to browser for it to render UI. The rest of script will be execute in the next FPS. And we named it as `time slice`

Next, turn on the Concurrent Mode(we will talk about it in later chapter, you just need to know the time slice will be apply after it have been turned on).

```js
// ReactDOM.render(<App/>, rootEl);
ReactDOM.unstable_createRoot(rootEl).render(<App />);
```

And now, you could find out that our 'long mission' has been sliced into each FPS and usually it takes about 5ms. As we talked before, now the browser has enough time for layout and render.

![execution stack of js 2](../../images/concept2.png)

Therefore, the key to help the neckbottle of CPU is implement the time slice. And the time slice is switch the synchronous update to the asynchronous update which could be paused.

## Bottleneck of IO

Network latency is something we cannot slove as a frontend developers. What we can do, is trying to reduce the user awareness of the network latency. `React` suggests that [integrate the findings from the Human-Computer Interaction research into real UIs](https://reactjs.org/docs/concurrent-mode-intro.html#putting-research-into-production).

This suggestion might seems abstract. If you are using IPhone, you could try it with your phone.

Open the Settings and find the General and Siri & Search, click both of them and compare the difference between them. You might feel the same when you click them. But in fact, when you click the Siri & Rearch button, the Settings page still stay in the front for a while, and system did a network requst during this time, which you might feel it if you are in a slow connection enviroment.

`React` provides [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html) and its hook [useDeferredValue](https://reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue) for improve the ux.

For supporting these features, `React` also require for change the synchronous update to the asynchronous update which could be paused.

## Summary

We have talked about how `React` try their best to provide a tool for us to build the big, fast Web apps, and we could say that the key for implement the concept, is switching the synchronous update to the asynchronous update which could be paused.
