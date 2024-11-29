class Wave {
  constructor(inputtedWaveNumber, inputtedStartTime) {
    this.enemyList = []; // Replacing `enemy_list`
    this.waveNumber = inputtedWaveNumber; // Initialize wave number
    this.waveStart = inputtedStartTime; // Initialize start time
    this.reward = true;

    // Populate the enemy list
    for (let i = 0; i < this.waveNumber * 10; i++) {
      let rX = 100 + Math.random() * 600; // JavaScript's random number equivalent
      this.enemyList.push(new Eye(rX, 0)); // Add new Eye instances
    }
  }

  updateEnemies(inputtedX, inputtedY) {
    let dead = []; // List to store "dead" enemies

    // Iterate through all enemies
    for (let e of this.enemyList) {
      e.setActive(true);
      e.updateStatus(inputtedX, inputtedY);
      e.move();
      e.display();

      // Check if the enemy is dead
      if (e.isDead()) {
        dead.push(e); // Add to dead list
        e.kill();
      }
    }

    // Remove all dead enemies from the enemy list
    this.enemyList = this.enemyList.filter(e => !dead.includes(e));
  }

  isStarted() {
    return currentGameTime() >= this.waveStart; // Simplified comparison
  }

  isFinished() {
    if (this.enemyList.length === 0) {
      if (this.reward) {
        player.fuel = player.fuelMax;
        player.health = player.healthMax;
        this.reward = false;
      }
      return true;
    } else {
      return false;
    }
  }

  getWaveSize() {
    return this.enemyList.length; // Return the number of enemies
  }

  getWaveNumber() {
    return this.waveNumber; // Return the wave number
  }

  getEnemyList() {
    return this.enemyList; // Return the list of enemies
  }

  getStartTime() {
    return (this.waveStart - currentGameTime()) / 1000; // Return the start time in seconds
  }
}