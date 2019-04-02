---
layout: post
title: "Making Terminal awesome in MacOS"
---
How are we going to make `Terminal` awesome? Using [Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh) 
of course. Now, I know there are countless blogs written on this topic, but I just wanted to make a
personal note of this so that the next time I change my computer, I don't forget. So here goes.

1. Install `Zsh` if you don't have one. Follow [this](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH).
2. Make `Zsh` your default shell.<br>
-- Do this:
`chsh -s $(which zsh)` <br>
-- Ensure you have your Terminal pointing to `Default login shell`. _Preferences | General | Shells open with_ <br>
-- Restart Terminal
3. Install `Oh My Zsh`. Follow [this](https://github.com/robbyrussell/oh-my-zsh). But essentially you 
need to do this: <br>
`sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
4. A `.zshrc` file will be created under _/Users/XXXXXXX_ . Just like `.bash_profile` is for bash, `.zshrc`
is for zsh.<br>
-- Open the file<br>
-- Uncomment `export PATH=$HOME/bin:/usr/local/bin:$PATH` <br>
-- Set `ZSH_THEME="agnoster"` <br>
5. For `agnoster` to work properly you need to install Powerline fonts as mentioned [here](https://github.com/powerline/fonts).
There are many fonts to choose from, but I choose Meslo LG L DZ.
6. Oh My Zsh doesn't have the auto suggestion plugin installed by default. So you need to install that
using [this](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md)
7. Your .zshrc file should have something like this:
    ```$xslt
    plugins=(
      git
      zsh-autosuggestions
      gradle
    )
    ```
8. Now when you open the Terminal, you many not like it at first instant due to some character missing (because of
improper font) or the awkward color scheme. I have customised the color and you can import my [settings](/assets/ohMyZsh/Custom.terminal).<br>
I have chosen a lighter color scheme.<br>
![Color Scheme](/assets/ohMyZsh/terminal-color-scheme.png)
9. There you go. Enjoy your awesome Terminal.

<br><br>
Note: If you are using IntelliJ iDEA, then this will reflect in that as well. Just ensure you do these things:<br>
-- Preferences | Tools | Terminal | Shell path = bin/zsh <br>
-- Preferences | Editor | Color Scheme | Console Font | Font = Meslo LG L DZ <br>
-- Preferences | Editor | Color Scheme | Console Colors | Import Scheme = [profile](/assets/ohMyZsh/Intellij.icls)