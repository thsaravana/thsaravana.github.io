---
layout: post
title: "Hiding the Clock in Momentum chrome extension"
---
[Momentum](https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=en) is a 
good chrome extension if you are looking to replace the new tab page with a personal dashboard featuring 
to-do, weather, and inspiration (as they say). I am into it because of the marvelous and calming background 
photos. Now you would naturally think that there would be an option to hide individual elements like the clock,
greeting message, to-do, etc... And you can, except for the clock and the greeting (as of this writing). 
If you are like me and you don't care for the clock or the "Good Morning" greeting, then you need to get 
your hands dirty to make them go away. This blog is all about that.

1. Figure out where the chrome extensions are stored in your computer. I use a Mac and it's under 
`/Users/xxxxxxxxx/Library/Application Support/Google/Chrome/Default/Extensions`
2. Go to `chrome://extensions` and find the `ID` of the Momentum extension
3. Under the `Extensions` folder, open the folder corresponding to the `ID` and navigate your way to `css/style.min.css`
4. Edit that file to add the following lines:
    ```css
    #centerclock { display: none; }
    #greeting { display: none; }
    ```
5. Save it and restart Chrome
6. Now enjoy the background in peace