import Player from '.';

const fillRect = jest.fn();

const mockGame = {
  height: 200,
  getRender: () => ({
    fillRect,
  }),
};

describe('Play field > player', () => {
  const keyboard = {};
  let player;
  let hitbox;

  beforeEach(() => {
    document.addEventListener = (event, callback) => {
      keyboard[event] = callback;
    };

    player = new Player({
      initialX: 0,
      initialY: 100,
      side: 'left',
      upKey: 'up',
      downKey: 'down',
    });

    player.onDraw(mockGame);
    hitbox = player.onFixedUpdate(mockGame);
  });

  afterEach(() => {
    fillRect.mockReset();
  });

  it('draws the player in the initial position plus the sizing offset of the player', () => {
    expect(fillRect).toBeCalledWith(3, 50, 10, 100);
  });

  it('has its hitbox at the initial position plus the sizing offset of the player', () => {
    expect(hitbox).toEqual({
      topLeft: { x: 3, y: 50 },
      bottomRight: { x: 13, y: 150 },
    });
  });

  describe('when one player scores a point and reset is called on everyone', () => {
    beforeEach(() => {
      fillRect.mockReset();
      player.reset();
      player.onDraw(mockGame);
    });

    it('reset its position, back to start', () => {
      expect(fillRect).toBeCalledWith(3, 50, 10, 100);
    });
  });

  describe('when user presses down the down key', () => {
    let move;

    beforeEach(() => {
      move = jest.spyOn(player, 'move');
      keyboard.keydown({ key: 'down' });
    });

    afterEach(() => {
      move.mockRestore();
    });

    it('calls move with the "down" direction', () => {
      expect(move).toBeCalledWith('down');
    });

    describe('when onFixedUpdate is called', () => {
      beforeEach(() => {
        hitbox = player.onFixedUpdate(mockGame);
      });

      it('starts going down', () => {
        expect(hitbox.topLeft.y).toEqual(53.4);
      });

      describe('when player releases key', () => {
        beforeEach(() => {
          move = jest.spyOn(player, 'move');
          keyboard.keyup({ key: 'down' });
        });

        it('calls move with the "idle" direction', () => {
          expect(move).toBeCalledWith('idle');
        });

        describe('when onFixedUpdate is called', () => {
          beforeEach(() => {
            hitbox = player.onFixedUpdate(mockGame);
          });

          it('starts going down', () => {
            expect(hitbox.topLeft.y).toEqual(53.4);
          });
        });
      });
    });
  });

  describe('when user presses down the up key', () => {
    let move;

    beforeEach(() => {
      move = jest.spyOn(player, 'move');
      keyboard.keydown({ key: 'up' });
    });

    afterEach(() => {
      move.mockRestore();
    });

    it('calls move with the "down" direction', () => {
      expect(move).toBeCalledWith('up');
    });

    describe('when onFixedUpdate is called', () => {
      beforeEach(() => {
        hitbox = player.onFixedUpdate(mockGame);
      });

      it('starts going down', () => {
        expect(hitbox.topLeft.y).toEqual(46.6);
      });
    });
  });
});
