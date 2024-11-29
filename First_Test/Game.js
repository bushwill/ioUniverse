let r = Math.random; // JavaScript's built-in random number generator

let player = new Player();
let collisionEngine = new CollisionEngine();

let waterParticles = [];
let flameParticles = [];
let generalParticles = [];
let waves = [];

let fuelPickups = new Map();
let abilityPickups = new Map();

let gameStart = 0;
let pause = false;
let pauseTime = 0;
let slow = false;
let slowOffset = false;

function setup() {
  createCanvas(800, 800);
  textSize(16);
  gameStart = millis();
  noCursor();
}

function draw() {
  updateGame();
}

function updateGame() {
  if (player.isDead()) {
    pause = true;
    background(0);
    displayFlameParticles();
    displayGeneralParticles();
    displayCharacter();
    fill(255, 0, 0);
    textSize(32);
    text(player.deathMessage, 200, 400);
    rect(400, 400, 200, 50);
  }

  if (!pause) {
    drawEnvironment();
    updatePlayer();
    updatePlayerMovement();
    applyPlayerGravity();
    applyPlayerDrag();
    pickups();
    displayScoreboard();
    displayWaterParticles();
    displayFlameParticles();
    displayGeneralParticles();
    updateCollisionEngine();
    updateWaves();
    displayCharacter();
  }

  if (pause && !player.isDead()) {
    displayPauseMenu();
  }

  displayCursor();
}

function drawEnvironment() {
  rectMode(CORNER);
  stroke(0);
  strokeWeight(1);
  background(110, 155, 255);
  fill(50, 70, 255);
  rect(0, 600, 800, 200);
}

function displayCursor() {
  rectMode(CENTER);
  stroke(0);
  strokeWeight(1);
  fill(255);
  square(mouseX, mouseY, 10);
}

function displayPauseMenu() {
  fill(150);
  rectMode(CENTER);
  background(0);
  rect(400, 400, 700, 600);
  textSize(32);
  fill(0);
  text("Game Paused", 200, 150);
}

function updatePlayer() {
  player.updateStatus();
  player.updatePosition();
}

function updatePlayerMovement() {
  player.handleMovement();
}

function displayCharacter() {
  player.display();
}

function applyPlayerGravity() {
  if (!(player.inWater || player.flying)) {
    if (player.vy < 10) {
      player.vy += 0.2;
    }
  }
}

function applyPlayerDrag() {
  if (player.inWater) {
    player.vx *= 0.8;
    player.vy *= 0.8;
  } else {
    player.vx *= 0.98;
  }
}

function createWaterParticle(x, y, size) {
  waterParticles.push(new Particle(x, y, size, 80, 110, 255));
}

function displayWaterParticles() {
  let found = [];
  for (let p of waterParticles) {
    p.display();
    if (p.decay()) found.push(p);
  }
  waterParticles = waterParticles.filter(p => !found.includes(p));
}

function createFlameParticle(x, y, size) {
  flameParticles.push(new Particle(x, y, size, 255, player.fuel * 2, 0));
}

function displayFlameParticles() {
  let found = [];
  for (let p of flameParticles) {
    p.display();
    if (p.decay()) found.push(p);
  }
  flameParticles = flameParticles.filter(p => !found.includes(p));
}

function createCircleBurst(r, g, b, n, x, y) {
  let p = Math.min(n, 10);
  for (let i = 0; i < p; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random(1)) * n;
    let rx = x + radius * cos(angle);
    let ry = y + radius * sin(angle);
    generalParticles.push(new Particle(rx, ry, 5, r, g, b));
  }
}

function displayGeneralParticles() {
  let found = [];
  for (let p of generalParticles) {
    p.display();
    if (p.decay()) found.push(p);
  }
  generalParticles = generalParticles.filter(p => !found.includes(p));
}

function updateCollisionEngine() {
  collisionEngine.update();
}

function updateWaves() {
  if (waves.length === 0) {
    waves.push(new Wave(1, currentGameTime() + 2000));
  } else {
    let currentWave = waves[waves.length - 1];
    if (currentWave.isFinished()) {
      waves.push(new Wave(waves.length + 1, currentGameTime() + 2000));
    } else if (currentWave.isStarted()) {
      currentWave.updateEnemies(player.getX(), player.getY());
    }
  }
}

function pickups() {
  stroke(0);
  strokeWeight(1);

  // Add a fuel pickup if fuel is empty
  if (player.fuel <= 0 && fuelPickups.size === 0) {
    let rx = random(20, 780);
    let ry = random(600, 780);
    fuelPickups.set([rx, ry], 50);
  }

  // Display all fuel pickups
  rectMode(CENTER);
  for (let [item, pickupValue] of fuelPickups.entries()) {
    let [x, y] = item;
    fill(255, 200, 0);
    rect(x, y, 20, 40);
    createCircleBurst(255, 200, 0, 20, x, y);

    // Display reflection of the pickup
    if (y < 600) {
      fill(150, 160, 30);
      rect(x, (600 - y) + 600, 20, 40);
    }

    // Check if the player picks up the fuel
    if (abs(player.x - x) < 10 && abs(player.y - y) < 20) {
      player.fuel += pickupValue;
      fuelPickups.delete(item);
      break;
    }
  }

  // Display all ability pickups
  for (let [item, type] of abilityPickups.entries()) {
    let [x, y] = item;

    // Teleport ability
    if (type === 1) {
      fill(175, 50, 160);
      circle(x, y, 30);
      createCircleBurst(175, 50, 160, 20, x, y);

      // Display reflection of the pickup
      if (y < 600) {
        fill(140, 20, 150);
        circle(x, (600 - y) + 600, 30);
      }

      // Check if the player picks up the ability
      if (abs(player.getX() - x) < 15 && abs(player.getY() - y) < 15) {
        player.teleportMode = true;
        player.tpCooldown = 100;
        abilityPickups.delete(item);
        break;
      }
    }
  }
}

function currentGameTime() {
  return millis() - gameStart - pauseTime;
}

function millis() {
  return Date.now();
}

function restartGame() {
  player = new Player();
  gameStart = currentGameTime();
  pause = false;
  waves = [];
}

function displayScoreboard() {
  fill(0);
  textSize(16);

  if (waves.length > 0) {
    let currentWave = waves[waves.length - 1];

    text(`Wave: ${currentWave.getWaveNumber()}`, 10, 15);

    if (currentWave.isStarted()) {
      text(`Enemies remaining: ${currentWave.getWaveSize()}`, 10, 30);
    } else {
      text(`Wave starts in ${currentWave.getStartTime()}s`, 10, 30);
    }
  }

  if (currentGameTime() < 10000) {
    text("Press 'p' to pause game", 630, 20);
  }
}

function keyPressed() {
  if (!pause) {
    if (key === ' ') player.flyingMode = !player.flyingMode;
    if (key === 't') player.teleport(mouseX, mouseY);
  }
  if (key === 'p') {
    pause = !pause;
    pauseTime = currentGameTime();
  }
}

function mousePressed() {
  if (!pause) {
    if (mouseButton === LEFT) {
      player.dash(mouseX, mouseY);
    }
  } else if (pause && player.isDead()) {
    if (mouseButton === LEFT) {
      if (300 <= mouseX && mouseX <= 500 && 375 <= mouseY && mouseY <= 425) {
        restartGame();
      }
    }
  }
}