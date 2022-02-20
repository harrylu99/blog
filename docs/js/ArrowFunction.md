---
title: ES6 Arrow Function
date: 2022-02-20
---

## Foreword

Let's start with the syntax of the arrow function.

In ES6

```
let func = value => value;
```

And it means

```
let func = function (value) {
    return value;
};
```

If we have got more than one params

```
let funciton = (value, num) => value * num;
```

Which is equals to

```
let func = (value, num) => {
    return value * num
}
```

If you want to get an object from return, we can do that in this way

```
let func = ({value, num}) => ({total: value * num});

var result = func({
    value: 10,
    num: 10
})

console.log(result); //{total: 100}
```

Let's take look at this example with handle an event when we using react and immutable

```
handleEvent = () => {
  this.setState({
    data: this.state.data.set("key", "value");
  })
};
```

And there is another way could do it

```
handleEvent = () => {
  this.setState(({data}) => ({
    data: data.set("key", "value");
  }))
};
```

## Compare

We will focus on the comparion between the arrow and the normal function.

### this

There is no _this_ in the arrow function, as a result, you might need to find the value of _this_ by prototype chain when you ask for it.

Which means, the value of _this_ should be the _this_ of nearest non-arrow function of the function if it is not wrapped in an arrow function.

Let's take a look with this example that might happen in our daily work. The requirement is that the background color will be changed when I clicked the button.

In HTML

```
<button id="button">CLick Me</button>
```

In JavaScript

```
function Button(id) {
    this.element = document.querySelector("#" + id);
    this.bindEvent();
}

Button.prototype.bindEvent = function() {
    this.element.addEventListener("click", this.setBgColor, false);
};

Button.prototype.setBgColor = function() {
    this.element.style.backgroundColor = '#1abc9c'
};

var button = new Button("button");

```

It will gives you a error 'Uncaught TypeError: Cannot read property 'style' of undefined'. The reason why you got this error is that when you using addEventListener() as an element for the event register, the value of _this_ in the event function is the refrence of the element. So, if you console.log(this) in setbgColor, _this_ points to the button element and this.element is undefined. Therefore, you will get that error.

As you might ask, why dont us just change setBgColor function as _this_ points to the button element

```
Button.prototype.setBgColor = function() {
    this.style.backgroundColor = '#1abc9c'
};
```

And yes, this could fix our problem, but we might need to use other function in the setBgColor, like

```
Button.prototype.setBgColor = function() {
    this.setElementColor();
    this.setOtherElementColor();
};
```

Therefore, we still want the _this_ points to the instance object so that we could use other functions. And we might do that in this way in ES5

```
Button.prototype.bindEvent = function() {
    this.element.addEventListener("click", this.setBgColor.bind(this), false);
};
```

For avoiding the affect by the addEventListener, we use bind to bind the _this_ of setBgColor() as an instance object. And we could fix this problem better in ES6

```
Button.prototype.bindEvent = function() {
    this.element.addEventListener("click", event => this.setBgColor(event), false);
};
```

Since the arrow function does not have _this_, it will go outside to find the value of _this_ which is the _this_ of bindEvent and baesd by _this_ points to the instance object, we could use this.setBigColor function in the right way and at the same time, _this_ in the this.setBgColor is going to point the right instance object.

What is more, be aware that bindEvent and setBgColor are the regular function, which means they are not arrow function. The _this_ will points to the window object if we change it to the arrow function. And we cannot use call(), apply() or bind() to change the _this_ according to the arrow function does not have _this_.

```
var value = 1;
var result = (() => this.value).bind({value: 2})();
console.log(result); // 1
```
