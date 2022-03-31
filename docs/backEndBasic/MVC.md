---
title: MVC basic
date: 2022-03-29
---

## Foreword

ASP.NET support three development modes, including Web Pages, MVC and Web Forms.

MVC using `Model-View-Controller` to design and build web application.

`Model` is used to process the `application data logic`, usually it responsible for accessing data in the database.

`View` is the part of an application that handles the `display of data`. Usually views are created based on model data.

`Controller` is the part of the application that handles `user interaction`, usually the controller is responsible for reading data from the view, controlling user input and sending data to the model.

MVC layering helps manage complex applications because you can focus on one aspect at a time. For example, you can focus on view design without relying on business logic. It also makes it easier to test the application. It also simplifies group development. Different developers can develop the view, controller logic, and business logic at the same time.
