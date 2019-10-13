function doesBoxesOverlap(hitboxA, hitboxB) {
  if (hitboxA.topLeft.x > hitboxB.bottomRight.x
    || hitboxB.topLeft.x > hitboxA.bottomRight.x) {
    return false;
  }

  if (hitboxA.topLeft.y > hitboxB.bottomRight.y
    || hitboxB.topLeft.y > hitboxA.bottomRight.y) {
    return false;
  }

  return true;
}

function calculateOneCollision(A, B) {
  const [hitboxA, objectA] = A;
  const [hitboxB, objectB] = B;

  if (doesBoxesOverlap(hitboxA, hitboxB)) {
    if (typeof objectA.onCollision === 'function') {
      objectA.onCollision(objectB);
    }

    if (typeof objectB.onCollision === 'function') {
      objectB.onCollision(objectA);
    }
  }
}

class GameLoop {
  constructor(canvas) {
    this.game = canvas;
    this.game.getRender = () => canvas.getContext('2d');

    this.draw = [];
    this.update = [];
    this.hitboxes = [];

    this.runLoop = this.runLoop.bind(this);
    this.runLoop(Date.now());
  }

  runLoop(lastExecutionTime) {
    this.hitboxes = this.updateEverthing();
    this.calculateCollisions();

    this.drawEverything();

    const currentExecutionTime = Date.now();
    const executionDelta = currentExecutionTime - lastExecutionTime;

    const desiredUpdateRate = 1000 / 60;
    const millisecondsToNextGameTick = desiredUpdateRate - executionDelta;

    setTimeout(() => this.runLoop(currentExecutionTime), millisecondsToNextGameTick);
  }

  drawEverything() {
    this.draw.forEach((drawSomething) => {
      drawSomething(this.game);
    });
  }

  updateEverthing() {
    return this.update.reduce((hitboxes, [updateFunction, object]) => {
      const currentObjectHitbox = updateFunction(this.game);

      if (!currentObjectHitbox) return hitboxes;

      return [...hitboxes, [currentObjectHitbox, object]];
    }, []);
  }

  calculateCollisions() {
    const { hitboxes } = this;
    const inverseHitboxes = hitboxes.slice().reverse();

    for (let i = 0; i < hitboxes.length; i += 1) {
      inverseHitboxes.pop();

      for (let j = 0; j < inverseHitboxes.length; j += 1) {
        calculateOneCollision(
          hitboxes[i],
          inverseHitboxes[j],
        );
      }
    }
  }

  addToDrawPipeline(drawFunction) {
    this.draw.push(drawFunction);
  }

  addToUpdatePipeline(updateTuple) {
    this.update.push(updateTuple);
  }

  addObjectsToPipeline(...objects) {
    objects.forEach((object) => {
      if (typeof object.draw === 'function') {
        this.addToDrawPipeline(object.draw);
      }

      if (typeof object.update === 'function') {
        this.addToUpdatePipeline([object.update, object]);
      }
    });
  }
}

export default GameLoop;
