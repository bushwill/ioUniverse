class CollisionEntity {
  constructor(inputtedX, inputtedY, inputtedSize, inputtedHealth, inputtedProtection) {
    this.x = inputtedX;
    this.y = inputtedY;
    this.size = inputtedSize;
    this.initHealth(inputtedHealth);
    this.protection = inputtedProtection;
    this.protectionTime = millis(); // Assuming a `millis()` function is available
    this.collideLeft = false;
    this.collideRight = false;
    this.collideUp = false;
    this.collideDown = false;
    this.active = false; // Initial state of the entity
  }

  initHealth(inputtedHealth) {
    this.health = inputtedHealth;
    this.healthMax = inputtedHealth;
  }

  isProtected() {
    return millis() < this.protectionTime - this.protection;
  }

  handleDamage(damage) {
    if (millis() > this.protectionTime) {
      this.health -= damage;
      this.protectionTime = millis() + this.protection;
    }
  }

  handleCollision(collide) {
    this.handleDamage(collide.getSize());
  }

  isDead() {
    return this.health <= 0;
  }

  kill() {}

  setCollideLeft(inputtedCollide) {
    this.collideLeft = inputtedCollide;
  }

  setCollideRight(inputtedCollide) {
    this.collideRight = inputtedCollide;
  }

  setCollideUp(inputtedCollide) {
    this.collideUp = inputtedCollide;
  }

  setCollideDown(inputtedCollide) {
    this.collideDown = inputtedCollide;
  }

  resetCollide() {
    this.collideLeft = false;
    this.collideRight = false;
    this.collideUp = false;
    this.collideDown = false;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getSize() {
    return this.size;
  }

  getSpeed() {
    return this.speed;
  }

  getDeathMessage() {
    return this.deathMessage;
  }

  setDeathMessage(inputtedMessage) {
    this.deathMessage = inputtedMessage;
  }

  isActive() {
    return this.active;
  }

  setActive(inputtedActive) {
    this.active = inputtedActive;
  }

  display() {
    // Placeholder for subclasses
  }
}

class CollisionEngine {
  constructor() {}

  update() {
    let entityList = [];

    // Add enemies from the current wave to the entity list
    if (waves.length > 0) {
      entityList.push(...waves[waves.length - 1].getEnemyList());
    }

    // Add the player to the entity list
    entityList.push(player);

    // Check collisions between entities
    for (let i = 0; i < entityList.length; i++) {
      let e1 = entityList[i];
      e1.resetCollide();

      for (let j = i + 1; j < entityList.length; j++) {
        let e2 = entityList[j];
        if (e1.isActive() && e2.isActive()) {
          this.handleCollision(e1, e2);
        }
      }
    }
  }

  handleCollision(e1, e2) {
    let xDist = e2.getX() - e1.getX();
    let yDist = e2.getY() - e1.getY();

    // Right collision
    if (
      xDist >= 0 &&
      Math.abs(xDist) <= e1.getSize() / 2 + e2.getSize() / 2 &&
      Math.abs(yDist) <= e1.getSize() / 2 + e2.getSize() / 2
    ) {
      e1.setCollideRight(true);
      e2.setCollideLeft(true);
      e1.handleCollision(e2);
      e2.handleCollision(e1);
    }

    // Left collision
    if (
      xDist < 0 &&
      Math.abs(xDist) <= e1.getSize() / 2 + e2.getSize() / 2 &&
      Math.abs(yDist) <= e1.getSize() / 2 + e2.getSize() / 2
    ) {
      e1.setCollideLeft(true);
      e2.setCollideRight(true);
      e1.handleCollision(e2);
      e2.handleCollision(e1);
    }

    // Down collision
    if (
      yDist >= 0 &&
      Math.abs(xDist) <= e1.getSize() / 2 + e2.getSize() / 2 &&
      Math.abs(yDist) <= e1.getSize() / 2 + e2.getSize() / 2
    ) {
      e1.setCollideDown(true);
      e2.setCollideUp(true);
      e1.handleCollision(e2);
      e2.handleCollision(e1);
    }

    // Up collision
    if (
      yDist < 0 &&
      Math.abs(xDist) <= e1.getSize() / 2 + e2.getSize() / 2 &&
      Math.abs(yDist) <= e1.getSize() / 2 + e2.getSize() / 2
    ) {
      e1.setCollideUp(true);
      e2.setCollideDown(true);
      e1.handleCollision(e2);
      e2.handleCollision(e1);
    }
  }
}