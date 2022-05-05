---
title: Method
date: 2022-03-22
---

## Defination

One method is a code block to organize a number of related statements together to perform a task. Every C# program has at least one class with the Main method.

To use a method, you need to:

- Implement the method
- Call the method

## Implement the method in C#

In C#, the syntax of define the method should be

```
<Access Specifier> <Return Type> <Method Name>(Parameter List)
{
   Method Body
}
```

- Access Specifier: It determines the visibility of a variable or method to another class.
- Return type: A method can return a value. The return type is the data type of the value returned by the method. If the method does not return any value, the return type is void.
- Method name: It is a unique identifier and is case sensitive. It cannot be the same as other identifiers declared in the class.
- Parameter List: This parameter is the data used to pass and receive the method. A parameter list is the type, order, and number of parameters for a method. Parameters are optional, that is, a method may not contain parameters.
- Method body: It contains the instruction set required to complete the task.

Let's take an example.

```cs
class NumberManipulator
{
   public int FindMax(int num1, int num2)
   {
      int result;

      if (num1 > num2)
         result = num1;
      else
         result = num2;

      return result;
   }
   ...
}
```

## Calling method in C#

You can use the method name to calling the method.

```cs
using System;

namespace CalculatorApplication
{
   class NumberManipulator
   {
      public int FindMax(int num1, int num2)
      {
         int result;

         if (num1 > num2)
            result = num1;
         else
            result = num2;

         return result;
      }
      static void Main(string[] args)
      {
         int a = 100;
         int b = 200;
         int ret;
         NumberManipulator n = new NumberManipulator();

        // calling the FindMax method
         ret = n.FindMax(a, b);
         Console.WriteLine("Maximun Number is： {0}", ret );
         Console.ReadLine();
      }
   }
}
```

And you will get this in your console

```
Maximun Number is： 200
```

You can also use the instance of the class for calling the public method from another class.
For example, method FindMax belongs to class NumberManipulator, but you can also call it in class Test.

```cs
using System;

namespace CalculatorApplication
{
    class NumberManipulator
    {
        public int FindMax(int num1, int num2)
        {
            int result;

            if (num1 > num2)
                result = num1;
            else
                result = num2;

            return result;
        }
    }
    class Test
    {
        static void Main(string[] args)
        {

            int a = 100;
            int b = 200;
            int ret;
            NumberManipulator n = new NumberManipulator();

            ret = n.FindMax(a, b);
            Console.WriteLine("最大值是： {0}", ret );
            Console.ReadLine();

        }
    }
}
```

You will get the same result in the console as above.

## Recursion calling

Methods can call themselves, which called recursion. The following example uses a recursive function to calculate the factorial of a number:

```cs
using System;

namespace CalculatorApplication
{
    class NumberManipulator
    {
        public int factorial(int num)
        {
            int result;

            if (num == 1)
            {
                return 1;
            }
            else
            {
                result = factorial(num - 1) * num;
                return result;
            }
        }

        static void Main(string[] args)
        {
            NumberManipulator n = new NumberManipulator();
            //calling factorial method
            Console.WriteLine("the factorial of 6 is {0}", n.factorial(6));
            Console.WriteLine("the factorial of 7 is {0}", n.factorial(7));
            Console.WriteLine("the factorial of 8 is {0}", n.factorial(8));
            Console.ReadLine();

        }
    }
}
```

This will be print in the console

```
the factorial of 6 is 720
the factorial of 7 is 5040
the factorial of 8 is 40320
```

## Parameter Passing

When you call a method with parameters, you will need to pass parameters to the method. There are three ways to pass parameters to a method in C#.

### Passing Value-Type Parameters

This is the default way to pass parameters. When a method is called, a new storage location will be created for each value parameter.

The values of the actual parameters are copied to the parameters, which use two different in-memory values. Therefore, when the value of the parameter changes, it will not affect the value of the argument, ensuring the safety of the argument data. The following example demonstrates this concept

```cs
using System;
namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void swap(int x, int y)
      {
         int temp;

         temp = x; /* save the value of x */
         x = y;    /* assign y to x */
         y = temp; /* assgin temp to y*/
      }

      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         int a = 100;
         int b = 200;

         Console.WriteLine("Before swap, the value of a is {0}", a);
         Console.WriteLine("Before swap,the value of b is {0}", b);

         /* call the function for swapping */
         n.swap(a, b);

         Console.WriteLine("After swap, the value of a is {0}", a);
         Console.WriteLine("After swap, the value of b is {0}", b);

         Console.ReadLine();
      }
   }
}
```

The follwing context will show on the console.

```
Before swap, the value of a is 100
Before swap, the value of b is 200
After swap, the value of a is 100
After swap, the value of b is 200
```

The results show that even if the value is changed within the function, the value does not change.

### Passing Reference-Type Parameters

The reference parameter is a reference to the memory location of a variable. When parameters are passed by reference, it does not create a new storage location for these parameters. A reference parameter represents the same memory location as the actual parameter supplied to the method.

In C#, use the `ref` keyword to declare reference parameters. The following example demonstrates this

```cs
using System;
namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void swap(ref int x, ref int y)
      {
         int temp;

         temp = x; /* save the value of x */
         x = y;    /* assign y to x */
         y = temp; /* assgin temp to y*/
       }

      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         int a = 100;
         int b = 200;

         Console.WriteLine("Before swap, the value of a is {0}", a);
         Console.WriteLine("Before swap,the value of b is {0}", b);

         /* call the function for swapping */
         n.swap(a, b);

         Console.WriteLine("After swap, the value of a is {0}", a);
         Console.WriteLine("After swap, the value of b is {0}", b);

         Console.ReadLine();
      }
   }
}
```

In console, you will find

```
Before swap, the value of a is 100
Before swap, the value of b is 200
After swap, the value of a is 200
After swap, the value of b is 100
```

The results show that the value inside the swap function changed and this change can be reflected in the Main function.

#### out parameter modifier

The `out` keyword causes arguments to be passed by reference. It makes the formal parameter an alias for the argument, which must be a variable. In other words, any operation on the parameter is made on the argument. It is like the `ref` keyword, except that `ref` requires that the variable be initialized before it is passed.

`Out` parameters are useful when you need to return a value from a method that parameter does not specify an initial value. Check the following example to understand this:

```cs
using System;

namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void getValues(out int x, out int y )
      {
          Console.WriteLine("Enter the first value:  ");
          x = Convert.ToInt32(Console.ReadLine());
          Console.WriteLine("Enter the second value:  ");
          y = Convert.ToInt32(Console.ReadLine());
      }

      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         /* 局部变量定义 */
         int a , b;

         /* 调用函数来获取值 */
         n.getValues(out a, out b);

         Console.WriteLine("After call the function，the value of a is {0}", a);
         Console.WriteLine("After call the function，the value of b is {0}", b);
         Console.ReadLine();
      }
   }
}
```

Try it by yourself!
