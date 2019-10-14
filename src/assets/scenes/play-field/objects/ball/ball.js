import Player from '../../characters/player';

function Ball({ initialX, initialY }) {
  const ballRadius = 6;
  const initialPosition = {
    x: initialX,
    y: initialY,
  };

  const xSpeed = 6;
  let ySpeed = 0;
  let goingRight = true;
  let { x, y } = initialPosition;

  this.reset = () => {
    x = initialPosition.x;
    y = initialPosition.y;
    ySpeed = 0;
    goingRight = !goingRight;
  };

  this.onFixedUpdate = (game) => {
    y += ySpeed;
    if (y + ballRadius <= 3 || y + ballRadius >= game.height - 3) {
      ySpeed *= -1;
    }

    if (goingRight) {
      x += xSpeed;
    } else {
      x -= xSpeed;
    }

    return {
      topLeft: { x: x - ballRadius, y: y - ballRadius },
      bottomRight: { x: x + ballRadius, y: y + ballRadius },
    };
  };

  this.onCollision = (other) => {
    if (!(other instanceof Player)) {
      return;
    }

    const box = other.getBox();
    const otherCenterY = box.y + box.height / 2;

    ySpeed = (y - otherCenterY) / 10;

    goingRight = !goingRight;
  };

  this.onDraw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.beginPath();
    render.arc(x, y, ballRadius, 0, 2 * Math.PI);
    render.fill();
  };
}

export default Ball;
