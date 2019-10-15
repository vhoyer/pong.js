import Player from '../../characters/player';
import Ball from '.';

const arcFunction = jest.fn();

const mockGame = {
  height: 20,
  getRender: () => ({
    arc: arcFunction,
    beginPath: jest.fn(),
    fill: jest.fn(),
  }),
};

describe('Play field > Ball', () => {
  let ball;

  beforeEach(() => {
    ball = new Ball({
      initialX: 0,
      initialY: 10,
    });
  });

  afterEach(() => {
    arcFunction.mockReset();
  });

  describe('on first draw', () => {
    beforeEach(() => {
      ball.onDraw(mockGame);
    });

    it('draws a ball in the start position', () => {
      expect(arcFunction).toBeCalledWith(0, 10, 6, 0, 2 * Math.PI);
    });

    describe('on first fixed update', () => {
      let hitbox;

      beforeEach(() => {
        arcFunction.mockReset();
        hitbox = ball.onFixedUpdate(mockGame);
      });

      it('updates position', () => {
        ball.onDraw(mockGame);

        expect(arcFunction).toBeCalledWith(6, 10, 6, 0, 2 * Math.PI);
      });

      it("returns it's current hitbox", () => {
        expect(hitbox).toEqual({
          topLeft: { x: 0, y: 4 },
          bottomRight: { x: 12, y: 16 },
        });
      });

      describe('when ball collides with something other than a player', () => {
        beforeEach(() => {
          ball.onCollision({});
          hitbox = ball.onFixedUpdate(mockGame);
        });

        it('carries with its life', () => {
          expect(hitbox).toEqual({
            topLeft: { x: 6, y: 4 },
            bottomRight: { x: 18, y: 16 },
          });
        });
      });

      const buildPlayer = (override = {}) => new Player({
        initialX: 0,
        initialY: 0,
        side: 'left',
        ...override,
      });

      describe.each([
        ['top', buildPlayer({ initialY: 50 }), 0],
        ['middle', buildPlayer(), 5],
        ['bottom', buildPlayer({ initialY: -50 }), 10],
      ])('when ball bumps into the %s of the player', (direction, player, y) => {
        beforeEach(() => {
          ball.onCollision(player);
          hitbox = ball.onFixedUpdate(mockGame);
        });

        it('start going to the opposite direction', () => {
          expect(hitbox.topLeft.x).toEqual(-6);
        });

        it(`start going towards the ${direction} of the screen`, () => {
          expect(hitbox.topLeft.y).toEqual(y);
        });

        if (direction === 'bottom') {
          describe('when ball hits screen bottom', () => {
            let invertYDirection;

            beforeEach(() => {
              invertYDirection = jest.spyOn(ball, 'invertYDirection');
              hitbox = ball.onFixedUpdate(mockGame);
            });

            it("inverts it's speed in the Y axis to go up", () => {
              expect(invertYDirection).toHaveBeenCalled();
            });

            it("has it's hitbox outside the screen", () => {
              expect(hitbox.bottomRight.y).toBeGreaterThan(mockGame.height);
            });

            describe('when another update happens', () => {
              beforeEach(() => {
                hitbox = ball.onFixedUpdate(mockGame);
              });

              it('starts to go up', () => {
                expect(hitbox.topLeft.y).toEqual(10);
              });
            });
          });
        }
      });

      describe('when one player scores a point and reset is called on everyone', () => {
        beforeEach(() => {
          ball.reset();
          arcFunction.mockReset();
          ball.onDraw(mockGame);
        });

        it("has it's position resets to initial position", () => {
          expect(arcFunction).toBeCalledWith(0, 10, 6, 0, 2 * Math.PI);
        });
      });
    });
  });
});
