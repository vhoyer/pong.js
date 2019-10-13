function Ball(canvas, declareWinner) {
  const ballRadius = 6;
  const initialPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2,
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

    if (x + ballRadius > playerR.x && x + ballRadius < playerR.x + playerR.width) {
      if (this.collideWithPlayer(playerR)) {
        goingRight = false;
      } else {
        declareWinner('left');
      }
    } else if (x - ballRadius > playerL.x && x - ballRadius < playerL.x + playerL.width) {
      if (this.collideWithPlayer(playerL)) {
        goingRight = true;
      } else {
        declareWinner('right');
      }
    }

    return {
      topLeft: { x: x - ballRadius, y: y - ballRadius },
      bottomRight: { x: x + ballRadius, y: y + ballRadius },
    };
  };

  this.collideWithPlayer = (playerClass) => {
    if (y > playerClass.y && y < playerClass.y + playerClass.height) {
      ySpeed = (y - playerClass.y - playerClass.height / 2) / 10;
      return true;
    }
    return false;
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
