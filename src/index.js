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
  if (event.keyCode === 38) { // up arrow
    playerR.move('up');
  } else if (event.keyCode === 40) { // down arrow
    playerR.move('down');
  }

  if (event.keyCode === 87) { // w
    playerL.move('up');
  } else if (event.keyCode === 83) { // s
    playerL.move('down');
  }
});
document.addEventListener('keyup', (event) => {
  if (event.keyCode === 38 || event.keyCode === 40) { // up arrow || down arrow
    playerR.move('none');
  }
  if (event.keyCode === 87 || event.keyCode === 83) { // w || s
    playerL.move('none');
  }
});

draw();
setInterval(() => {
  tick();
  draw();
}, 1000 / 60);
