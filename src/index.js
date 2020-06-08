import GameLoop from './assets/game-loop';
import playField from './assets/play-field';
import dirt from './assets/tiles/dirt.png';

const canvas = document.getElementById('game');
canvas.width = 800 * 1.3;
canvas.height = 450 * 1.3;


const dirtTile = new Image();
dirtTile.src = dirt;
const tileSize = 64;

function drawBackground(game) {
  const { width, height } = game;
  const render = game.getRender();
  render.imageSmoothingEnabled = false;

  render.fillStyle = 'black';
  render.fillRect(0, 0, width, height);

  const xScan = Math.ceil(width / tileSize);
  const yScan = Math.ceil(height / tileSize);

  for (let x = 0; x < xScan; x += 1) {
    for (let y = 0; y < yScan; y += 1) {
      render.drawImage(dirtTile, tileSize * x, tileSize * y, tileSize, tileSize);
    }
  }
}

const gameLoop = new GameLoop(canvas);
gameLoop.addToDrawPipeline(drawBackground);

playField(gameLoop, canvas);

window.gameLoop = gameLoop;
