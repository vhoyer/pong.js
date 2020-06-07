import GameLoop from './assets/game-loop';
import playField from './assets/play-field';

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

playField(gameLoop, canvas);

window.gameLoop = gameLoop;
