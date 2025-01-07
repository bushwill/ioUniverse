let enteredUsername = "";
let signedIn = false;
let selectedColor = false;
let mousePressX, mousePressY;
let loginError = "";



function displayLoginPage() {
    rectMode(CENTER);
    stroke(0);
    fill(0, 0, 0);
    textSize(32);
    text("Login Page", windowWidth * 0.5, windowHeight * 0.1);
    textSize(24);
    text("Press Enter to login", windowWidth * 0.5, windowHeight * 0.1 + 30);
    text("Type your Username: ", windowWidth * 0.5, windowHeight * 0.2);
    text(enteredUsername, windowWidth * 0.5, windowHeight * 0.2 + 30);
    text("Press enter to log in!", windowWidth * 0.5, windowHeight * 0.8);

    if (loginError) {
        fill(255, 0, 0);
        textSize(18);
        text(loginError, windowWidth * 0.5, windowHeight * 0.3);
    }

    noStroke();
    for (let x = 0; x < 255; x++) {
        for (let y = 0; y < 255; y++) {
            fill(x, 255 - x, y);
            square((windowWidth * 0.5) - 120 + x, (windowHeight * 0.5) - 120 + y, 10);
        }
    }
    stroke(0);
    if (!selectedColor && (windowWidth * 0.5) - 120 < mouseX && mouseX < (windowWidth * 0.5) - 120 + 255 && (windowHeight * 0.5) - 120 < mouseY && mouseY < (windowHeight * 0.5) + 255) {
        fill(mouseX - (windowWidth * 0.5) + 120, 255 - (mouseX - (windowWidth * 0.5) + 120), mouseY - (windowHeight * 0.5) + 120);
        square(mouseX, mouseY, 10);
    } else if (selectedColor) {
        fill(mousePressX - (windowWidth * 0.5) + 120, 255 - (mousePressX - (windowWidth * 0.5) + 120), mousePressY - (windowHeight * 0.5) + 120);
        square(mousePressX, mousePressY, 10);
    }
}

function displayLoginError(message) {
    loginError = message;
    console.error(message);

    setTimeout(() => {
        if (loginError === "Joining..." && !signedIn) {
            loginError = "Try again later";
        } else if (loginError != "You were kicked for inactivity") loginError = "";
    }, 10000);
}
