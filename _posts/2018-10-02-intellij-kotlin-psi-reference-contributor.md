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
        registrar.registerReferenceProvider(psiElement(KtStringTemplateExpression::class.java), MyReferenceProvider())
    }

    class MyReferenceProvider : PsiReferenceProvider() {
        override fun getReferencesByElement(element: PsiElement, context: ProcessingContext): Array<PsiReference> {
            if (element !is KtStringTemplateExpression) return emptyArray()
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
In the Psi tree, `"folder/properties"` is `KtStringTemplateExpression`. I used *PsiViewer* to find this and so should you.
So we register our `PsiReferenceProvider` to match that pattern. The `PsiReferenceProvider` implementation is quite simple.
We check for the variable *resourceFile* and then return a `PsiReference`

    
2. **Create a `PsiReference` <br>**
```kotlin
class MyReference(element: PsiElement) : PsiReferenceBase<PsiElement>(element, allOf(element.text)) {

    override fun resolve(): PsiElement? {
        (element.children.find { it is KtLiteralStringTemplateEntry } as KtLiteralStringTemplateEntry)?.let{
            val file = project?.resources?.findFileByRelativePath("${element.text}.txt") ?: return null
            val project = project ?: return null
            return PsiManager.getInstance(project).findFile(file)
        }
        return null
    }

    override fun getVariants() = emptyArray()
}
```
We need to override the `resolve()` method and return the `PsiFile` element (which is the `.txt` file). This is where
we connect the `"folder/properties"` and the `properties.txt` file.

**Note:<br>**
The `resources` above is an extension function. Once again, I love Kotlin!

```kotlin    
val Project.resources: VirtualFile?
    get() = ProjectRootManager.getInstance(this).contentSourceRoots
            .find { it.path.endsWith("src/main/resources") }
```

### Gotchas
So I didn't get all this right the first time. I had to bang my head and keyboard to get this working. Following are some
of the lessons that I would like to remember.
 
1. The first would be in figuring out the `ElementPattern`. Here I used `KtStringTemplateExpression`, but initially I
tried `LeafPsiElement` and it failed. You need to select the element that supports References.

2. The first time I got the functionality working, I chose to work with `KtLiteralStringTemplateEntry`, but this doesn't have 
good support for renaming. This is because a critical part of renaming is creating a PsiElement, and `KtPsiFactory` doesn't have
a method to create a `KtLiteralStringTemplateEntry`. So instead I chose, `KtStringTemplateExpression`.

3. I used the `PsiReferenceBase<PsiElement>(element)` form of the constructor and I got the `Could not find a Manipulator...`
exception (when I used `KtLiteralStringTemplateEntry`). This is because I didn't pass the `TextRange` in the constructor and 
so the `PsiReferenceBase` tried to pickit from the `ElementsManipulator` which was null (since there was no manipulator). 
I fixed it by using the `PsiReferenceBase<PsiElement>(element, allOf(element.text))` form of the constructor.

4. I first used `PsiReferenceBase<PsiElement>(element, element.textRange)` and I couldn't see the hyperlink, and the references
didn't work. The reason is because of a TextRange mismatch. `element.textRange` returns the TextRange of the element
relative to the *containing File*. But the TextRange expected is relative to the *element*. Hence I chose `allOf(element.text)`.
It was after this that I could see the hyperlink. Note here, that if you don't want the whole string to be hyperlinked, but only
a part of it, use `TextRange(startOffset, endOffset)`. 