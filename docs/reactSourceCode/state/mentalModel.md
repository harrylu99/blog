---
title: State -- Mental Model
date: 2022-05-09
---

Before we jump into the source code, we should start from the `mental model` of the `updating`.

## Synchronous Update of React

We could understanding `update` as the `code version control`.

Before we have `code version control`, we added the functions one by one into our code, everything looks perfect untill we meet a `bug`.

For solving this, we have to push our previous changes before we start fix it.

In `React`, the apps created by `ReactDOM.render` are using this `updating` rules.

Which means, there is not `priority` in the `updating`, even the `bug` with `high priority` needs to fix after other `update`.

## Concurrent Update

When we got the `code version control`, we could temporary `stash` the current changes before we fix the `bug`.

After the `bug` fixed, we could use `git rebase` rebase with the `develop branch`, then you can keep going with the tasks.

In `React`, ths apps created by `ReactDOM.createBlockingRoot` or `ReactDOM.createRoot` are using `concurrent update`.

`high priority update` will stop the `low priority update`, which means it needs to finished the whole process from `render` to `commit`, after that, those `low priority` updates are going to `reupdate` based on the result of the `high priority update`.

We are going to talk about the implement of the `concurrent update` in the next aritlce.
