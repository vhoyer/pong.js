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

function calculateCollisions(hitboxes) {
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

function GameLoop(canvas) {
  // Initialize values
  const game = canvas;
  game.getRender = () => canvas.getContext('2d');

  // Draw functions
  const drawPipeline = [];
  const drawEverything = () => drawPipeline.forEach((onDraw) => onDraw(game));

  // update functions
  const updatePipeline = [];
  const updateEverthing = () => updatePipeline.reduce((hitboxes, [onFixedUpdate, object]) => {
    const currentObjectHitbox = onFixedUpdate(game);

    if (!currentObjectHitbox) return hitboxes;

    return [...hitboxes, [currentObjectHitbox, object]];
  }, []);

  // Game loop
  const runLoop = (lastExecutionTime) => {
    const hitboxes = updateEverthing();
    calculateCollisions(hitboxes);

    drawEverything();

    // calculate delay to next tick
    const currentExecutionTime = Date.now();
    const executionDelta = currentExecutionTime - lastExecutionTime;

    const desiredUpdateRate = 1000 / 60;
    const millisecondsToNextGameTick = desiredUpdateRate - executionDelta;

    // call next tick
    setTimeout(() => runLoop(currentExecutionTime), millisecondsToNextGameTick);
  };
  runLoop(Date.now());

  // Public API
  this.addToDrawPipeline = function addToDrawPipeline(onDraw) {
    drawPipeline.push(onDraw);
  };

  this.addToUpdatePipeline = function addToUpdatePipeline(onFixedUpdate, object) {
    updatePipeline.push([onFixedUpdate, object]);
  };

  this.addObjectsToPipeline = (...objects) => {
    objects.forEach((object) => {
      if (typeof object.onDraw === 'function') {
        this.addToDrawPipeline(object.onDraw);
      }

      if (typeof object.onFixedUpdate === 'function') {
        this.addToUpdatePipeline(object.onFixedUpdate, object);
      }

      if (typeof object.onSetup === 'function') {
        object.onSetup(game);
      }
    });
  };
}

export default GameLoop;
