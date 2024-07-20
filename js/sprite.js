const SPRITE_NAMES = {
  BIRD: "bird",
  BACKGROUND: "bg",
  FOREGROUND: "fg",
  PIPE_NORTH: "pipeNorth",
  PIPE_SOUTH: "pipeSouth",
  TEXT: "text",
  SCORE: "score",
  SPLASH: "splash",
  BUTTONS: "buttons",
  NUMBER_SMALL: "numberS",
  NUMBER_BIG: "numberB",
  SAMOYED_GREY: "samoyedG",
};

const sprites = new Map();

class Sprite {
  constructor(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
  }

  draw(ctx, x, y) {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height,
    );
  }
}

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const initSprites = async (sheetImg) => {
  const samoyedImages = await Promise.all([
    loadImage("/res/samoyed1.png"),
    loadImage("/res/samoyed2.png"),
    loadImage("/res/samoyed3.png"),
    loadImage("/res/samoyed4.png"),
  ]);

  sprites.set(
    SPRITE_NAMES.BIRD,
    samoyedImages.map((img) => new Sprite(img, 0, 0, 32, 32)),
  );

  sprites.set(SPRITE_NAMES.BACKGROUND, new Sprite(sheetImg, 0, 0, 138, 114));
  sprites.get(SPRITE_NAMES.BACKGROUND).color = "#70C5CF";
  sprites.set(SPRITE_NAMES.FOREGROUND, new Sprite(sheetImg, 138, 0, 112, 56));

  sprites.set(SPRITE_NAMES.PIPE_NORTH, new Sprite(sheetImg, 251, 0, 26, 200));
  sprites.set(SPRITE_NAMES.PIPE_SOUTH, new Sprite(sheetImg, 277, 0, 26, 200));

  sprites.set(SPRITE_NAMES.TEXT, {
    FlappyBird: new Sprite(sheetImg, 59, 114, 96, 22),
    GameOver: new Sprite(sheetImg, 59, 136, 94, 19),
    GetReady: new Sprite(sheetImg, 59, 155, 87, 22),
  });

  sprites.set(SPRITE_NAMES.BUTTONS, {
    Rate: new Sprite(sheetImg, 79, 177, 40, 14),
    Menu: new Sprite(sheetImg, 119, 177, 40, 14),
    Share: new Sprite(sheetImg, 159, 177, 40, 14),
    Score: new Sprite(sheetImg, 79, 191, 40, 14),
    Ok: new Sprite(sheetImg, 119, 191, 40, 14),
    Start: new Sprite(sheetImg, 159, 191, 40, 14),
  });

  sprites.set(SPRITE_NAMES.SCORE, new Sprite(sheetImg, 138, 56, 113, 58));
  sprites.set(SPRITE_NAMES.SPLASH, new Sprite(sheetImg, 0, 130, 59, 47));

  const samoyedGrey = await loadImage("/res/samoyed_grey.gif");
  sprites.set(SPRITE_NAMES.SAMOYED_GREY, new Sprite(samoyedGrey, 0, 0, 32, 32));

  sprites.set(SPRITE_NAMES.NUMBER_SMALL, new Sprite(sheetImg, 0, 177, 6, 7));
  sprites.set(SPRITE_NAMES.NUMBER_BIG, new Sprite(sheetImg, 0, 188, 7, 10));

  const drawNumber = function (ctx, x, y, num, center, offset) {
    num = num.toString();
    const step = this.width + 2;

    if (center) {
      x = center - (num.length * step - 2) / 2;
    }
    if (offset) {
      x += step * (offset - num.length);
    }

    for (let i = 0; i < num.length; i++) {
      const n = parseInt(num[i]);
      ctx.drawImage(
        sheetImg,
        step * n,
        this.y,
        this.width,
        this.height,
        x,
        y,
        this.width,
        this.height,
      );
      x += step;
    }
  };

  sprites.get(SPRITE_NAMES.NUMBER_SMALL).draw = drawNumber;
  sprites.get(SPRITE_NAMES.NUMBER_BIG).draw = drawNumber;
};

export { SPRITE_NAMES, sprites, initSprites };
