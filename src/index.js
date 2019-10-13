import Player from './assets/play-field/characters/player';
import Ball from './assets/play-field/objects/ball';

// screen vars
const canvas = document.getElementById('game');
canvas.width = 800 * 1.3;
canvas.height = 450 * 1.3;

const g = canvas.getContext('2d');


// setting vars
const playerL = new Player(0, canvas);
const playerR = new Player(1, canvas);
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

// setting backgroung
function drawBackground() {
  g.fillStyle = 'black';
  g.fillRect(0, 0, canvas.width, canvas.height);
}

function tick() {
  ball.update();
  playerL.update();
  playerR.update();
}
function draw() {
  // reset canvas
  drawBackground();

  playerL.draw();
  playerR.draw();
  ball.draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'w') {
    playerL.move('up');
  } else if (event.key === 's') {
    playerL.move('down');
  }

  if (event.key === 'ArrowUp') {
    playerR.move('up');
  } else if (event.key === 'ArrowDown') {
    playerR.move('down');
  }
});
document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    playerR.move('none');
  }
  if (event.key === 'w' || event.key === 's') {
    playerL.move('none');
  }
});

draw();
setInterval(() => {
  tick();
  draw();
}, 1000 / 60);
