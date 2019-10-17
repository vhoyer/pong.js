import Scoreboard from '.';

const fillText = jest.fn();

const mockGame = {
  width: 6,
  getRender: jest.fn(() => ({
    fillText,
  })),
};

describe('Play field > scoreboard', () => {
  let scoreboard;

  afterEach(() => {
    fillText.mockReset();
  });

  describe('when first draw is called', () => {
    beforeEach(() => {
      scoreboard = new Scoreboard();

      scoreboard.onDraw(mockGame);
    });

    it('renders two zeros', () => {
      expect(fillText.mock.calls.length).toBe(2);
      expect(fillText.mock.calls[0]).toEqual([0, 1, 38]);
      expect(fillText.mock.calls[1]).toEqual([0, 4, 38]);
    });

    describe('when left side makes a point', () => {
      beforeEach(() => {
        fillText.mockReset();

        scoreboard.incrementScore('left');

        scoreboard.onDraw(mockGame);
      });

      it('renders left side with one and right with zeros', () => {
        expect(fillText.mock.calls.length).toBe(2);
        expect(fillText.mock.calls[0]).toEqual([1, 1, 38]);
        expect(fillText.mock.calls[1]).toEqual([0, 4, 38]);
      });
    });
  });
});
