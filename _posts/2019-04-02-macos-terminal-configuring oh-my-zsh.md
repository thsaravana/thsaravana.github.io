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
-- Ensure you have your Terminal pointing to `Default login shell`. _Preferences->General->Shells open with_ <br>
-- Restart Terminal
3. Install `Oh My Zsh`. Follow [this](https://github.com/robbyrussell/oh-my-zsh). But essentially you 
need to do this: <br>
`sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
