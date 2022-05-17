---
title: Inheritance
# date: 2022-03-30
---

## Defination

> Inheritance, together with encapsulation and polymorphism, is one of the three primary characteristics of object-oriented programming. Inheritance enables you to create new classes that reuse, extend, and modify the behavior defined in other classes. The class whose members are inherited is called the `base class`, and the class that inherits those members is called the `derived class`. A derived class can have only one direct base class. However, inheritance is transitive. If ClassC is derived from ClassB, and ClassB is derived from ClassA, ClassC inherits the members declared in ClassB and ClassA.

::: tip Tips

Structs do not support inheritance, but they can implement interfaces.

:::

## Base Class and Derived Class

A class can derive from multiple classes or interfaces, which means that it can inherit data and functions from multiple base classes or interfaces.

The syntax for creating derived class in C# is

```
<access modifiers> class <base class>
{
 ...
}
class <derived class> : <base class>
{
 ...
}
```

For example, we have a `base class` Shape and its `derived class` is Rectangle

```cs
using System;
namespace InheritanceApplication
{
   class Shape
   {
      public void setWidth(int w)
      {
         width = w;
      }
      public void setHeight(int h)
      {
         height = h;
      }
      protected int width;
      protected int height;
   }

   // derived class
   class Rectangle: Shape
   {
      public int getArea()
      {
         return (width * height);
      }
   }

   class RectangleTester
   {
      static void Main(string[] args)
      {
         Rectangle Rect = new Rectangle();

         Rect.setWidth(5);
         Rect.setHeight(7);

         // print out the total area
         Console.WriteLine("Total area is {0}",  Rect.getArea());
         Console.ReadKey();
      }
   }
}
```

You will get

```
Total area is 35
```

## Initialization of the Base Class

Derived classes inherit the variables and methods from the base class. Therefore, parent class objects should be created before the child class objects.

```cs
using System;
namespace RectangleApplication
{
   class Rectangle
   {
      protected double length;
      protected double width;
      public Rectangle(double l, double w)
      {
         length = l;
         width = w;
      }
      public double GetArea()
      {
         return length * width;
      }
      public void Display()
      {
         Console.WriteLine("The Length is {0}", length);
         Console.WriteLine("The Width is {0}", width);
         Console.WriteLine("The Area is {0}", GetArea());
      }
   }//end class Rectangle
   class Tabletop : Rectangle
   {
      private double cost;
      public Tabletop(double l, double w) : base(l, w)
      { }
      public double GetCost()
      {
         double cost;
         cost = GetArea() * 70;
         return cost;
      }
      public void Display()
      {
         base.Display();
         Console.WriteLine("The Cost is {0}", GetCost());
      }
   }
   class ExecuteRectangle
   {
      static void Main(string[] args)
      {
         Tabletop t = new Tabletop(4.5, 7.5);
         t.Display();
         Console.ReadLine();
      }
   }
}
```

```
The Length is 4.5
The Width is 7.5
The Area is 33.75
The Cost is 2362.5
```

## Multiple Inheritance

Multiple inheritance occurs when a class inherits from more than one base class. So the class can inherit features from multiple base classes using multiple inheritance.

C# does not support multiple inheritance. However, you can use interfaces to implement multiple inheritance

```cs
using System;
namespace InheritanceApplication
{
   class Shape
   {
      public void setWidth(int w)
      {
         width = w;
      }
      public void setHeight(int h)
      {
         height = h;
      }
      protected int width;
      protected int height;
   }

   // Basic Class PaintCost
   public interface PaintCost
   {
      int getCost(int area);

   }
   // Derived Class
   class Rectangle : Shape, PaintCost
   {
      public int getArea()
      {
         return (width * height);
      }
      public int getCost(int area)
      {
         return area * 70;
      }
   }
   class RectangleTester
   {
      static void Main(string[] args)
      {
         Rectangle Rect = new Rectangle();
         int area;
         Rect.setWidth(5);
         Rect.setHeight(7);
         area = Rect.getArea();
         Console.WriteLine("Total area is {0}",  Rect.getArea());
         Console.WriteLine("Total cost is ${0}" , Rect.getCost(area));
         Console.ReadKey();
      }
   }
}
```

```
Total area is 35
Total cost is $2450
```
