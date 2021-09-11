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

> Alright, awesome! Can we have more one type like, `Jungle<T,U,V>` ?

Yes you can. You can have as many as you want, but a good design is to limit it to 2. More that that will just cause confusion. 
Also, note that `in` and `out` can be applied to these type variables independently. So you can have something like 
`Jungle<in T, out U, in V : Animal>`. This is why, when you talk about *Covariance* or *Contravariance*, you should also mention 
the type variable. Here, `Jungle` is *covariant* in `U`, but *contravariant* in `T` and `V`.
<br<br>

> Alright, awesome! So there is `out`, `in` and the `:` to set an upper bound. What is `Jungle<*>` then? I am confused.
 
You use `*` to say that you don't know the type, but you still want to use it in a safe way. These are called **Star-projections**.
Let's say you have a `List` of something, and you have no idea of what type 
it holds, then you use `List<*>`. This has different implications based on the variance. If you can only read, then `*` implies 
that you can read `Any?`, and if you can only Write, then it mean you can write `Nothing`. Think about it. If you have no idea 
about the Type, then you can only read the base type that all Types extends from which is `Any?`. When you have to write, since 
you don't know the type, you can write Nothing. Following are the different cases based on variance:
- `Jungle<out T: Animal>` : here `Jungle<*>` means `Jungle<out Animal>`, i.e, you can read `Animal` from `Jungle<*>`
- `Jungle<in T`> : `Jungle<*>` means `Jungle<in Nothing>`, i.e, there is nothing you can write to `Jungle<*>`
- `Jungle<T: Animal>` : here `Jungle<*>` means `Jungle<out Animal>` when reading and `Jungle<in Nothing>` while writing.
- `Jungle<T>` : here `Jungle<*>` means `Jungle<out Any?>` when reading and `Jungle<in Nothing>` while writing.

In case of more than one type variable, you can use `*` for any of the type variable. For example, for the case of 
`Jungle<in T, out U, in V : Animal>`, one possible case of Star projections could be `Jungle<*, Int, *>`.
<br><br>

> Hey, I heard something about `where` keyword. What's that all about?

So you saw the use of `:` when you want to set an upper bound. Let's say you have to set multiple upper bounds to the same type 
variable like `Jungle<T>` and `T` should be a subtype of `Animal` and `Walkable`, then use accomplish this using `where`:
```kotlin
class Jungle<T>(var t: T) where T: Animal, T: Walkable {
    fun obtainType(): T = t
    fun insertType(t: T) {}
}
```
<br><br>

> That's interesting. What about Generic functions? Any thought on that?
 
Yes, even when you don't use Generic type in class or interface, you can apply it directly on a function. You can't use `in` 
and `out`, but you can set an upper limit for the type variable via `:` or `where`. You can even have multiple Type variables.
```kotlin
fun <T> getAnimals(t: T): List<T> where T: Animal, T: Walkable {
    return emptyList()
}
```

> Wow, thank you so much. All my doubts are cleared now. Is there anything that I missed out in Generics?
 
There is the concept of **Type erasure** and *reified type parameters*. But I think that's something for another day. Stay 
safe and go crazy!
