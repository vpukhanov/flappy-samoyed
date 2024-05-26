var

  canvas,
  ctx,
  width,
  height,
  fgpos = 0,

  size = 2,
  gap = 90 * size,

  frames = 0,
  score = 0,
  best = 0,
  okButton,

  currentState,
  states = {
    Splash: 0,
    Game: 1,
    Score: 2
  };

function onPress(e) {
  switch (currentState) {
    case states.Splash:
      currentState = states.Game;
      bird.jump();
      break;

    case states.Game:
      bird.jump();
      break;

    case states.Score:
      var mx = e.offsetX,
        my = e.offsetY;
      if (mx == null || my == null) {
        mx = e.touches[0].clientX;
        my = e.touches[0].clientY;
      }

      console.log(mx, my)
      console.log(okButton)

      if (okButton.x < mx && mx < okButton.x + okButton.width &&
        okButton.y < my && my < okButton.y + okButton.height
      ) {
        pipes.reset();
        currentState = states.Splash;
        score = 0;
      }
      break;

  }
}

function main() {
  canvas = document.createElement("canvas");
  width = window.innerWidth;
  height = window.innerHeight;

  var e = "touchstart";
  if (width >= 500) {
    e = "mousedown";
    width = 320;
    height = 480;
    canvas.style.border = "1px solid #000";
  }

  document.addEventListener(e, onPress);
  document.addEventListener('click', () => {
    document.querySelector('#background-music').play();
  })

  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext("2d");

  currentState = states.Splash;
  document.body.appendChild(canvas);

  var img = new Image();
  img.src = "res/sheet.png";
  img.onload = function() {
    initSprites(this);
    ctx.fillStyle = s_bg.color;

    okButton = {
      x: (width - s_buttons.Ok.width) / 2,
      y: height - 200,
      width: s_buttons.Ok.width,
      height: s_buttons.Ok.height
    };
    run();
  };
}
