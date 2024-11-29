class Enemy extends CollisionEntity {
  constructor(inputtedX, inputtedY, inputtedSize, inputtedHealth, inputtedProtection) {
    super(inputtedX, inputtedY, inputtedSize, inputtedHealth, inputtedProtection);
    this.targetX = 0;
    this.targetY = 0;
    this.vx = 0;
    this.vy = 0;
    this.active = false; // Indicates if the enemy is active
  }

  move() {
    // Placeholder for subclasses to implement
  }

  updateStatus(inputtedTargetX, inputtedTargetY) {
    // Update movement
    this.x += this.vx;
    this.y += this.vy;

    // Update target
    this.targetX = inputtedTargetX;
    this.targetY = inputtedTargetY;

    // Update speed
    this.speed = Math.abs(this.vx) + Math.abs(this.vy);
  }
}

class Eye extends Enemy {
  constructor(inputtedX, inputtedY) {
    super(inputtedX, inputtedY, 20, 5, 100); // Pass parameters to the Enemy constructor
  }

  move() {
    const xDif = Math.abs(this.targetX - this.x);
    const yDif = Math.abs(this.targetY - this.y);
    const xSpeed = xDif / (xDif + yDif);
    const ySpeed = yDif / (xDif + yDif);

    // Horizontal movement
    if (this.targetX > this.x && !this.collideRight) {
      if (this.vx < 2 * xSpeed) this.vx += 0.1;
    } else if (this.targetX < this.x && !this.collideLeft) {
      if (this.vx > -2 * xSpeed) this.vx -= 0.1;
    }

    // Vertical movement
    if (this.targetY > this.y && !this.collideDown) {
      if (this.vy < 2 * ySpeed) this.vy += 0.1;
    } else if (this.targetY < this.y && !this.collideUp) {
      if (this.vy > -2 * ySpeed) this.vy -= 0.1;
    }
  }

  handleCollision(e) {
    if (!(e instanceof Enemy)) {
      if (!e.isProtected() && e.getSpeed() < 5) {
        e.handleDamage(this.size);
        e.setDeathMessage("You were killed by a Floating Eye");
      }
    }
  }

  display() {
    stroke(0);
    fill(255, 0, 0);
    circle(this.x, this.y, 20); // Outer red circle
    fill(255);
    circle(this.x, this.y, 14); // Inner white circle
    fill(0);
    circle(this.x, this.y, 6); // Small black pupil

    // Display health bar if damaged
    if (this.health < this.healthMax) {
      noFill();
      stroke(200, 50, 50);
      arc(this.x, this.y, 30, 30, Math.PI, Math.PI + Math.PI * (this.health / this.healthMax));
    }
  }

  kill() {
    createCircleBurst(255, 0, 0, 20, this.x, this.y); // Red burst
    createCircleBurst(255, 255, 255, 15, this.x, this.y); // White burst
    createCircleBurst(0, 0, 0, 10, this.x, this.y); // Black burst
  }
}