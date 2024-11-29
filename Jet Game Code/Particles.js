class Particle {
  constructor(inputtedX, inputtedY, inputtedSize, inputtedR, inputtedG, inputtedB) {
    this.x = inputtedX;
    this.y = inputtedY;
    this.size = inputtedSize;
    this.colour = new RGB(inputtedR, inputtedG, inputtedB);
  }

  decay() {
    if (this.size > 0) {
      this.size -= 0.5;
      return false;
    } else {
      this.size = 0;
      return true;
    }
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

  setX(inputtedX) {
    this.x = inputtedX;
  }

  setY(inputtedY) {
    this.y = inputtedY;
  }

  setSize(inputtedSize) {
    this.size = inputtedSize;
  }

  getColour() {
    return this.colour;
  }

  setColour(inputtedR, inputtedG, inputtedB) {
    this.colour.change(inputtedR, inputtedG, inputtedB);
  }

  display() {
    const r = this.colour.r;
    const g = this.colour.g;
    const b = this.colour.b;

    fill(r, g, b); // Assuming this is a function from a graphics library
    circle(this.x, this.y, this.size); // Draw the particle

    if (this.y < 600) {
      fill(r * 0.75, g * 0.9, b); // Slightly altered color
      circle(this.x, (600 - this.y) + 600, this.size); // Mirrored circle
    }
  }
}