function displayLoginPage() {
    rectMode(CENTER);
    stroke(0);
    fill(0, 0, 0);
    textAlign(CENTER);
    text("Login Page", windowWidth*0.5, windowHeight*0.2);
    text("Enter Username: ", windowWidth*0.5, windowHeight*0.3);
    text(enteredUsername, windowWidth*0.5, windowHeight*0.4);
}
