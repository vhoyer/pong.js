function Player({
  initialY,
  initialX,
  side,
  upKey,
  downKey,
}) {
  document.addEventListener('keydown', (event) => {
    if (event.key === upKey) {
      this.move('up');
    } else if (event.key === downKey) {
      this.move('down');
    }
  });

  document.addEventListener('keyup', (event) => {
    if ([upKey, downKey].includes(event.key)) {
      this.move('idle');
    }
  });

  const screenMargin = 3; // offset from screen edge
  const ySpeed = 3.4;
  const width = 10;
  const height = 100;

  const startingX = {
    left: initialX + screenMargin,
    right: initialX - width - screenMargin,
  };

  const x = startingX[side];
  let y = initialY - height / 2;

  this.getBox = () => ({
    x, y, height, width,
  });

  /**
   * Represents the direction the player is going.
   * If value is:
   *  1: it moves up, towards the top of the screen
   *  0: it stays idle, don't move
   * -1: it moves down, towards the bottom of the screen
   * @type Number
   */
  let direction = 0;

  this.move = (dir) => {
    if (dir === 'up') {
      direction = 1;
    } else if (dir === 'down') {
      direction = -1;
    } else {
      direction = 0;
    }
  };

  this.reset = () => {
    y = initialY - height / 2;
    direction = 0;
  };

  this.onFixedUpdate = (game) => {
    if (direction === 1 && y + ySpeed > 0) {
      y -= ySpeed;
    } else if (direction === -1 && y + height + ySpeed < game.height) {
      y += ySpeed;
    }

    return {
      topLeft: { x, y },
      bottomRight: { x: x + width, y: y + height },
    };
  };

  this.onDraw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.fillRect(x, y, width, height);
  };
}

export default Player;
