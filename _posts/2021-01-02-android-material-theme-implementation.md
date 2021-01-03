---
layout: post
title: "How we applied material theming in our app"
---

1. Styles vs Themes
2. Organizing Themes
3. Applying Themes

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
<h4>Style</h4>
```xml
<style name="Widget.App.Chip" parent="Widget.MaterialComponents.Chip.Choice">
    <item name="chipStrokeWidth">1dp</item>
    <item name="android:textColor">?colorPrimary</item>
    <item name="android:clickable">false</item>
</style>
```
<h4>Theme</h4>
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
Styles should only contain view attributes and theme should only contain theme attributes.

<h3>Specific View / Context or View</h3>
A style can only be applied to a View, via the `style="@style/Widget.App.Chip"`. A theme
on the other hand can be applied to a View via `android:theme="@style/ThemeOverlay.Lable.Red"`, to an
activity in the AndroidManifest file, or to the entire application. Programatically, you
can apply Theme to a context using `ContextThemeWrapper`.

<h3>Doesn't inherit / Supports inheritance</h3>
<h4>Style</h4>
```xml
<ViewGroup style="@style/Widget.App.ViewGroup">
    <View/>
</ViewGroup>
```
Here, the style is applied only to the ViewGroup and the View is not impacted by the style in anyways.
<h4>Theme</h4>
```xml
<ViewGroup android:theme="@style/ThemeOverlay.App.Red">
    <View android:theme="@style/ThemeOverlay.App.Round"/>
</ViewGroup>
```
Here, the View inherits the `Red` theme and on top of it applies the `Round` theme.
If the same theme attribute is present in both the `Red` and `Round` theme, then `Round`
theme takes effect.

*TBD*