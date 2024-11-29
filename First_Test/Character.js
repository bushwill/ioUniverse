class Player extends CollisionEntity {
  constructor() {
    super(400, 100, 10, 100, 333);
    this.vx = 0;
    this.vy = 0;
    this.targetX = 400;
    this.targetY = 150;
    this.level = 1;
    this.knockback = 10;
    this.fuel = 100;
    this.fuelMax = 100;
    this.speed = 0;
    this.inWater = false;
    this.swimming = false;
    this.flyingMode = true;
    this.flying = true;
    this.assistMode = false;
    this.teleportMode = true;
    this.tpCooldown = 100;
    this.active = true;
  }

  display() {
    this.displayTarget();
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    if (this.y < 600) {
      fill(75, 160, 150);
      square(this.x, (600 - this.y) + 600, 10);
    }
    fill(0, 255, 0);
    square(this.x, this.y, 10);
  }

  handleMovement() {
    this.updateTarget();
    this.handleSwimming();
    this.handleFlying();
  }

  updatePosition() {
    if (this.x > 800) {
      this.vx = 0;
      this.x = 800;
    } else if (this.x < 0) {
      this.vx = 0;
      this.x = 0;
    }
    if (this.y > 800) {
      this.vy = 0;
      this.y = 800;
    } else if (this.y < 0) {
      this.vy = 0;
      this.y = 0;
    }
    this.x += this.vx;
    this.y += this.vy;
  }

  dash(inputtedX, inputtedY) {
    if (this.fuel > 10) {
      const xDif = Math.abs(inputtedX - this.x);
      const yDif = Math.abs(inputtedY - this.y);
      const dashSpeed = 20;
      this.vx = inputtedX < this.x ? -dashSpeed * (xDif / (xDif + yDif)) : dashSpeed * (xDif / (xDif + yDif));
      this.vy = inputtedY < this.y ? -dashSpeed * (yDif / (yDif + xDif)) : dashSpeed * (yDif / (yDif + xDif));
      this.fuel -= 10;
    }
  }

  teleport(inputtedX, inputtedY) {
    if (this.teleportMode && this.tpCooldown === 100) {
      this.x = inputtedX;
      this.y = inputtedY;
      createCircleBurst(175, 50, 160, 20, inputtedX, inputtedY);
      this.tpCooldown = 0;
    }
  }

  updateStatus() {
    // Update fuel
    if (this.flying) {
      // this.fuel -= ((Math.abs(this.vx) / 100) + 0.05) - (this.vy / 100);
    } else if (this.inWater && this.fuel < this.fuelMax) {
      this.fuel += 0.01 * this.level;
    }
    this.fuel = Math.max(0, Math.min(this.fuel, this.fuelMax));

    // Update speed
    this.speed = Math.abs(this.vx) + Math.abs(this.vy);

    // Update health
    this.health = Math.max(0, Math.min(this.health, this.healthMax));

    // Update teleport cooldown
    if (this.teleportMode && this.tpCooldown <= 99.5) this.tpCooldown += 0.5;
    this.tpCooldown = Math.min(this.tpCooldown, 100);

    // Update statuses
    this.inWater = this.y >= 600;
    this.swimming = Math.abs(this.vx) < 2 && Math.abs(this.vy) < 2 && this.inWater;
    this.flying = this.flyingMode && this.fuel > 0 && !(this.inWater || this.swimming);
  }

  updateTarget() {
    this.targetX = mouseX;
    this.targetY = mouseY;
  }

  displayTarget() {
    this.displayStatus();
  }

  displayStatus() {
    noFill();
    strokeWeight(2);

    // Display fuel arc
    stroke(255, (this.fuel / this.fuelMax) * 200, 0);
    arc(this.targetX, this.targetY, 100, 100, 0, Math.PI * (this.fuel / this.fuelMax));

    // Display health arc
    stroke(200 - (this.health / this.healthMax) * 200, (this.health / this.healthMax) * 200, 50);
    arc(this.targetX, this.targetY, 100, 100, Math.PI, Math.PI + Math.PI * (this.health / this.healthMax));

    // Display speed arc
    stroke(50, 75, 255);
    arc(this.targetX, this.targetY, 110, 110, Math.PI, Math.PI + Math.PI * (this.speed / 20));

    // Display teleport cooldown arc
    if (this.teleportMode) {
      stroke(255, 0, 200);
      arc(this.targetX, this.targetY, 110, 110, 0, Math.PI * (this.tpCooldown / 100));
    }
  }

  handleSwimming() {
    if (this.swimming) {
      const xDif = Math.abs(this.targetX - this.x);
      const yDif = Math.abs(this.targetY - this.y);
      const xSpeed = xDif / (xDif + yDif);
      const ySpeed = yDif / (xDif + yDif);

      if (Math.abs(this.targetX - this.x) < 5) {
        this.vx *= 0.8;
      } else if (this.targetX > this.x) {
        if (this.vx < 4 * xSpeed) this.vx += 0.2;
      } else if (this.vx > -4 * xSpeed) {
        this.vx -= 0.2;
      }

      if (Math.abs(this.targetY - this.y) < 5) {
        this.vy *= 0.8;
      } else if (this.targetY > this.y) {
        if (this.vy < 4 * ySpeed) this.vy += 0.2;
      } else if (this.vy > -4 * ySpeed) {
        this.vy -= 0.2;
      }
      if (this.inWater) {
        for (let i = 0; i< this.speed; i++) {
          let r_x = (this.x - this.speed) + r() * ((this.x+this.speed) - (this.x-this.speed));
          let r_y = (this.y - this.speed) + r() * ((this.y+this.speed) - (this.y-this.speed));
          createWaterParticle(r_x, r_y, 10);
        }
      }
    }
  }

  handleFlying() {
    if (this.flying) {
      const xDif = Math.abs(this.targetX - this.x);
      const yDif = Math.abs(this.targetY - this.y);
      const xSpeed = xDif / (xDif + yDif);
      const ySpeed = yDif / (xDif + yDif);

      if (Math.abs(this.targetX - this.x) < 3) {
        this.vx *= 0.5;
      } else if (this.targetX > this.x) {
        if (this.vx < 8 * xSpeed) this.vx += 0.2;
      } else if (this.vx > -8 * xSpeed) {
        this.vx -= 0.2;
      }

      if (Math.abs(this.targetY - this.y) < 3) {
        this.vy *= 0.5;
      } else if (this.targetY > this.y) {
        if (this.vy < 8 * ySpeed) this.vy += 0.2;
      } else if (this.vy > -8 * ySpeed) {
        this.vy -= 0.2;
      }
      if (this.speed < 2) {
        let r_x = (this.x - this.speed) + r() * ((this.x + this.speed) - (this.x - this.speed));
        let r_y = (this.y - this.speed) + r() * ((this.y + this.speed) - (this.y - this.speed));
        createFlameParticle(r_x, r_y, 10);
      }
      else {
        for (let i = 0; i < this.speed; i++) {
          let r_x = (this.x - this.speed) + r() * ((this.x + this.speed) - (this.x - this.speed));
          let r_y = (this.y - this.speed) + r() * ((this.y + this.speed) - (this.y - this.speed));
          createFlameParticle(r_x, r_y, 10);
        }
      }
    }
  }
}