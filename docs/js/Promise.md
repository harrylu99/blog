---
title: Promise
date: 2022-02-24
---

## Callback

Eveytime when we talk abou promise, we might start talking with callback or the callback hell, at the beginning, I want talk about the negative parts when we using callback.

### Nested Callback

We might have this code when we using callback

```
doA( function(){
    doB();

    doC( function(){
        doD();
    } )

    doE();
} );

doF();
```

From the code, we might know that the order of the excution should be

```
doA()
doF()
doB()
doC()
doE()
doD()
```

It looks quite simple atm, but it could be much more complex in the real development enviroment. For debugging some feature inside the code, you might spend a lot of time for skipping between diferent functions. The reason of it is that the way how the human thinking, is it different with the way how does this code been write. So that we need spend more focus and enegery to think about the real excuation order.

And that is not the worest part of the nested callback. In fact, we might add a lot of logical judgments into the code. Like the example above, function doD() must be excuted after doC() finished. So, what if doC() failed? Should we redo it or tansfer to other function for handle this? After we add all of these judgments into the flow, the code will be so much hard to understand.

### Inversion of Control (IOC)

We should control our code all the time, but when we using callback, is the function could be executed depends on the callback API, for example

```
// execution of callback depends on the buy module
import {buy} from './buy.js';

buy(itemData, function(res) {
    console.log(res)
});
```

Think about what if we are using a third-part Api?

Does the third-part Api help you execute the function again when you have some error when you call them?

For avoid this, you could add judgement inside of your callback function. But, what if it does not executed again by other error, or, this callback function could be synchronous execution or asynchronous execution.

To sum up, for solving these, you may have to do some processing in the callback function and do some processing every time the callback function is executed which leads to a lot of repetitive code.

## Callback Hell

Let's take a look with this example, which needs to find the largest file under the floder.

```
var fs = require('fs');
var path = require('path');

function findLargest(dir, cb) {
    // find all files
    fs.readdir(dir, function(er, files) {
        if (er) return cb(er);

        var counter = files.length;
        var errored = false;
        var stats = [];

        files.forEach(function(file, index) {
            // get the file infos
            fs.stat(path.join(dir, file), function(er, stat) {

                if (errored) return;

                if (er) {
                    errored = true;
                    return cb(er);
                }

                stats[index] = stat;

                if (--counter == 0) {

                    var largest = stats
                        .filter(function(stat) { return stat.isFile() })
                        .reduce(function(prev, next) {
                            if (prev.size > next.size) return prev
                            return next
                        })

                    cb(null, files[stats.indexOf(largest)])
                }
            })
        })
    })
}
```

```
// find the largest file
findLargest('./', function(er, filename) {
    if (er) return console.error(er)
    console.log('largest file was:', filename)
});
```

And now, we want to talk about the problems we got here.

1. Hard to Reuse

It's hard to reuse the function in the callback, for example, if you want reuse the get the file infos part of fs.stat, you might reorgnize the code structure before you use it in other place.

2. The Stack Information is Broken

3. With the help from outer variables

## Promise

And we could use promise for solve most of the problems.

### Nested

For example

```
request(url, function(err, res, body) {
    if (err) handleError(err);
    fs.writeFile('1.txt', body, function(err) {
        request(url2, function(err, res, body) {
            if (err) handleError(err)
        })
    })
});
```

After we use promise

```
request(url)
.then(function(result) {
    return writeFileAsynv('1.txt', result)
})
.then(function(result) {
    return request(url2)
})
.catch(function(e){
    handleError(e)
});
```

And when we use promise to handle the example in the callback hell section

```
var fs = require('fs');
var path = require('path');

var readDir = function(dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function(err, files) {
            if (err) reject(err);
            resolve(files)
        })
    })
}

var stat = function(path) {
    return new Promise(function(resolve, reject) {
        fs.stat(path, function(err, stat) {
            if (err) reject(err)
            resolve(stat)
        })
    })
}

function findLargest(dir) {
    return readDir(dir)
        .then(function(files) {
            let promises = files.map(file => stat(path.join(dir, file)))
            return Promise.all(promises).then(function(stats) {
                return { stats, files }
            })
        })
        .then(data => {

            let largest = data.stats
                .filter(function(stat) { return stat.isFile() })
                .reduce((prev, next) => {
                    if (prev.size > next.size) return prev
                    return next
                })

            return data.files[data.stats.indexOf(largest)]
        })

}
```

### IOC

In the previous section, we have talked about that we might have troubles when we using the third-party Api, includes

1. Mutiple executed

