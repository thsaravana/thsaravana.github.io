---
layout: post
title: "Adding References to existing language"
---

I am not writing a custom language plugin, but trying to add references to a string literal, so this is kind
of an add-on to the kotlin language. I tried using `PsiReferenceContributor` and finally accomplished what I set out to do. 
This blog is a reminder to myself so that I don't make these mistakes again :)

### Objective
```kotlin
class Sample {
  val resourceFile = "folder/properties"
  // ...
}  
```
The objective is to add hyperlink to `folder/properties` string, so that on Ctrl clicking it will open `properties.txt` 
located in `src/main/resources/folder` directory.<br> This hyperlink should be available only for the variable 
`resourceFile`.

### The Process

Following are the steps involved to accomplish this and the hiccups I faced.

1. **Adding `PsiReferenceContributor` <br>**
```kotlin
class MyReferenceContributor : PsiReferenceContributor() {

    override fun registerReferenceProviders(registrar: PsiReferenceRegistrar) {
        registrar.registerReferenceProvider(psiElement(KtLiteralStringTemplateEntry::class.java), MyReferenceProvider())
    }

    class MyReferenceProvider : PsiReferenceProvider() {
        override fun getReferencesByElement(element: PsiElement, context: ProcessingContext): Array<PsiReference> {
            val property = element.parents().find { it is KtProperty } as? KtProperty
            if (property?.name == "resourceFile") {
                return arrayOf(MyReference(element))
            }
            return emptyArray()
        }
    }
}
```
Add the below to `plugin.xml`

    ```xml
    <extensions defaultExtensionNs="com.intellij">
        <psi.referenceContributor implementation="com.sample.MyReferenceContributor"/>
    </extensions>
    ```
In the Psi tree, `folder/properties` is `KtLiteralStringTemplateEntry`. I used *PsiViewer* to find this and so should you.
So we register our `PsiReferenceProvider` to match that pattern. The `PsiReferenceProvider` implementation is quite simple.
We check for the variable *resourceFile* and then return a `PsiReference`

    
2. **Create a `PsiReference` <br>**
```kotlin
class MyReference(element: PsiElement) : PsiReferenceBase<PsiElement>(element, allOf(element.text)) {

    override fun resolve(): PsiElement? {
        val file = project?.resources?.findFileByRelativePath("${element.text}.txt") ?: return null
        val project = project ?: return null
        return PsiManager.getInstance(project).findFile(file)
    }

    override fun getVariants() = emptyArray()
}
```
We need to override the `resolve()` method and return the `PsiFile` element (which is the `.txt` file). This is where
we connect the `folder/properties` and the `properties.txt` file.

    
<br>    
Note:<br>
The `resources` above is an extension function. Once again, I love Kotlin!

```kotlin    
val Project.resources: VirtualFile?
    get() = ProjectRootManager.getInstance(this).contentSourceRoots
            .find { it.path.endsWith("src/main/resources") }
```
