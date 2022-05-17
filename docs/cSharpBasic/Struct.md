---
title: Struct
# date: 2022-03-26
---

> A structure type (or struct type) is a value type that can encapsulate data and related functionality.

## Defination

For definding a struct, you must use the struct statement. The struct statement defines a new data type with multiple members for the program.

For example, you can declare a Book structure as follows:

```
struct Books
{
   public string title;
   public string author;
   public string subject;
   public int book_id;
};
```

```cs
using System;
using System.Text;

struct Books
{
   public string title;
   public string author;
   public string subject;
   public int book_id;
};

public class testStructure
{
   public static void Main(string[] args)
   {

      Books Book1;
      Books Book2;

      Book1.title = "C Programming";
      Book1.author = "Nuha Ali";
      Book1.subject = "C Programming Tutorial";
      Book1.book_id = 6495407;

      Book2.title = "Telecom Billing";
      Book2.author = "Zara Ali";
      Book2.subject =  "Telecom Billing Tutorial";
      Book2.book_id = 6495700;

      Console.WriteLine( "Book 1 title : {0}", Book1.title);
      Console.WriteLine("Book 1 author : {0}", Book1.author);
      Console.WriteLine("Book 1 subject : {0}", Book1.subject);
      Console.WriteLine("Book 1 book_id : {0}", Book1.book_id);

      Console.WriteLine("Book 2 title : {0}", Book2.title);
      Console.WriteLine("Book 2 author : {0}", Book2.author);
      Console.WriteLine("Book 2 subject : {0}", Book2.subject);
      Console.WriteLine("Book 2 book_id : {0}", Book2.book_id);

      Console.ReadKey();

   }
}
```

You will get these in the console

```
Book 1 title : C Programming
Book 1 author : Nuha Ali
Book 1 subject : C Programming Tutorial
Book 1 book_id : 6495407
Book 2 title : Telecom Billing
Book 2 author : Zara Ali
Book 2 subject : Telecom Billing Tutorial
Book 2 book_id : 6495700
```

## Characteristics of the Struct Type

Structures in C# are different from those in traditional C or C++. Structures in C# have the following characteristics

- Structures could have methods, fields, indexes, properties, operator methods, and events.
- Structures can define constructors, but not destructors. However, you cannot define a parameterless constructor for a structure. The parameterless constructor (default) is automatically defined and cannot be altered.
- Unlike classes, structs cannot inherit from other structs or classes.
- Structs cannot serve as infrastructure for other structs or classes.
- Structures can implement one or more interfaces.
- Structure members cannot be specified as abstract, virtual, or protected.
- When you create a structure object with the `New` operator, the appropriate constructor is called to create the structure. Unlike classes, structs can be instantiated without using the New operator.
- If you do not use the New operator, the fields are assigned and objects are used after all fields have been initialized.

## Class VS Struct

Some differences between class and struct inclues

- Classes are reference types, and structures are value types.
- Structures do not support inheritance.
- Structures cannot declare default constructors.

```cs
using System;
using System.Text;

struct Books
{
   private string title;
   private string author;
   private string subject;
   private int book_id;
   public void setValues(string t, string a, string s, int id)
   {
      title = t;
      author = a;
      subject = s;
      book_id =id;
   }
   public void display()
   {
      Console.WriteLine("Title : {0}", title);
      Console.WriteLine("Author : {0}", author);
      Console.WriteLine("Subject : {0}", subject);
      Console.WriteLine("Book_id : {0}", book_id);
   }

};

public class testStructure
{
   public static void Main(string[] args)
   {

      Books Book1 = new Books();
      Books Book2 = new Books();

      Book1.setValues("C Programming",
      "Nuha Ali", "C Programming Tutorial",6495407);

      Book2.setValues("Telecom Billing",
      "Zara Ali", "Telecom Billing Tutorial", 6495700);

      Book1.display();

      Book2.display();

      Console.ReadKey();

   }
}
```

You will see these in the console

```
Title : C Programming
Author : Nuha Ali
Subject : C Programming Tutorial
Book_id : 6495407
Title : Telecom Billing
Author : Zara Ali
Subject : Telecom Billing Tutorial
Book_id : 6495700
```