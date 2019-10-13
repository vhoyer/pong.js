import GameLoop from './assets/game-loop';
import Player from './assets/play-field/characters/player';
import Ball from './assets/play-field/objects/ball';

// screen vars
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


// setting vars
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
const ball = new Ball(canvas, playerL, playerR, (winner) => {
  ball.reset();
  playerL.reset();
  playerR.reset();

  if (winner === 'left') {
    playerL.point();
  } else {
    playerR.point();
  }
});

gameLoop.addObjectsToPipeline(playerL, playerR, ball);
