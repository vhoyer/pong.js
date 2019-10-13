function Player(canvas, { side, upKey, downKey }) { // {{{
  document.addEventListener('keydown', (event) => {
    if (event.key === upKey) {
      this.move('up');
    } else if (event.key === downKey) {
      this.move('down');
    }
  });

  document.addEventListener('keyup', (event) => {
    if ([upKey, downKey].includes(event.key)) {
      this.move('none');
    }
  });

  this.screenMargin = 3; // offset from screen edge
  this.ySpeed = 3.4;
  this.direction = 0; // going up/down/idle = 1/-1/0
  this.width = 10;
  this.height = 100;
  this.x = side === 'left' ? this.screenMargin : canvas.width - this.width - this.screenMargin;
  this.y = canvas.height / 2 - this.height / 2;

  this.fontSize = 35;
  this.xPoints = side === 'left' ? canvas.width * (1 / 6) : canvas.width * (4 / 6);
  this.yPoints = this.fontSize + this.screenMargin;
  this.points = 0;

  this.move = (dir) => {
    if (dir === 'up') {
      this.direction = 1;
    } else if (dir === 'down') {
      this.direction = -1;
    } else {
      this.direction = 0;
    }
  };

  this.update = (game) => {
    if (this.direction === 1 && this.y + this.ySpeed > 0) {
      this.y -= this.ySpeed;
    } else if (this.direction === -1 && this.y + this.height + this.ySpeed < game.height) {
      this.y += this.ySpeed;
    }
  };

  this.reset = () => {
    this.y = canvas.height / 2 - this.height / 2;
    this.direction = 0;
  };

  this.point = () => {
    this.points += 1;
  };

  this.draw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.fillRect(this.x, this.y, this.width, this.height);

    render.font = `${this.fontSize}px Arial`;
    render.fillText(this.points, this.xPoints, this.yPoints);
  };
}

export default Player;
