---
title: Async
date: 2022-02-20
---

## async

We have async function since ES2017, it helps us much easier to do the asynchronous.

Async function is the syntactic sugar of the Generator fucntion. For example,

```js
// using generator
var fetch = require("node-fetch");
var co = require("co");

function* gen() {
  var r1 = yield fetch("https://api.github.com/users/github");
  var json1 = yield r1.json();
  console.log(json1.bio);
}

co(gen);
```

When you using async

```js
// using async
var fetch = require("node-fetch");

var fetchData = async function () {
  var r1 = await fetch("https://api.github.com/users/github");
  var json1 = await r1.json();
  console.log(json1.bio);
};

fetchData();
```

In fact, the implementation principle of the async function is to wrap the Generator function and the automaniator into a function.

```js
async function fn(args) {
  // ...
}

// it's as the same as

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

spawn function is an automaniator, like co.

And we will return a Promise object with async fucntion. You could alse think that async funcion is a layer of encapsulation based on Promise and Generator.

## async and Promise

Here have some scenarios that make us believe that it is more elegant to using async rather than Promise to handle the asynchronous.

### Clean code

```js
// example 1
function fetch() {
  return (
    fetchData()
    .then(() => {
      return "done"
    });
  )
}

async function fetch() {
  await fetchData()
  return "done"
};
```

```js
// example 2
function fetch() {
  return fetchData().then((data) => {
    if (data.moreData) {
      return fetchAnotherData(data).then((moreData) => {
        return moreData;
      });
    } else {
      return data;
    }
  });
}

async function fetch() {
  const data = await fetchData();
  if (data.moreData) {
    const moreData = await fetchAnotherData(data);
    return moreData;
  } else {
    return data;
  }
}
```

```js
// example 3
function fetch() {
  return fetchData()
    .then((value1) => {
      return fetchMoreData(value1);
    })
    .then((value2) => {
      return fetchMoreData2(value2);
    });
}

