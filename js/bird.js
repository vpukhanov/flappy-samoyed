import { game } from "./game.js";
import { size, states } from "./gameConstants.js";
import { SPRITE_NAMES, sprites } from "./sprite.js";

class Bird {
  constructor() {
    this.x = 60;
    this.y = 0;
    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 3];
    this.rotation = 0;
    this.radius = 12 * size;
    this.gravity = 0.12 * size;
    this._jump = 3.0 * size;
  }

  jump() {
    this.velocity = -this._jump;
  }

  update(frames) {
    const n = game.currentState === states.Splash ? 10 : 5;
    this.frame += frames % n === 0 ? 1 : 0;
    this.frame %= this.animation.length;

    if (game.currentState === states.Splash) {
      this.y = game.height - 280 + 5 * Math.cos(frames / 10);
      this.rotation = 0;
    } else {
      this.velocity += this.gravity;
      this.y += this.velocity;

      const foregroundHeight = sprites.get(SPRITE_NAMES.FOREGROUND).height;
      if (this.y >= game.height - foregroundHeight - this.radius - 2) {
        this.y = game.height - foregroundHeight - this.radius - 2;
        if (game.currentState === states.Game) {
          return states.Score;
        }
        this.velocity = this._jump;
      }

      if (this.velocity >= this._jump) {
        this.frame = 1;
        this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
      } else {
        this.rotation = -0.3;
      }
    }

    return game.currentState;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const n = this.animation[this.frame];
    const birdSprite = sprites.get(SPRITE_NAMES.BIRD)[n];
    birdSprite.draw(ctx, -birdSprite.width / 2, -birdSprite.height / 2);

    ctx.restore();
  }
}

export const bird = new Bird();
