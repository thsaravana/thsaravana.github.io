---
layout: post
title: "Generics in Kotlin"
---

> What is it?

These are generics: `List<String>`, `List<Any>`, `Map<Int, String>`, `Jungle<T>`, etc...
<br>

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

> I have lot more questions.

I am waiting...