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
    this.draw.forEach((onDraw) => {
      onDraw(this.game);
    });
  }

  updateEverthing() {
    return this.update.reduce((hitboxes, [onFixedUpdate, object]) => {
      const currentObjectHitbox = onFixedUpdate(this.game);

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

  addToDrawPipeline(onDraw) {
    this.draw.push(onDraw);
  }

  addToUpdatePipeline(onFixedUpdate, object) {
    this.update.push([onFixedUpdate, object]);
  }

  addObjectsToPipeline(...objects) {
    objects.forEach((object) => {
      if (typeof object.onDraw === 'function') {
        this.addToDrawPipeline(object.onDraw);
      }

      if (typeof object.onFixedUpdate === 'function') {
        this.addToUpdatePipeline(object.onFixedUpdate, object);
      }
    });
  }
}

export default GameLoop;
