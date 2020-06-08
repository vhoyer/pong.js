import mage from '../tiles/mage.png';
import totem from '../tiles/totem.png';

export default (gameLoop, _canvas) => {
  gameLoop.addObjectsToPipeline(
    {
      tile: new Image(),
      vel: 2,
      vec: { x: 0, y: 0 },
      pos: { x: 0, y: 0 },
      tileSize: 64,
      direction: 0,
      state: 0,
      isMoving: false,
      onSetup() {
        this.tile.src = mage;
        document.addEventListener('keydown', ({ key }) => {
          const events = {
            /* eslint-disable no-return-assign */
            h: () => this.vec.x = -this.vel,
            j: () => this.vec.y = +this.vel,
            k: () => this.vec.y = -this.vel,
            l: () => this.vec.x = +this.vel,
            /* eslint-enable no-return-assign */
          };

          if (events[key]) events[key]();
        });
        document.addEventListener('keyup', ({ key }) => {
          const events = {
            /* eslint-disable no-return-assign */
            h: () => this.vec.x = 0,
            j: () => this.vec.y = 0,
            k: () => this.vec.y = 0,
            l: () => this.vec.x = 0,
            /* eslint-enable no-return-assign */
          };

          if (events[key]) events[key]();
        });
      },
      onFixedUpdate() {
        this.pos.x += this.vec.x;
        this.pos.y += this.vec.y;

        this.isMoving = this.vec.x !== 0 || this.vec.y !== 0;

        if (this.isMoving) {
          this.step = (this.step || 0) + 1;
          // eslint-disable-next-line no-plusplus
          if (this.step === 30) {
            this.step = 0;
            this.state = this.state === 1 ? 2 : 1;
          }

          this.direction = Number(this.vec.x < 0);
        } else {
          this.state = 0;
          this.step = 0;
        }
      },
      onDraw(game) {
        const render = game.getRender();
        render.imageSmoothingEnabled = false;

        render.drawImage(
          this.tile,
          16 * this.state,
          16 * this.direction,
          16,
          16,
          this.pos.x,
          this.pos.y,
          this.tileSize,
          this.tileSize,
        );
      },
    },
    {
      tile: new Image(),
      onSetup() {
        this.tile.src = totem;
      },
      onDraw(game) {
        const render = game.getRender();
        render.imageSmoothingEnabled = false;

        render.drawImage(
          this.tile,
          0,
          0,
          this.tile.width,
          this.tile.height,
          29,
          178,
          this.tile.width * 6,
          this.tile.height * 6,
        );
      },
    },
  );
};
