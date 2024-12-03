let players = []; // To store retrieved player locations

function setup() {
    rectMode(CENTER);
    stroke(0);
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(60, 150, 255);
    fill(0, 255, 50);
    circle(mouseX, mouseY, 20); 
}