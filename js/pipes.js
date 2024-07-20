import { bird } from "./bird.js";
import { game } from "./game.js";
import { size } from "./gameConstants.js";
import { SPRITE_NAMES, sprites } from "./sprite.js";

class Pipes {
  constructor() {
    this._pipes = [];
    this.gap = 90 * size;
  }

  reset() {
    this._pipes = [];
  }

  update(frames) {
    if (frames % 100 === 0) {
      const pipeSprite = sprites.get(SPRITE_NAMES.PIPE_SOUTH);
      const foregroundHeight = sprites.get(SPRITE_NAMES.FOREGROUND).height;
      const _y =
        game.height -
        (pipeSprite.height + foregroundHeight) -
        (120 * size - 20 * size + (200 * Math.random()) / (size / 1.3));
      this._pipes.push({
        x: 500,
        y: _y,
        width: pipeSprite.width,
        height: pipeSprite.height,
      });
    }

    let score = 0;
    for (let i = 0; i < this._pipes.length; i++) {
      const p = this._pipes[i];

      if (i === 0) {
        score += p.x === bird.x ? 1 : 0;

        const cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
        const cy1 = Math.min(Math.max(bird.y, p.y), p.y + p.height);
        const cy2 = Math.min(
          Math.max(bird.y, p.y + p.height + this.gap),
          p.y + 2 * p.height + this.gap,
        );

        const dx = bird.x - cx;
        const dy1 = bird.y - cy1;
        const dy2 = bird.y - cy2;

        const d1 = dx * dx + dy1 * dy1;
        const d2 = dx * dx + dy2 * dy2;
        const r = bird.radius * bird.radius;

        if (r > d1 || r > d2) {
          return { gameOver: true, score };
        }
      }

      p.x -= 2;
      if (p.x < -50) {
        this._pipes.splice(i, 1);
        i--;
      }
    }

    return { gameOver: false, score };
  }

  draw(ctx) {
    const pipeNorth = sprites.get(SPRITE_NAMES.PIPE_NORTH);
    const pipeSouth = sprites.get(SPRITE_NAMES.PIPE_SOUTH);

    for (const p of this._pipes) {
      pipeSouth.draw(ctx, p.x, p.y);
      pipeNorth.draw(ctx, p.x, p.y + this.gap + p.height);
    }
  }
}

export const pipes = new Pipes();
