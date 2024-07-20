import { bird } from "./bird.js";
import { states } from "./gameConstants.js";
import { pipes } from "./pipes.js";
import { SPRITE_NAMES, sprites, initSprites } from "./sprite.js";

class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.fgpos = 0;
    this.frames = 0;
    this.score = 0;
    this.best = 0;
    this.currentState = states.Splash;
    this.okButton = null;
  }

  async init() {
    this.canvas = document.createElement("canvas");
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    let eventName = "touchstart";
    if (this.width >= 500) {
      eventName = "mousedown";
      this.width = 320;
      this.height = 480;
      this.canvas.style.border = "1px solid #000";
    }

    document.addEventListener(eventName, this.onPress.bind(this));
    document.addEventListener("click", () => {
      document.querySelector("#background-music").play();
    });

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);

    const img = await this.loadImage("/res/sheet.png");
    await initSprites(img);

    this.ctx.fillStyle = sprites.get(SPRITE_NAMES.BACKGROUND).color;

    const okSprite = sprites.get(SPRITE_NAMES.BUTTONS).Ok;
    this.okButton = {
      x: (this.width - okSprite.width) / 2,
      y: this.height - 200,
      width: okSprite.width,
      height: okSprite.height,
    };

    this.run();
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  onPress(e) {
    switch (this.currentState) {
      case states.Splash:
        this.currentState = states.Game;
        bird.jump();
        break;
      case states.Game:
        bird.jump();
        break;
      case states.Score:
        const mx = e.offsetX || e.touches[0].clientX;
        const my = e.offsetY || e.touches[0].clientY;

        if (
          this.okButton.x < mx &&
          mx < this.okButton.x + this.okButton.width &&
          this.okButton.y < my &&
          my < this.okButton.y + this.okButton.height
        ) {
          pipes.reset();
          this.currentState = states.Splash;
          this.score = 0;
        }
        break;
    }
  }

  run() {
    const loop = () => {
      this.update();
      this.render();
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  update() {
    this.frames++;
    if (this.currentState !== states.Score) {
      this.fgpos = (this.fgpos - 2) % 14;
    } else {
      this.best = Math.max(this.best, this.score);
    }
    if (this.currentState === states.Game) {
      const { gameOver, score } = pipes.update(this.frames);
      if (gameOver) {
        this.currentState = states.Score;
      }
      this.score += score;
    }
    this.currentState = bird.update(this.frames);
  }

  render() {
    this.ctx.fillRect(0, 0, this.width, this.height);

    const bgSprite = sprites.get(SPRITE_NAMES.BACKGROUND);
    bgSprite.draw(this.ctx, 0, this.height - bgSprite.height);
    bgSprite.draw(this.ctx, bgSprite.width, this.height - bgSprite.height);

    const fgSprite = sprites.get(SPRITE_NAMES.FOREGROUND);
    fgSprite.draw(this.ctx, this.fgpos, this.height - fgSprite.height);
    fgSprite.draw(
      this.ctx,
      this.fgpos + fgSprite.width,
      this.height - fgSprite.height,
    );

    bird.draw(this.ctx);
    pipes.draw(this.ctx);

    if (this.currentState === states.Splash) {
      const samoyedGSprite = sprites.get(SPRITE_NAMES.SAMOYED_GREY);
      const splashSprite = sprites.get(SPRITE_NAMES.SPLASH);
      const getReadySprite = sprites.get(SPRITE_NAMES.TEXT).GetReady;

      samoyedGSprite.draw(
        this.ctx,
        this.midX(samoyedGSprite),
        this.height - 320,
      );
      splashSprite.draw(this.ctx, this.midX(splashSprite), this.height - 250);
      getReadySprite.draw(
        this.ctx,
        this.midX(getReadySprite),
        this.height - 380,
      );
    }

    if (this.currentState === states.Score) {
      const gameOverSprite = sprites.get(SPRITE_NAMES.TEXT).GameOver;
      const scoreSprite = sprites.get(SPRITE_NAMES.SCORE);
      const okSprite = sprites.get(SPRITE_NAMES.BUTTONS).Ok;
      const numberSSprite = sprites.get(SPRITE_NAMES.NUMBER_SMALL);

      gameOverSprite.draw(
        this.ctx,
        this.midX(gameOverSprite),
        this.height - 400,
      );
      scoreSprite.draw(this.ctx, this.midX(scoreSprite), this.height - 340);
      okSprite.draw(this.ctx, this.okButton.x, this.okButton.y);

      numberSSprite.draw(
        this.ctx,
        this.midX() - 47,
        this.height - 304,
        this.score,
        null,
        10,
      );
      numberSSprite.draw(
        this.ctx,
        this.midX() - 47,
        this.height - 262,
        this.best,
        null,
        10,
      );
    } else {
      const numberBSprite = sprites.get(SPRITE_NAMES.NUMBER_BIG);
      numberBSprite.draw(this.ctx, null, 20, this.score, this.midX());
    }
  }

  midX(img) {
    const imgWidth = img ? img.width : 0;
    return this.width / 2 - imgWidth / 2;
  }
}

export const game = new Game();
