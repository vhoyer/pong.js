import Collider from '../collider';
import Ball from './ball';
import Player from './player';
import Scoreboard from './scoreboard';

export default (gameLoop, canvas) => {
  const scoreboard = new Scoreboard();

  const playerL = new Player({
    initialX: 0,
    initialY: canvas.height / 2,
    side: 'left',
    upKey: 'w',
    downKey: 's',
  });

  const playerR = new Player({
    initialX: canvas.width,
    initialY: canvas.height / 2,
    side: 'right',
    upKey: 'ArrowUp',
    downKey: 'ArrowDown',
  });

  const ball = new Ball({
    initialX: canvas.width / 2,
    initialY: canvas.height / 2,
  });

  const declareWinner = (winner) => {
    ball.reset();
    playerL.reset();
    playerR.reset();
    scoreboard.incrementScore(winner);
  };

  const playerLWinningArea = new Collider({
    x: canvas.width,
    y: 0,
    height: canvas.height,
    width: 100,
    onCollision: () => declareWinner('left'),
  });

  const playerRWinningArea = new Collider({
    x: -100,
    y: 0,
    height: canvas.height,
    width: 100,
    onCollision: () => declareWinner('right'),
  });

  gameLoop.addObjectsToPipeline(
    ball,
    playerL,
    playerLWinningArea,
    playerR,
    playerRWinningArea,
    scoreboard,
  );
};
