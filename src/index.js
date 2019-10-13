import Scoreboard from './assets/play-field/ui/scoreboard';
import GameLoop from './assets/game-loop';
import Player from './assets/play-field/characters/player';
import Collider from './assets/collider';
import Ball from './assets/play-field/objects/ball';

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
const ball = new Ball(canvas);

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