async function fetch() {
  const value1 = await fetchData();
  const value2 = await fetchMoreData(value1);
  return fetchMoreData2(value2);
}
```

### Deal with Error

```js
function fetch() {
  try {
    fetchData()
      .then((result) => {
        const data = JSON.parse(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}
```

In the code above, try/catch could catch some Promise construtor error from fetchData(), however, it cannot get the error from the JSON.parse. For getting the error from JSON.parse, we have to add catch function to repeat the logic again.

By using async/await, try/catch could catch both errors.

```js
async function fetch() {
  try {
    const data = JSON.parse(await fetchData());
  } catch (err) {
    console.log(err);
  }
}
```

### Debug

```js
const fetchData = () => new Promise((resolve) => setTimeout(resolve, 1000, 1));
const fetchMoreData = (value) =>
  new Promise((resolve) => setTimeout(resolve, 1000, value + 1));
const fetchMoreData2 = (value) =>
  new Promise((resolve) => setTimeout(resolve, 1000, value + 2));

function fetch() {
  return fetchData()
    .then((value1) => {
      console.log(value1);
      return fetchMoreData(value1);
    })
    .then((value2) => {
      return fetchMoreData2(value2);
    });
}

const res = fetch();
console.log(res);
```

Try to debug it in your browser. Because the then is executed asynchronously, the code is not execute with the order when you break the dot. Especially when you use step over, the then function goes to the next then function directly.

Compare the code which using async, you can debug it as it is a synchronous.

```js
const fetchData = () => new Promise((resolve) => setTimeout(resolve, 1000, 1));
const fetchMoreData = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, 2));
const fetchMoreData2 = () =>
  new Promise((resolve) => setTimeout(resolve, 1000, 3));

async function fetch() {
  const value1 = await fetchData();
  const value2 = await fetchMoreData(value1);
  return fetchMoreData2(value2);
}

const res = fetch();
console.log(res);
```

## async Hell

Async hell refers to the developer's desire for syntactical brevity and make the content that could have been executed in parallel into sequential execution.

### Example 1

For example,

```js
(async () => {
  const getList = await getList();
  const getAnotherList = await getAnotherList();
})();
```

In fact, getList() does not rely on the getAnotherList(). But now, getAnotherList() could only be executed after getList() gets return. It almost spent double of request time.

For solve this, we could

```js
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();
```

We could also use Promise.all()

```js
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

### Example 2

Let's take a look at this, which have added some new stuff based on the example 1

```js
(async () => {
  const listPromise = await getList();
  const anotherListPromise = await getAnotherList();

  // do something

  await submit(listData);
  await submit(anotherListData);
})();
```

Similar problem here, nothing connected between getList() and getAnotherList(), neither submit(listData) and submit(anotherListData).

We could improve this by three steps.

Firstly, we should find the dependencies and logic.

From the code above, we could find out that submit(listData) should executed after getList() and submit(anotherListData) should executed after anotherListPromise().

Second step, we could wrappe the dependent code in the async function.

```js
async function handleList() {
  const listPromise = await getList();
  // ...
  await submit(listData);
}

async function handleAnotherList() {
  const anotherListPromise = await getAnotherList();
  // ...
  await submit(anotherListData);
}
```

And lastly, concurrently execute the async function.

```js
async function handleList() {
  const listPromise = await getList();
  // ...
  await submit(listData);
}

async function handleAnotherList() {
  const anotherListPromise = await getAnotherList();
  // ...
  await submit(anotherListData);
}

// method 1
(async () => {
  const handleListPromise = handleList();
  const handleAnotherListPromise = handleAnotherList();
  await handleListPromise;
  await handleAnotherListPromise;
})()(
  // method 2
  async () => {
    Promise.all([handleList(), handleAnotherList()]).then();
  }
)();
```

## Parallelism and Concurrency

Requirement, implement the interface in both parallelism and concurrency by using an URL array.

### Parallelism

```js
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}
```

```js
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```

### Concurrency

```js
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}
```

```js
async function loadData(urls) {
  const textPromises = urls.map(async (url) => {
    const response = await fetch(url);
    return response.text();
  });

  for (const textPromise of textPromises) {
    console.log(await textPromise);
  }
}
```

## Error Catch

Althought we could use try/catch for catching errors, it might make code difficult to read when we need to catch multiple error and solve them in different solution. For example,

```js
async function asyncTask(cb) {
  try {
    const user = await UserModel.findById(1);
    if (!user) return cb("No user found");
  } catch (e) {
    return cb("Unexpected error occurred");
  }

  try {
    const savedTask = await TaskModel({ userId: user.id, name: "Demo Task" });
  } catch (e) {
    return cb("Error occurred while saving task");
  }

  if (user.notificationsEnabled) {
    try {
      await NotificationService.sendNotification(user.id, "Task Created");
    } catch (e) {
      return cb("Error while sending notification");
    }
  }

  if (savedTask.assignedUser.id !== user.id) {
    try {
      await NotificationService.sendNotification(
        savedTask.assignedUser.id,
        "Task was created for you"
      );
    } catch (e) {
      return cb("Error while sending notification");
    }
  }

  cb(null, savedTask);
}
```

We could add catch function in the promise object after await, and we could write a helper here.

```js
// to.js
export default function to(promise) {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [err]);
}
```

And the code could be simplfy like

```js
import to from "./to.js";

async function asyncTask() {
  let err, user, savedTask;

  [err, user] = await to(UserModel.findById(1));
  if (!user) throw new CustomerError("No user found");

  [err, savedTask] = await to(
    TaskModel({ userId: user.id, name: "Demo Task" })
  );
  if (err) throw new CustomError("Error occurred while saving task");

  if (user.notificationsEnabled) {
    const [err] = await to(
      NotificationService.sendNotification(user.id, "Task Created")
    );
    if (err) console.error("Just log the error and continue flow");
  }
}
```
