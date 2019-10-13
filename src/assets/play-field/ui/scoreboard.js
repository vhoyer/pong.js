function Scoreboard() {
  const fontSize = 35;
  const yPosition = 3 + fontSize;

  const board = {
    left: { score: 0 },
    right: { score: 0 },
  };

  this.draw = (game) => {
    const render = game.getRender();

    render.fillStyle = 'white';
    render.font = `${fontSize}px Arial`;

    Object.keys(board).forEach((side) => {
      const { score } = board[side];
      const x = game.width * (side === 'left' ? 1 / 6 : 4 / 6);

      render.fillText(score, x, yPosition);
    });
  };

  this.incrementScore = (side) => {
    board[side].score += 1;
  };
}

export default Scoreboard;
