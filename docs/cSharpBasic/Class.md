---
title: Class
---

When you define a class, you define a blueprint for a data type. It defines what the name of the class means, that is, what the objects of the class are made of and what operations can be performed on that object. An object is an instance of a class. The methods and variables that make up a class are the members of the class.

## Defination

The defination start with the keyword `class`, followed by the name of the class.

```
<access specifier> class  class_name
{
    // member variables
    <access specifier> <data type> variable1;
    <access specifier> <data type> variable2;
    ...
    <access specifier> <data type> variableN;
    // member methods
    <access specifier> <return type> method1(parameter_list)
    {
        // method body
    }
    <access specifier> <return type> method2(parameter_list)
    {
        // method body
    }
    ...
    <access specifier> <return type> methodN(parameter_list)
    {
        // method body
    }
}
```

::: tip Notice

- Access Specifier specifies access rules to the class and its members. If not specified, the default access identifier is used. The default access identifier for the class is `internal`, and the default access identifier for members is `private`.
- Data type specifies the type of the variable, return type specifies the data type returned by the returned method.
- You are going to use `.` oprator for access the member of class.
- The dot operator links the name of the object and the name of the member.

:::

```cs
using System;
namespace BoxApplication
{
    class Box
    {
       public double length;
       public double breadth;
       public double height;
    }
    class Boxtester
    {
        static void Main(string[] args)
        {
            Box Box1 = new Box();
            Box Box2 = new Box();
            double volume = 0.0;

            Box1.height = 5.0;
            Box1.length = 6.0;
            Box1.breadth = 7.0;

            Box2.height = 10.0;
            Box2.length = 12.0;
            Box2.breadth = 13.0;

            volume = Box1.height * Box1.length * Box1.breadth;
            Console.WriteLine("The volume of Box1 is {0}",  volume);

            volume = Box2.height * Box2.length * Box2.breadth;
            Console.WriteLine("The volume of Box2 is{0}", volume);
            Console.ReadKey();
        }
    }
}
```

```
The volume of Box1 is 210
The volume of Box2 is 1560
```

## Member Function and Encapsulation

The member function of the clas is a function defined in the class which has includes its defination or prototype. As a member of the class, it could be operated in any objects of the class and could acess all of the members from the class.

```cs
using System;
namespace BoxApplication
{
    class Box
    {
       private double length;
       private double breadth;
       private double height;
       public void setLength( double len )
       {
            length = len;
       }

       public void setBreadth( double bre )
       {
            breadth = bre;
       }

       public void setHeight( double hei )
       {
            height = hei;
       }
       public double getVolume()
       {
           return length * breadth * height;
       }
    }
    class Boxtester
    {
        static void Main(string[] args)
        {
            Box Box1 = new Box();
            Box Box2 = new Box();
            double volume;


            Box1.setLength(6.0);
            Box1.setBreadth(7.0);
            Box1.setHeight(5.0);

            Box2.setLength(12.0);
            Box2.setBreadth(13.0);
            Box2.setHeight(10.0);

            volume = Box1.height * Box1.length * Box1.breadth;
            Console.WriteLine("volume of Box1 is {0}",  volume);

            volume = Box2.height * Box2.length * Box2.breadth;
            Console.WriteLine("volume of Box2 is{0}", volume);

            Console.ReadKey();
        }
    }
}
```

```
The volume of Box1 is 210
The volume of Box2 is 1560
```

## Constructor

A class constructor is a special member function of a class that will be executed when a new object of the class is created.

The name of the constructor is as the same as the name of the class, it does not have any return type.

```cs
using System;
namespace LineApplication
{
   class Line
   {
      private double length;
      public Line()
      {
         Console.WriteLine("Object created");
      }

      public void setLength( double len )
      {
         length = len;
      }
      public double getLength()
      {
         return length;
      }

      static void Main(string[] args)
      {
         Line line = new Line();
         line.setLength(6.0);
         Console.WriteLine("The length of the line is {0}", line.getLength());
         Console.ReadKey();
      }
   }
}
```

```
Object created
The length of the line is 6
```

The default constructor has no parameters. But if you need a constructor with parameters that can have parameters, this constructor is called a parameterized constructor.

```cs
using System;
namespace LineApplication
{
   class Line
   {
      private double length;
      public Line(double len)
      {
         Console.WriteLine("Object created, length = {0}", len);
         length = len;
      }

      public void setLength( double len )
      {
         length = len;
      }
      public double getLength()
      {
         return length;
      }

      static void Main(string[] args)
      {
         Line line = new Line(10.0);
         Console.WriteLine("The length of the line is {0}", line.getLength());
         line.setLength(6.0);
         Console.WriteLine("The length of the line is {0}", line.getLength());
         Console.ReadKey();
      }
   }
}
```

```
Object created, length = 10
The length of the line is 10
The length of the line is 6
```

## Destructor

The destructor is a special member function of a class that executes when an object of a class goes out of scope.

The name of the destructor is prefixed with a `~` wavy shape before the name of the class, which does not return a value or has any arguments.

Destructors are used to release resources before ending a program, such as closing a file, freeing memory, etc.. Destructors cannot inherit or overload.

```cs
using System;
namespace LineApplication
{
   class Line
   {
      private double length;
      public Line()
      {
         Console.WriteLine("Object created !");
      }
      ~Line()
      {
         Console.WriteLine("Object deleted !");
      }

      public void setLength( double len )
      {
         length = len;
      }
      public double getLength()
      {
         return length;
      }

      static void Main(string[] args)
      {
         Line line = new Line();
         line.setLength(6.0);
         Console.WriteLine("The length of the line is {0}", line.getLength());
      }
   }
}
```

```
Object created !
The length of the line is 6
Object deleted !
```

## `Static`

We can use the `static` keyword to define class members as static. When we declare a class member to be static, it means that no matter how many objects of the class are created, there will only be one copy of that static member.

The keyword `static` means that there is only one instance of the member in the class. Static variables are used to define constants because their values can be obtained by calling the class directly without creating an instance of the class. Static variables can be initialized outside the definition of a member function or class. You can also initialize static variables inside the definition of a class.

```cs
using System;
namespace StaticVarApplication
{
    class StaticVar
    {
       public static int num;
        public void count()
        {
            num++;
        }
        public int getNum()
        {
            return num;
        }
    }
    class StaticTester
    {
        static void Main(string[] args)
        {
            StaticVar s1 = new StaticVar();
            StaticVar s2 = new StaticVar();
            s1.count();
            s1.count();
            s1.count();
            s2.count();
            s2.count();
            s2.count();
            Console.WriteLine("getNum of s1: {0}", s1.getNum());
            Console.WriteLine("getNum of s2: {0}", s2.getNum());
            Console.ReadKey();
        }
    }
}
```

```
getNum of s1： 6
getNum of s2： 6
```

You can also declare a `member function` as `static`. Such a function can only access static variables. `Static functions` exist before the object is created.

```cs
using System;
namespace StaticVarApplication
{
    class StaticVar
    {
       public static int num;
        public void count()
        {
            num++;
        }
        public static int getNum()
        {
            return num;
        }
    }
    class StaticTester
    {
        static void Main(string[] args)
        {
            StaticVar s = new StaticVar();
            s.count();
            s.count();
            s.count();
            Console.WriteLine("getNum： {0}", StaticVar.getNum());
            Console.ReadKey();
        }
    }
}
```

```
getNum: 3
```
