---
title: Nullable
date: 2022-03-24
---

## `?` and `??` in C#

`?` Single question mark can assign null to the data types which cannot be assign to null directly, such as int, double, bool, etc... Besides, it means the data type is Nullable.

```
int? i = 3;
```

is as the same as

```
Nullable<int> i = new Nullable<int>(3);
```

```
int i; //Default is 0
int? ii; //Default is null
```

`??` Double question mark for judge if a variable reutrn a value when it is null.

## Nullable

C# provides a special data type, `nullable`. It means the value range of its formal range and plus `null`.

For example, `Nullable< Int32 >` could be assign to the value between -2,147,483,648 and 2,147,483,647 and aslo, it can be null. Similarly, `Nullable< bool >` can be assin to true, false or null.

The ability to assign nulls to numeric or boolean types is particularly useful when working with databases and other data types that contain elements that may not be assigned. For example, a boolean field in a database can store the value true or false, or the field can be undefined.

The syntax of declaring a `nullable` type is

```
< data_type> ? <variable_name> = null;
```

The example shows the use of `nullable` type

```cs
using System;
namespace CalculatorApplication
{
   class NullablesAtShow
   {
      static void Main(string[] args)
      {
         int? num1 = null;
         int? num2 = 45;
         double? num3 = new double?();
         double? num4 = 3.14157;

         bool? boolval = new bool?();

         Console.WriteLine("The values which could be null: {0}, {1}, {2}, {3}", num1, num2, num3, num4);
         Console.WriteLine("A boolean which could be null: {0}", boolval);
         Console.ReadLine();

      }
   }
}
```

You will get this

```
The values which could be null:  ,45, ,3.14157
A boolean which could be null:
```

## Null-coalescing Operator `??`

Null-coalescing operator is used for defining the default values for nullable types and reference types. The Null-coalescing defines a preset value for type conversion incase the value of a nullable type is null. The operator converts the operand type to the type of an operand of another nullable (or non-nullable) value type.

```cs
using System;
namespace CalculatorApplication
{
   class NullablesAtShow
   {

      static void Main(string[] args)
      {

         double? num1 = null;
         double? num2 = 3.14157;
         double num3;
         num3 = num1 ?? 5.34;
         Console.WriteLine("The value of num3 is {0}", num3);
         num3 = num2 ?? 5.34;
         Console.WriteLine("The value of num3 is {0}", num3);
         Console.ReadLine();

      }
   }
}
```

It will shows in the console

```
The value of num3 is 5.34
The value of num3 is 3.14157
```
