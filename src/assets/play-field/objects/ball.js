export default function ball(canvas, playerL, playerR, declareWinner) {
  const g = canvas.getContext('2d');

  this.xSpeed = 6;
  this.ySpeed = 0;
  this.rad = 6;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.right = true;

  this.update = () => {
    this.y += this.ySpeed;
    if (this.y + this.rad <= 3 || this.y + this.rad >= canvas.height - 3) this.ySpeed *= -1;

    if (this.right) {
      this.x += this.xSpeed;
    } else {
      this.x -= this.xSpeed;
    }

    if (this.x + this.rad > playerR.x && this.x + this.rad < playerR.x + playerR.width) {
      if (this.collideWithPlayer(playerR)) {
        this.right = false;
      } else {
        declareWinner('left');
      }
    }
    if (this.x - this.rad > playerL.x && this.x - this.rad < playerL.x + playerL.width) {
      if (this.collideWithPlayer(playerL)) {
        this.right = true;
      } else {
        declareWinner('right');
      }
    }
  };

  this.reset = () => {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.ySpeed = 0;
    this.right = !this.right;
  };

  this.collideWithPlayer = (playerClass) => {
    if (this.y > playerClass.y && this.y < playerClass.y + playerClass.height) {
      this.ySpeed = (this.y - playerClass.y - playerClass.height / 2) / 10;
      return true;
    }
    return false;
  };

  this.draw = () => {
    g.fillStyle = 'white';
    g.beginPath();
    g.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
    g.fill();
  };
}
