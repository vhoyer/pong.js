import GameLoop from './assets/internals/game-loop';
import Collider from './assets/internals/collider';
import Ball from './assets/scenes/play-field/objects/ball';
import Player from './assets/scenes/play-field/characters/player';
import Scoreboard from './assets/scenes/play-field/ui/scoreboard';

const canvas = document.getElementById('game');
canvas.width = 800 * 1.3;
canvas.height = 450 * 1.3;

function drawBackground(game) {
  const { width, height } = game;
  const render = game.getRender();

  render.fillStyle = 'black';
  render.fillRect(0, 0, width, height);
}

const gameLoop = new GameLoop(canvas);
gameLoop.addToDrawPipeline(drawBackground);

const scoreboard = new Scoreboard();

const playerL = new Player(canvas, {
  side: 'left',
  upKey: 'w',
  downKey: 's',
});

const playerR = new Player(canvas, {
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
