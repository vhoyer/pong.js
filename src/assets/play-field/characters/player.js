function Player(canvas, { side, upKey, downKey }) { // {{{
  const g = canvas.getContext('2d');

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

  this.offset = 3; // offset from screen edge
  this.ySpeed = 3.4;
  this.up = 0; // going up/down/idle = 1/-1/0
  this.width = 10;
  this.height = 100;
  this.x = side === 'left' ? this.offset : canvas.width - this.width - this.offset;
  this.y = canvas.height / 2 - this.height / 2;

  this.fontSize = 35;
  this.xPoints = side === 'left' ? canvas.width * (1 / 6) : canvas.width * (4 / 6);
  this.yPoints = this.fontSize + this.offset;
  this.points = 0;

  this.move = (dir) => {
    if (dir === 'up') this.up = 1;
    else if (dir === 'down') this.up = -1;
    else this.up = 0;
  };

  this.update = () => {
    if (this.up === 1 && this.y + this.ySpeed > 0) {
      this.y -= this.ySpeed;
    } else if (this.up === -1 && this.y + this.height + this.ySpeed < canvas.height) {
      this.y += this.ySpeed;
    }
  };

  this.reset = () => {
    this.y = canvas.height / 2 - this.height / 2;
    this.up = 0;
  };

  this.point = () => {
    this.points += 1;
  };

  this.draw = () => {
    g.fillStyle = 'white';
    g.fillRect(this.x, this.y, this.width, this.height);

    g.font = `${this.fontSize}px Arial`;
    g.fillText(this.points, this.xPoints, this.yPoints);
  };
}

export default Player;
