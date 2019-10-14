import Ball from '.';

const arcFunction = jest.fn();

const mockGame = {
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
      inicialX: 0,
      inicialY: 0,
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
      expect(arcFunction).toBeCalledWith(0, 0, 6, 0, 2 * Math.PI);
    });

    describe('on first fixed update', () => {
      let hitbox;

      beforeEach(() => {
        arcFunction.mockReset();
        hitbox = ball.onFixedUpdate(mockGame);
      });

      it('updates position', () => {
        ball.onDraw(mockGame);

        expect(arcFunction).toBeCalledWith(6, 0, 6, 0, 2 * Math.PI);
      });

      it("returns it's current hitbox", () => {
        expect(hitbox).toEqual({
          topLeft: { x: 0, y: -6 },
          bottomRight: { x: 12, y: 6 },
        });
      });

      describe('when ball collides with something other than a player', () => {
        beforeEach(() => {
          ball.onCollision({});
          hitbox = ball.onFixedUpdate(mockGame);
        });

        it('carries with its life', () => {
          expect(hitbox).toEqual({
            topLeft: { x: 6, y: -6 },
            bottomRight: { x: 18, y: 6 },
          });
        });
      });

      describe.each([
        ['top', {}, 0, -5],
        ['middle', {}, 0, -6],
        ['bottom', {}, 0, -7],
      ])('when ball bumps into the %s of the player', (direction, player, x, y) => {
        beforeEach(() => {
          ball.onCollision(player);
          hitbox = ball.onFixedUpdate(mockGame);
        });

        it('start going to the opposite direction', () => {
          expect(hitbox.topLeft.x).toEqual(x);
        });

        it(`start going towards the ${direction} of the screen`, () => {
          expect(hitbox.topLeft.y).toEqual(y);
        });
      });
    });
  });
});
