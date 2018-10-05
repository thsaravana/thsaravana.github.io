---
layout: post
title: "Adding Renaming support and Element Manipulators"
---

I really don't have to add renaming support for my plugin, but I have come so far and it seems
so natural that I have to support for renaming. Especially, this whole "ElementManipulator" seems
mysterious and I want to poke it and see what happens. This blog does not cover in-place renaming, 
but renaming that you get free when you create a reference.

### Objective
```kotlin
val resourceFile = "folder/properties"
```
Renaming `"folder/properties"` should rename the `properties.txt` file, and vice versa. Read the previous
post to understand about how the reference is established between the two.

### The Process
```kotlin
override fun handleElementRename(newElementName: String): PsiElement {
    val fileNameWithoutExtension = newElementName.split(".")[0]
    val folderName = element.text.trimQuotes().substringBeforeLast("/")
    val renamedElement = KtPsiFactory(project).createStringTemplate("$folderName/$fileNameWithoutExtension")
    return element.replace(renamedElement)
}
```
This is the method that gets invoked when you rename your references. The default implementation
of `handleElementRename()` is to invoke the `elementManipulator` of the `KtStringTemplateExpression`.
Since that's not under our control here, we need to add our logic here.
<br>
We create a renamed `KtStringTemplateExpression` here and then replace that with the original element.
That's how renaming works.

### ElementManipulator
If you are writing your own language plugin, i.e creating your own `PsiElement`, then you can create an
ElementManipulator for it. In order for the renaming to work you need to override the `handleContentChange()`
method. You do the same thing there what we did here. And that's really it. Oh, you do need to register
your manipulator against the `PsiElement` in the plugin.xml.<br>
I didn't add an `ElementManipulator` here because `KtStringTemplateExpressionManipulator` already exists, and
so my hands were tied.<br> If you do decide to use an ElementManipulator, you should override `getRangeInElement()`
as well. This is the TextRange that's highlighted when you Ctrl hover over the reference.