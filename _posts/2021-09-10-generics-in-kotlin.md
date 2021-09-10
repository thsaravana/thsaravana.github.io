---
layout: post
title: "Generics in Kotlin"
---

> What is it?

These are generics: `List<String>`, `List<Any>`, `Map<Int, String>`, `Jungle<T>`, etc...
<br><br>

> What is `T` in `Jungle<T>`?
 
`T` is any Type. Think of it as a placeholder while defining the `Jungle<T>` like:
```kotlin
class Jungle<T> {
    fun obtainType(): T { 
        // ...
    }
}
```
<br>

> So then, what is the difference between `Jungle<T>` and `Jungle<Animal>`?

`T` is a placeholder that can be replaced by any type during implementation. `Animal` is one of those types. Something
like:
```kotlin
fun main() {
    val jungle: Jungle<Animal> = Jungle()
}
```
<br>

> They say that "unlike Array, the ArrayList is *invariant*". What does that mean?

*Invariant* is a type of variance, along with *covariant* and *contravariant*. For example, `String` is the subtype of `Any`.
But `ArrayList<String>` is not a subtype of `ArrayList<Any>`. This is called *invariant*. <br>
If `T` is a subtype of `U`, then:
- *Invariant* : If `Jungle<T>` is not a subtype of `Jungle<U>`
- *Covariant* : If `Jungle<T>` is a subtype of `Jungle<U>`
- *Contravariant* : If `Jungle<T>` is a supertype of `Jungle<U>`

The following is not possible and will throw a compile error, since `ArrayList` is invariant:
```kotlin
fun main() {
    val strings: ArrayList<String> = ArrayList()
    val objects: ArrayList<Any> = strings // Compile error
}
```
<br>

> Wait. Why does it throw a compile error? What is wrong with type casting like this?
 
Let's expand that code a bit, and you will understand why it is not allowed. Let's assume that the compiler doesn't throw
an error while typecasting. This will cause the following runtime error (since `lastItem` is not a String, but `Int`):
```kotlin
fun main() {
    val strings: ArrayList<String> = ArrayList()
    strings.add("One")
    val objects: ArrayList<Any> = strings // Assuming no compile error
    objects.add(5)
    val lastItem: String = strings.last() // Runtime error
}
```
<br>

> Got it. But if this is the case, then all generic type should be *Invariant* right? How is *Covariant* and *Contravariant* possible?
 
You can make a type *Covariant* or *Contravariant* by using something called **Declaration-site variance**. But before that you
need to understand something important. The reason the above example threw a "Runtime error" was that we were allowed to add 
`Int`. If you don't have the `add` method, then this problem shouldn't have occurred. Or to put it more clearly, if you don't 
allow a *Write* operation on the type, but only *Read* operation, then we can safely have it as a Covariant type.<br>
Think about it. If you have an `ArrayList<String>` but you can't add anything to it (no Write operation), then you can ensure 
that this ArrayList always contains only Strings. This means you can not only safely read `String` from it, you can also read it 
as `Any`, since `Any` is the supertype of `String`. This is only possible because you prevented the Write operation on type T.
And that's the logic behind Declaration-site variance. So to make our `Jungle<T>` as Covariant, we use `out` as follows:
```kotlin
class Jungle<out T>(val t: T) {
    fun obtainType(): T {
        return t
    }
    // fun insertType(t: T) {} // Not Possible (Type parameter T is declared as 'out', so no Write operation on type T)
}
fun main() {
    val jungleWithAnimals: Jungle<Animal> = Jungle(Cat())
    val jungleWithAnything: Jungle<Any> = jungleWithAnimals // This won't be possible if you remove the `out`
}
```

So here we are essentially telling the compiler that `Jungle` allows only `Read` operation of `T` by using the `out` keyword. 
Now you can typecast `Jungle<Animal>` to `Jungle<Any>`. This is nothing by *Covariance*.<br>
Similarly, you can make `Jungle` *Contravariant* using `in`. This is the exact opposite of what we talked about now, where 
*Write* is allowed, but *Read* is prohibited.
<br><br>

> Wow, that makes sense. I just check the source code of `List` in kotlin, and it's actually defined as `List<out E>`. So
> `List` is *Covariant*, but `MutableList` is *Invariant*. But what if we what the *Covariant* behaviour of a class we don't
> own? Let's say that `Jungle<T>` is defined as a 3rd party library, and we want to use that as a *Covariant* type, but we 
> can't change the source code. How is it possible then?
 
Well this brings us to **Use-site variance** called *Type projection*. You can make `Jungle<T>` *Covariant* on type T, while 
using it, as follows:
```kotlin
fun main() {
    val jungleWithAnimals: Jungle<Animal> = Jungle(Cat())
    val jungleWithAnything: Jungle<out Any> = jungleWithAnimals
//    val type: Animal = jungleWithAnything.obtainType() // Not possible. You can only Read 'Any'
    val type: Any = jungleWithAnything.obtainType()
//    jungleWithAnything.insertType(Cat()) // Not possible. You can't Write.
}
```

Note the usage of `out` here. This gives you *covariance* by restricting you from Write operation. Also, given that the type 
here is `Any`, you can only read as `Any` and not as `Animal`. And as always, the same is true for `in` as well. It helps you 
to use a Type as *Contravariant*.
<br><br>

> Oh, got it. I was going through some code and found something like `Jungle<T : Animal>`. What does this mean? I think this 
> means that `T` can't be just Any type, but has to be a subclass of `Animal`. Is this true?
 
You are absolutely right. Here we set an Upper bound for the type `T`, or in other works `T` should be a subtype of `Animal`. 
<br><br>

> Alright, awesome! So there is `out`, `in` and the `:` to set an upper bound. What is `Jungle<*>` then? I am confused.
 
Interesting question. This is going to take sometime. You have to wait.
