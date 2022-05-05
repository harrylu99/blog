---
title: Polymorphism
date: 2022-03-31
---

## Defination

Polymorphism is the ability of the same behavior to have multiple different manifestations or morphologies.

`Polymorphism` means that there are multiple forms. In the object-oriented programming, polymorphism tends to manifest itself as `one interface, multiple functions`.

Polymorphism can be static or dynamic. In `static polymorphism`, the response of a function occurs at compile time. As for `dynamic polymorphism`, the function's response occurs at run time.

In C#, each type is polymorphic. Because all the types are inherit from Object.

## Static Polymorphism

During the compile, the connection mechanism between functions and objects is called early binding, also known as static binding. C# provides two techniques to implement static polymorphism, inclues

- Function Overloading
- Operator Overloading

We will talk about operator in the next article and we are going to talk about function overloading in the next.

## Function Overloading

You can have multiple definitions of the same function name in the scope. The definitions of functions must differ from each other, either different types or different number of parameters. You cannot overload the function that return different types.

The following example demonstrates several identical functions Add() for adding different number arguments

```cs
using System;
namespace PolymorphismApplication
{
    public class TestData
    {
        public int Add(int a, int b, int c)
        {
            return a + b + c;
        }
        public int Add(int a, int b)
        {
            return a + b;
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            TestData dataClass = new TestData();
            int add1 = dataClass.Add(1, 2);
            int add2 = dataClass.Add(1, 2, 3);

            Console.WriteLine("add1 :" + add1);
            Console.WriteLine("add2 :" + add2);
        }
    }
}
```

The following example demonstrates several identical functions print() for adding different type of arguments

```cs
using System;
namespace PolymorphismApplication
{
   class Printdata
   {
      void print(int i)
      {
         Console.WriteLine("Int {0}", i );
      }

      void print(double f)
      {
         Console.WriteLine("Double {0}" , f);
      }

      void print(string s)
      {
         Console.WriteLine("String {0}", s);
      }
      static void Main(string[] args)
      {
         Printdata p = new Printdata();
         p.print(1);
         p.print(1.23);
         p.print("Hello World");
         Console.ReadKey();
      }
   }
}

```

```
Int 1
Double 1.23
String Hello World
```

## Dynamic Polymorphism

C# allows you to use the keyword `abstract` to create abstract classes that provide implementations of partial classes of an interface. When a derived class inherits from the abstract class, the implementation is complete. `Abstract classes` contain abstract methods, which can be implemented by derived classes.

Note that here are some rules about abstract classes:

You cannot create an instance of an abstract class.
You cannot declare an abstract method outside of an abstract class.
You can declare a class as a sealed class by placing the keyword sealed before the class definition. When a class is declared sealed, it cannot be inherited. Abstract classes cannot be declared sealed.
The following program demonstrates an abstract class: