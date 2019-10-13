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

  this.move = (dir) => {
    if (dir === 'up') {
      this.direction = 1;
    } else if (dir === 'down') {
      this.direction = -1;
    } else {
      this.direction = 0;
    }
  };

  this.reset = () => {
    this.y = canvas.height / 2 - this.height / 2;
    this.direction = 0;
  };

  this.onFixedUpdate = (game) => {
    const {
      x,
      y,
      width,
      height,
      direction,
      ySpeed,
    } = this;

    if (direction === 1 && y + ySpeed > 0) {
      this.y -= ySpeed;
    } else if (direction === -1 && y + height + ySpeed < game.height) {
      this.y += ySpeed;
    }

    return {
      topLeft: { x, y },
      bottomRight: { x: x + width, y: y + height },
    };
  };

  this.onDraw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.fillRect(this.x, this.y, this.width, this.height);
  };
}

export default Player;
