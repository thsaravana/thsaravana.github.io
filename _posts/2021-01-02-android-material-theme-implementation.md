---
layout: post
title: "How we applied material theming in our app"
---

1. Styles vs Themes
2. Organizing Styles & Themes
3. Applying Material Themes

<h2>Styles vs Themes</h2>
Perhaps the important reason for confusing themes with styles, is due to the fact that
both of these are represented by the `<style>` tag. But these two cannot be more different
from each other.

|                    Style                    |                Theme               |
|:-------------------------------------------:|:----------------------------------:|
| view attributes                             | theme attributes                   |
| applied to single view                      | applied to context, view           |
| doesn't inherit from higher up in hierarchy | supports inheritance and overrides |

<h3>View attributes / Theme attributes</h3>
**Style**
```xml
<style name="Widget.App.Chip" parent="Widget.MaterialComponents.Chip.Choice">
    <item name="chipStrokeWidth">1dp</item>
    <item name="android:textColor">?colorPrimary</item>
    <item name="android:clickable">false</item>
</style>
```
**Theme**
```xml
<style name="ThemeOverlay.Label.Red" parent="">
    <item name="colorSurface">@color/red</item>
    <item name="colorOnSurface">@color/white</item>
    <item name="colorPrimary">@color/purple</item>
</style>
```
Here, `textColor`,`clickable` are view attributes. These are attributes of view, that you can
directly mention in the view's xml definition. `colorSurface`, `colorPrimary` are theme attributes.
These are not tied up to any view, and have zero effect if you mention this in view's xml definition.

Think of it this way. Let's look at a xml layout of a Chip to clearly understand Theme attributes and
View attributes.
```
<com.google.android.material.chip.Chip xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content" 
    android:textColor="?colorPrimary" // Works; view attribute(textColor) reffering a theme attribute(colorPrimary)
    app:chipStrokeWidth="1dp"    // Works; chipStrokeWidth is a view attribute
    app:colorPrimary="@color/white"    // Doesn't Work; colorPrimary is a theme attribute 
/>
```
Looking at above you will understand the difference between View and Theme attributes. The only way to set a value
for a Theme attribute is via themes. Styles should only contain view attributes and theme should only contain theme attributes.

<h3>Specific View / Context or View</h3>
A style can only be applied to a View, via the `style="@style/Widget.App.Chip"`. A theme
on the other hand can be applied to a View via `android:theme="@style/ThemeOverlay.Lable.Red"`, to an
activity in the AndroidManifest file, or to the entire application. Programatically, you
can apply Theme to a context using `ContextThemeWrapper`.

<h3>Doesn't inherit / Supports inheritance</h3>
**Style**
```xml
<ViewGroup style="@style/Widget.App.ViewGroup">
    <View/>
</ViewGroup>
```
Here, the style is applied only to the ViewGroup and the View is not impacted by the style in anyways.<br>
**Theme**
```xml
<ViewGroup android:theme="@style/ThemeOverlay.App.Red">
    <View android:theme="@style/ThemeOverlay.App.Round"/>
</ViewGroup>
```
Here, the View inherits the `Red` theme and on top of it applies the `Round` theme.
If the same theme attribute is present in both the `Red` and `Round` theme, then `Round`
theme takes effect.

<h2>Organizing Styles & Themes</h2>
Normally we add everything to `styles.xml` file, be it styles or themes. This causes confusion, and
to avoid this we have different files for different entities.
<br><br>
`styles.xml` - Contains all Styles, i.e, anything that starts with `Widget.xxxx`<br>
`themes.xml` - Contains all Themes, i.e, anything that starts with `Theme.xxxx` or 
`ThemeOverlay.xxxx`<br>
`shape.xml` - Contains all ShapeAppearances, i.e, anything that starts with `ShapeAppearace.xxxx`<br>
`text.xml` - Contains all TextAppearances, i.e, anything that starts with `TextAppearances.xxxx`<br>
<br>
Naming convention is critical to differentiate styles, themes, shapeAppearances, etc... Every style starts
with `Widget.App.xxxx` and for themes it's `Theme.App.xxxx` or `ThemeOverlay.App.xxxx`. This is mainly to
avoid accidental usage of a Theme instead of a Style, or vice versa. We can have a custom Lint rule to check this, if needed.
The same goes for ShapeAppearances and TextAppearances.<br>
Having all these separated also helps in reuse. For instance, the same ShapeAppearance can be applied for different material 
components via themes.<br>
Another important usage of this organizational structure is to keep things small and definite. For instance, any app 
should have a limited number of TextStyles and we can define all the variations in `text.xml` and make the file 
effectively readonly.Thus, developers won't be adding any new text styles and will only use the predefined ones.

<h2>Applying Material Themes</h2>
Our app is a legacy app and this the first time we are introducing Material components and Material theming. So the first
step is to replace our AppCompat theme with the Material ones.
- Use the Bridge variant of Material Theme so that you can control each material component instead of impacting all components
of the application. This is only when you have to migrate from AppCompat to Material. If you are writing a new app, please do not
  use the Bridge variant.
- Let's take the case of `Chip` and customize it via themes. In you base application theme, add the below item:
```xml
<item name="chipStyle">@style/Theme.App.Base.Chip</item>
```
The definition of `Theme.App.Base.Chip` would be something like:
```xml
<style name="Theme.App.Base.Chip" parent="Widget.MaterialComponents.Chip.Choice">
    <item name="shapeAppearance">@style/ShapeAppearance.Base.SmallComponent</item>
    <item name="shapeAppearanceOverlay">@null</item>
    <item name="android:textAppearance">@style/TextAppearance.Medium.Subtitle2</item>
    <item name="android:textColor">?colorPrimary</item>
    <item name="android:clickable">false</item>
    <item name="android:checkable">false</item>
    <item name="chipMinTouchTargetSize">0dp</item>
    <item name="chipBackgroundColor">?colorSurface</item>
</style>
```
- Once you add this, all `Chip` in your App would pick this Style. So choose a good default style. Later if you want to customize
some `Chip`, you can always apply Style at any level, may be something like this:
```xml
<style name="Theme.App.Base.Chip.Tags">
    <item name="chipStrokeWidth">1dp</item>
    <item name="textStartPadding">12dp</item>
    <item name="textEndPadding">12dp</item>
    <item name="chipStartPadding">0dp</item>
    <item name="chipEndPadding">0dp</item>
</style>
```
- You will notice that Color, Shape and Text are not hardcoded in the styles but are referred via themes. So you can use the
same style, but can customize the appearance via themes. In the above case, you just have to set two different themes setting `colorPrimary`
and `colorSurface` to support Normal/Dark mode. You don't have to change the layout or the style, but just the theme.
  