Promise could resolve and only do it one time. The rest would be ignore.

2. Callback not executed

We could use Promise.race

```
function timeoutPromise(delay) {
    return new Promise( function(resolve,reject){
        setTimeout( function(){
            reject( "Timeout!" );
        }, delay );
    } );
}

Promise.race( [
    foo(),
    timeoutPromise( 3000 )
] )
.then(function(){}, function(err){});
```

3. Could be synchronous execution or asynchronous execution

```
var cache = {...};
function downloadFile(url) {
      if(cache.has(url)) {
            // if cache, synchronous execution
           return Promise.resolve(cache.get(url));
      }
     return fetch(url).then(file => cache.set(url, file)); // asynchronous execution
}
console.log('1');
getValue.then(() => console.log('2'));
console.log('3');
```

If we use Promise

```
var promise = new Promise(function (resolve){
    resolve();
    console.log(1);
});
promise.then(function(){
    console.log(2);
});
console.log(3);

// 1 3 2
```

## Promise Anti-parrerns

1. Nested Promise

```
// bad
loadSomething().then(function(something) {
    loadAnotherthing().then(function(another) {
        DoSomethingOnThem(something, another);
    });
});
```

```
// good
Promise.all([loadSomething(), loadAnotherthing()])
.then(function ([something, another]) {
    DoSomethingOnThem(...[something, another]);
});
```

2. Broken Promise chain

```
// bad
function anAsyncCall() {
    var promise = doSomethingAsync();
    promise.then(function() {
        somethingComplicated();
    });

    return promise;
}
```

```
// good
function anAsyncCall() {
    var promise = doSomethingAsync();
    return promise.then(function() {
        somethingComplicated()
    });
}
```

3. Messy Set

```
// bad
function workMyCollection(arr) {
    var resultArr = [];
    function _recursive(idx) {
        if (idx >= resultArr.length) return resultArr;

        return doSomethingAsync(arr[idx]).then(function(res) {
            resultArr.push(res);
            return _recursive(idx + 1);
        });
    }

    return _recursive(0);
}
```

Both of following are good.

```
function workMyCollection(arr) {
    return Promise.all(arr.map(function(item) {
        return doSomethingAsync(item);
    }));
}
```

```
function workMyCollection(arr) {
    return arr.reduce(function(promise, item) {
        return promise.then(function(result) {
            return doSomethingAsyncWithResult(item, result);
        });
    }, Promise.resolve());
}
```

4. catch

```
// bad
somethingAync.then(function() {
    return somethingElseAsync();
}, function(err) {
    handleMyError(err);
});
```

```
// good
somethingAsync
.then(function() {
    return somethingElseAsync()
})
.then(null, function(err) {
    handleMyError(err);
});
```

```
// good
somethingAsync()
.then(function() {
    return somethingElseAsync();
})
.catch(function(err) {
    handleMyError(err);
});
```

## Promisify

Sometimes we might need a promisify method for change callback to Promise.

```
function promisify(original) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            args.push(function callback(err, ...values) {
                if (err) {
                    return reject(err);
                }
                return resolve(...values)
            });
            original.call(this, ...args);
        });
    };
}
```

## Limitations of Promise

1. Eat Errors

You might be curious about how could promise eat the error? Let's take a look at this example.

```
throw new Error('error');
console.log('error');
```

In this case, error would not be console because of the throw error.

```
const promise = new Promise(null);
console.log('error');
```

And the example above also would be stop for executed. The reason of it is that if a Promise is used in an invalid way and an error effect the construction of a normal Promise, the result would be an run exception instead of a rejected Promise.

Let's try another example

```let promise = new Promise(() => {
    throw new Error('error')
});
console.log('error');
```

And in this time, error would be console as you want. Which means the inter error would not affect the outer of the Promise, and we call it 'eat errors'.

This is not the unique thing that happen with Promise, it happen when you using try..catch as well.

For avoid this. we recommond that add a catch function at the end of the Promise chain.

2. Single Value

Promise can only have a completion value or a rejection reason, but we often need to pass multiple values in the real development. The most practice is to construct an object or array before do the pass, get this value in the then and it will be assigned to the operation, each encapsulation and unsealing undoubtedly makes the code become bulky.

Maybe we could use destructuring assignment to make it look better.

```
Promise.all([Promise.resolve(1), Promise.resolve(2)])
.then(([x, y]) => {
    console.log(x, y);
});
```

3. Cannot Cancel

You cannot cancel or stop the Promise once it has started.

4. Cannot Get the Status of Pending

We cannot get the specific status when it is pending.
