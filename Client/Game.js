let r = Math.random;
let players = [];
let particles = [];

function setup() {
    rectMode(CENTER);
    stroke(0);
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(60, 150, 255);
    displayParticles();
    updatePlayers();
    displayPlayers();
}

function createParticle(x, y, size, r, g, b) {
    particles.push(new Particle(x, y, size, r, g, b));
  }
  
  function displayParticles() {
    let found = [];
    for (let p of particles) {
      p.display();
      if (p.decay()) found.push(p);
    }
    particles = particles.filter(p => !found.includes(p));
  }

function updatePlayers() {
    for (let p of players) {
        p.updateStatus(mouseX, mouseY);
        p.updateMovement();
    }
}

function displayPlayers() {
    for (let p of players) {
        p.display();
    }
}

function keyPressed() {
    if (key === 'c') {
        players.push(new Player(windowWidth/2, windowHeight/2, 0, 255, 0))
    }
}