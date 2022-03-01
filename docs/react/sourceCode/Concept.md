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
