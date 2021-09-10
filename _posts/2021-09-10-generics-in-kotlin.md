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
 
I am having dinner. I will answer this soon.