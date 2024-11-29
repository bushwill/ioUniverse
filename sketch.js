function setup() {
  createCanvas(windowWidth, windowHeight); 
  background(255); 
}

function draw() {
  if (mouseIsPressed) { 
    let r = random(255);
    let g = random(255);
    let b = random(255);

    fill(r, g, b); 
    noStroke(); 
    ellipse(mouseX, mouseY, 50, 50); 
  }
}
