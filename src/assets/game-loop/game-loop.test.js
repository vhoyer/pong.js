import GameLoop from './game-loop';

describe('Engine > Game Loop', () => {
  const mockCanvas = {
    width: 800,
    height: 450,
    getContext(contextScope) {
      return ({
        '2d': {
          save: () => {},
          id: 'this is most definitly an instance of CanvasRenderingContext2D',
          restore: () => {},
        },
      })[contextScope];
    },
  };

  describe('when instantiated', () => {
    let instance;

    beforeEach(() => {
      jest.useFakeTimers();

      instance = new GameLoop(mockCanvas);
    });

    it('has a public API', () => {
      // This is the most public
      expect(typeof instance.addObjectsToPipeline === 'function').toBe(true);
      // This is like, kinda public, maybe there is no point in using them,
      // but they are still like, public.
      expect(typeof instance.addToDrawPipeline === 'function').toBe(true);
      expect(typeof instance.addToUpdatePipeline === 'function').toBe(true);
    });

    describe('#addObjectsToPipeline', () => {
      describe('something', () => {
        const theOtherOne = {
          onFixedUpdate() {
            return {
              topLeft: { x: 10, y: 10 },
              bottomRight: { x: 14, y: 14 },
            };
          },
        };

        const mockInGameObject = {
          privateProp: 'wololo',

          /* eslint-disable no-param-reassign */
          onSetup(game) { game.wSetup = this.privateProp; },
          onDraw(game) { game.wDraw = this.privateProp; },
          onCollision(collidedOne) { collidedOne.wCollision = this.privateProp; },
          onFixedUpdate(game) {
            game.wFixedUpdate = this.privateProp;
            return {
              topLeft: { x: 10, y: 10 },
              bottomRight: { x: 14, y: 14 },
            };
          },
          /* eslint-enable no-param-reassign */
        };

        beforeEach(() => {
          instance.addObjectsToPipeline(mockInGameObject, theOtherOne);
          jest.runOnlyPendingTimers();
        });

        it('binds this to the current object before executing stuff', () => {
          expect(mockCanvas.wDraw).toEqual('wololo');
          expect(mockCanvas.wFixedUpdate).toEqual('wololo');
          expect(theOtherOne.wCollision).toEqual('wololo');
          expect(mockCanvas.wSetup).toEqual('wololo');
        });
      });

      describe('when on object is passed as argument', () => {
        const mockInGameObject = {
          onDraw: jest.fn(),
          onFixedUpdate: jest.fn(),
          onCollision: jest.fn(),
          onSetup: jest.fn(),
        };

        beforeEach(() => {
          instance.addObjectsToPipeline(mockInGameObject);
        });

        it('calls setup once', () => {
          expect(mockInGameObject.onSetup).toHaveBeenCalledTimes(1);
        });

        it('does not call callbacks', () => {
          expect(mockInGameObject.onDraw).not.toBeCalled();
          expect(mockInGameObject.onFixedUpdate).not.toBeCalled();
          expect(mockInGameObject.onCollision).not.toBeCalled();
        });

        describe('when a game tick elapses', () => {
          beforeEach(() => {
            jest.runOnlyPendingTimers();
          });

          it('does excute draw and update callbacks', () => {
            expect(mockInGameObject.onDraw).toBeCalled();
            expect(mockInGameObject.onFixedUpdate).toBeCalled();
            expect(mockInGameObject.onCollision).not.toBeCalled();
          });

          describe('when mockInGameObject.onFixedUpdate returns a hitbox', () => {
            beforeEach(() => {
              mockInGameObject.onFixedUpdate.mockReturnValue({
                topLeft: { x: 0, y: 0 },
                bottomRight: { x: 10, y: 10 },
              });

              jest.runOnlyPendingTimers();
            });

            it('does excute draw and update callbacks', () => {
              expect(mockInGameObject.onDraw).toBeCalled();
              expect(mockInGameObject.onFixedUpdate).toBeCalled();
              expect(mockInGameObject.onCollision).not.toBeCalled();
            });
          });
        });
      });

      describe('when multiple objects are passed as arguments', () => {
        const objectA = {
          onDraw: jest.fn(),
          onFixedUpdate: jest.fn().mockReturnValue({
            topLeft: { x: 0, y: 0 },
            bottomRight: { x: 10, y: 10 },
          }),
          onCollision: jest.fn(),
        };
        const objectB = {
          onDraw: jest.fn(),
          onFixedUpdate: jest.fn().mockReturnValue({
            topLeft: { x: 10, y: 10 },
            bottomRight: { x: 12, y: 12 },
          }),
          onCollision: jest.fn(),
        };

        const resetFns = (obj) => {
          obj.onDraw.mockReset();
          obj.onFixedUpdate.mockReset();
          obj.onCollision.mockReset();
        };

        beforeEach(() => {
          resetFns(objectA);
          resetFns(objectB);

          instance.addObjectsToPipeline(objectA, objectB);
        });

        it('does not call callbacks', () => {
          expect(objectA.onDraw).not.toBeCalled();
          expect(objectA.onFixedUpdate).not.toBeCalled();
          expect(objectA.onCollision).not.toBeCalled();

          expect(objectB.onDraw).not.toBeCalled();
          expect(objectB.onFixedUpdate).not.toBeCalled();
          expect(objectB.onCollision).not.toBeCalled();
        });

        describe('when a game tick elapses', () => {
          beforeEach(() => {
            jest.runOnlyPendingTimers();
          });

          it('does excute draw and update callbacks', () => {
            expect(objectA.onDraw).toBeCalled();
            expect(objectA.onFixedUpdate).toBeCalled();
            expect(objectA.onCollision).not.toBeCalled();

            expect(objectB.onDraw).toBeCalled();
            expect(objectB.onFixedUpdate).toBeCalled();
            expect(objectB.onCollision).not.toBeCalled();
          });

          describe('when objectA and objectB are overlapping', () => {
            beforeEach(() => {
              resetFns(objectA);
              resetFns(objectB);

              objectB.onFixedUpdate.mockReturnValue({
                topLeft: { x: 10, y: 10 },
                bottomRight: { x: 14, y: 14 },
              });
              objectA.onFixedUpdate.mockReturnValue({
                topLeft: { x: 10, y: 10 },
                bottomRight: { x: 14, y: 14 },
              });

              jest.runOnlyPendingTimers();
            });

            it('calls onCollisions', () => {
              expect(objectA.onDraw).toBeCalled();
              expect(objectA.onFixedUpdate).toBeCalled();
              expect(objectA.onCollision).toBeCalledWith(objectB);

              expect(objectB.onDraw).toBeCalled();
              expect(objectB.onFixedUpdate).toBeCalled();
              expect(objectB.onCollision).toBeCalledWith(objectA);
            });
          });
        });
      });
    });

    describe('#addToDrawPipeline', () => {
      describe('when a function is passed as first argument', () => {
        let gameObject;

        const drawCallback = jest.fn((game) => {
          gameObject = game;
        });

        beforeEach(() => {
          instance.addToDrawPipeline(drawCallback);
        });

        it('does not run draw callback', () => {
          expect(drawCallback).not.toBeCalled();
        });

        describe('when a game tick elapses', () => {
          beforeEach(() => {
            jest.runOnlyPendingTimers();
          });

          it('runs drawCallback', () => {
            expect(drawCallback).toHaveBeenCalledWith(gameObject);
          });

          it('passes as first parameter the game object', () => {
            expect(gameObject).toEqual(expect.objectContaining({
              width: expect.any(Number),
              height: expect.any(Number),
              getRender: expect.any(Function),
            }));
          });

          describe('#getRender', () => {
            it('is CanvasRenderingContext2D', () => {
              expect(gameObject.getRender().id).toEqual('this is most definitly an instance of CanvasRenderingContext2D');
            });
          });
        });
      });
    });

    describe('#addToUpdatePipeline', () => {
      describe('when a function is passed as first argument', () => {
        let gameObject;

        const updateCallback = jest.fn((game) => {
          gameObject = game;
        });

        beforeEach(() => {
          instance.addToUpdatePipeline(updateCallback);
        });

        it('does not run update callback', () => {
          expect(updateCallback).not.toBeCalled();
        });

        describe('when a game tick elapses', () => {
          beforeEach(() => {
            jest.runOnlyPendingTimers();
          });

          it('runs updateCallback', () => {
            expect(updateCallback).toHaveBeenCalledWith(gameObject);
          });

          it('passes as first parameter the game object', () => {
            expect(gameObject).toEqual(expect.objectContaining({
              width: expect.any(Number),
              height: expect.any(Number),
              getRender: expect.any(Function),
            }));
          });
        });
      });
    });
  });
});
