---
layout: post
title: "PSI Parsing of Kotlin Files"
---

I have written a couple of intellJ plugins that involves parsing PSI, but that's for Java. 
Recently, I was writing a plugin to help me in my office work. This time it involved PSI 
parsing of Kotlin files. I expected it to be the same as Java, but oh my, it was different. 
So thought of writing a one-pager on it.

### Adding Kotlin support for the Plugin
The first thing to do would be to add `Kotlin` plugin dependency. This will let to access 
the Kotlin Psi classes. The [intelliJ document](https://www.jetbrains.org/intellij/sdk/docs/basics/plugin_structure/plugin_dependencies.html)
 explains how to add plugin dependencies. But, as of this time, whatever mentioned there does not work (hope they update the page soon).
  You need to add the below to your `build.gradle` to add Kotlin dependency.

```groovy
intellij {
    plugins "Kotlin" // This is possible because Kotlin is bundled with the IDE, if not you need to mention the exact version of the Kotlin plugin
}
```

### Objective
```kotlin
import org.springframework.stereotype.Service

@Service(value = Constants.SAMPLE_SERVICE)
class SampleService {
    //...
}
```
The goal is to fetch the `value`.<br>
Now, `value` can be either be `Constants.SAMPLE_SERVICE` or simply `SAMPLE_SERVICE` (by making a static import).
We need to fetch the fully qualified name of `SAMPLE_SERVICE`. In this case, it is `com.sample.Constants.SAMPLE_SERVICE`.

### The Process

Let me breakdown the steps involved to accomplish this.

1. **Obtain `PsiAnnotation` <br>**
```kotlin
val psiAnnotation = (psiClass.modifierList?.annotations?.toList() ?: listOf())
   .filter { annotation ->
       annotation.qualifiedName == "org.springframework.stereotype.Service"
   }
```
    We first get an instance of the `PsiClass`, then access the `PsiModifierList`, and in turn get an array of `PsiAnnotaion`. 
    We then filter the `@Service` annotation from it.
    
2. **Obtain `KtValueArgument` <br>**
```kotlin
val valueArgument = 
   ((psiAnnotation as KtLightElement<*, *>).kotlinOrigin as KtAnnotationEntry)
       .findAttributeValue("value") as? KtValueArgument
```
    The code here is straightforward. The key here is the *type casting* to the right `Kt` element. This is how Psi for
    Java differs from Kotlin. We have a corresponding `Kt`class for each of the Java Psi. I use the `PsiViewer` plugin to
    get a general sense of the Psi tree and then use that to parse the Psi class.
    
3. **Obtain `PsiReference` <br>**
```kotlin
val expression = valueArgument.lastChild
val references = when (expression) {
    is KtDotQualifiedExpression -> expression.lastChild.references
    is KtNameReferenceExpression -> expression.references
    else -> null
}
val reference = references?.find { it is KtSimpleNameReference }
```
   This is handle the 2 types of occurrences of the `value`. Again, I don't know these Psi terms on the top of my head, 
   and I often use the `PsiViewer` or put a breakpoint and the use the `Evaluate Expression` feature to see what I can get
   out of `KtValueArgument`. Believe me, you can learn a lot about an object in the Debug context.
   
4. **Obtain Fully qualified name <br>**
    Just call `reference?.resolve()` to get the fully qualified name.
    
<br>    
Note:<br>
The `findAttributeValue` above is an extension function I wrote for simplification. I love Kotlin!

```kotlin    
fun KtAnnotationEntry.findAttributeValue(attributeName: String): ValueArgument? {
    return valueArguments.find {
        it.getArgumentName()?.asName?.identifier == attributeName
    }
}
```    