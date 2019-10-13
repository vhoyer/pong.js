class GameLoop {
  constructor(canvas) {
    this.game = canvas;
    this.game.getRender = () => canvas.getContext('2d');

    this.draw = [];
    this.update = [];
    this.updateRate = 1000 / 60;

    this.runLoop();
  }

  runLoop() {
    this.drawEverything();
    this.updateEverthing();

    setTimeout(this.runLoop.bind(this), this.updateRate);
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

  addObjectToPipeline(object) {
    this.addToDrawPipeline(object.draw);
    this.addToUpdatePipeline(object.update);
  }
}

export default GameLoop;
