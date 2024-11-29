class Player {
    constructor(x, y, r, g, b){
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.targetX = x;
        this.targetY = y;
        this.colour = new RGB();
    }

    updateMovement() {}
    updateStatus() {}
    display() {
        rectMode(CENTER);
        fill(this.colour.r, this.colour.g, this.colour.b);
        square(this.x, this.y, 10);
    }
}