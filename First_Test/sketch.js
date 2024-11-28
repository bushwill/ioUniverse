function setup() {
  createCanvas(windowWidth, windowHeight); // Set the canvas size to 800x600
  background(200); // Set the background color to light gray
}

function draw() {
  if (mouseIsPressed) { // Check if the mouse button is pressed
    // Generate a random color
    let r = random(255);
    let g = random(255);
    let b = random(255);

    fill(r, g, b); // Set the fill color
    noStroke(); // Remove the outline of the circle
    ellipse(mouseX, mouseY, 50, 50); // Draw a circle at the mouse position
  }
}
