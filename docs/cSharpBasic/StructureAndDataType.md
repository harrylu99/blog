---
title: Structure and Data Type
# date: 2022-03-20
---

## Program Structure

A C# program should inclues these part

- Namespace Declaration
- a Class
- Class Method
- Class Property
- a Main method
- Statements and Expressions
- annotation

The Filename Extension of C# file is `.cs`

Here is an example of a C# file which could console "Hello World".

```cs
using System;
namespace HelloWorldApplication
{
   class HelloWorld
   {
      static void Main(string[] args)
      {
         /* My first C# program*/
         Console.WriteLine("Hello World");
         Console.ReadKey();
      }
   }
}
```

You will see "Hello World" printed in your console.

## Basic Syntax

C# is an object-oriented programming language. In the approach of OOP, a program consists of a variety of objects which interact with each other. Same kind objects are usually have the same type, or in the same class. We could have the implement of Rectangle class as the example.

```cs
using System;
namespace RectangleApplication
{
    class Rectangle
    {
        // Member Variables
        double length;
        double width;
        public void Acceptdetails()
        {
            length = 4.5;
            width = 3.5;
        }
        public double GetArea()
        {
            return length * width;
        }
        public void Display()
        {
            Console.WriteLine("Length: {0}", length);
            Console.WriteLine("Width: {0}", width);
            Console.WriteLine("Area: {0}", GetArea());
        }
    }

    class ExecuteRectangle
    {
        static void Main(string[] args)
        {
            Rectangle r = new Rectangle();
            r.Acceptdetails();
            r.Display();
            Console.ReadLine();
        }
    }
}
```

### using Keyword

Every C# program should begin with

```cs
using System;
```

The `using` keyword is used for contains the namespace in the program, every program could have mutiple `using` statement.

### class Keyword

`class` used for the declaration of a class.

### annotation

In C#, we use `/*... */` for annotation mutilple line of code.

```
/* This program demonstrates
The basic syntax of C# programming
Language */
```

You can use `//` for annotation single line.

### Member Variables

variables are the attributes or the data member of the class, used for store data. In the exmaple above, class Rectangle has two member variables, which are length and width.

### Member Function

Function declared inside the class. Class Rectangle from the example has three member functions, AcceptDetail, GetArea and Display.

### Instantiate

In the example, class ExecuteRectangle is a class which inclues a Main() method and instantiate class Rectangle.

### Identifier

Identifier used for indentfy the class, variable, function or any other program. In C#, naming of class must follow these rules.

- Must start with alphabet, underline `_` or `@`.
- Cannot start with number.
- Cannot contain any embedding space or symbol.
- Case sensitivity.
- Cannot be the same as the name of the C# Class Library.

## Data Type

Data type of C# could be grouped as

- Value types
- Reference types
- Pointer types

### Value types

Variable from value types could be assigned to an value. It inclues

- bool
- byte
- char
- decimal
- double
- float
- int
- long
- sbyte
- short
- unit
- ulong
- ushort

### Reference types

Reference types do not contain the actual data which stored in the variable, but they contain references to the variable.

In other words, they refer to a memory location. When using multiple variables, the reference type can point to a memory location. If the data for the memory location is changed by one variable, the other variables would reflect the change in this value. Built-in reference types are: `object`, `dynamic`, and `string`.

#### Object types

Object type is the base class of every data types from the Common Type Ststem. Object type could be assgin the value of any types after type conversation. We use boxing to named the action when a value type be convered to an oject type. And unboxing means for the action when an object type be convered to the value type.

```cs
object obj;
obj = 100; // This is boxing
```

#### Dynamic types

You can store any type of value in the dynamic types variable. The type checking happened during the run time.

```cs
dynamic <variable_name> = value;
```

For example,

```cs
dynamic d = 20;
```

Dynamic types is smiliar to the Object types. But type checking for object type variables occurs at compile time, while type checking for dynamically typed variables occurs at run time.

#### String types

String types allow to assgin any string value.

#### Pointer types

A pointer type variable stores the memory address of another type. Pointers in C# have the same functionality as pointers in C or C++.

```cs
type* identifier;
```

For example,

```cs
char* cptr;
int* iptr;
```
