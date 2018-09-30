
function getNextColorClass() {
    var themePrefix = "theme-base-"
    var colors = ['08', // Red
                  '09', // Orange
                  '0b', // Green
                  '0c', // Cyan
                  '0d', // Blue
                  '0e', // Magenta
                  '0f', // Brown
    ];

    var currentClass = document.body.className
    var randomColor = Math.floor((Math.random() * colors.length));
    var currentColor = currentClass.slice(-2);
    var currentIndex = colors.indexOf(currentColor); // -1 if no color class
    // var nextIndex = (currentIndex == colors.length ? 0 : currentIndex + 1);
    nextIndex = randomColor;
    var nextColor = colors[nextIndex];
    var nextClass;
    if (nextColor) {
        nextClass = themePrefix + nextColor;
    } else {
        nextClass = ""
    }
    console.log(currentClass, " to ", nextClass);
    console.log("Random = ", randomColor);
    return nextClass;
}

function updateColor() {
    var nextClass = getNextColorClass();
    document.body.className = nextClass;
    console.log("Changed color.")
}

window.onload = updateColor;