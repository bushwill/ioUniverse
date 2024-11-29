class Player {
    constructor(x, y, r, g, b) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.targetX = x;
        this.targetY = y;
        this.colour = new RGB(r, g, b);
    }

    updateMovement() {
        this.x += this.vx;
        this.y += this.vy;
        this.handleFlying();
    }

    updateStatus(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.speed = abs(this.vx) + abs(this.vy)
    }

    handleFlying() {
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
            createParticle(r_x, r_y, 10, 255, 165, 0);
        }
        else {
            for (let i = 0; i < this.speed; i++) {
                let r_x = (this.x - this.speed) + r() * ((this.x + this.speed) - (this.x - this.speed));
                let r_y = (this.y - this.speed) + r() * ((this.y + this.speed) - (this.y - this.speed));
                createParticle(r_x, r_y, 10, 255, 165, 0);
            }
        }
    }

    display() {
        fill(this.colour.r, this.colour.g, this.colour.b);
        square(this.x, this.y, 10);
    }
}