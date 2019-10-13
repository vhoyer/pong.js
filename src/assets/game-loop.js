class GameLoop {
  constructor(canvas) {
    this.game = canvas;
    this.game.getRender = () => canvas.getContext('2d');

    this.draw = [];
    this.update = [];
    this.updateRate = 1000 / 60;

    this.runLoop = this.runLoop.bind(this);
    this.runLoop();
  }

  runLoop() {
    this.drawEverything();
    this.updateEverthing();

    setTimeout(this.runLoop, this.updateRate);
  }

  drawEverything() {
    this.draw.forEach((drawSomething) => {
      drawSomething(this.game);
    });
  }

  updateEverthing() {
    this.update.forEach((updateSomething) => {
      updateSomething(this.game);
    });
  }

  addToDrawPipeline(drawFunction) {
    this.draw.push(drawFunction);
  }

  addToUpdatePipeline(updateFunction) {
    this.update.push(updateFunction);
  }

  addObjectsToPipeline(...objects) {
    objects.forEach((object) => {
      if (typeof object.draw === 'function') {
        this.addToDrawPipeline(object.draw);
      }

      if (typeof object.update === 'function') {
        this.addToUpdatePipeline(object.update);
      }
    });
  }
}

export default GameLoop;
