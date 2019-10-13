export default function ball(canvas, playerL, playerR, declareWinner) {
  const ballRadius = 6;

  this.xSpeed = 6;
  this.ySpeed = 0;
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.goingRight = true;

  this.update = (game) => {
    this.y += this.ySpeed;
    if (this.y + ballRadius <= 3 || this.y + ballRadius >= game.height - 3) this.ySpeed *= -1;

    if (this.goingRight) {
      this.x += this.xSpeed;
    } else {
      this.x -= this.xSpeed;
    }

    if (this.x + ballRadius > playerR.x && this.x + ballRadius < playerR.x + playerR.width) {
      if (this.collideWithPlayer(playerR)) {
        this.goingRight = false;
      } else {
        declareWinner('left');
      }
    }
    if (this.x - ballRadius > playerL.x && this.x - ballRadius < playerL.x + playerL.width) {
      if (this.collideWithPlayer(playerL)) {
        this.goingRight = true;
      } else {
        declareWinner('right');
      }
    }
  };

  this.reset = () => {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.ySpeed = 0;
    this.goingRight = !this.goingRight;
  };

  this.collideWithPlayer = (playerClass) => {
    if (this.y > playerClass.y && this.y < playerClass.y + playerClass.height) {
      this.ySpeed = (this.y - playerClass.y - playerClass.height / 2) / 10;
      return true;
    }
    return false;
  };

  this.draw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.beginPath();
    render.arc(this.x, this.y, ballRadius, 0, 2 * Math.PI);
    render.fill();
  };
}
