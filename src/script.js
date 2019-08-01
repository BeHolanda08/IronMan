const img = new Image();
img.src = './images/Background.jpg';
const img2 = new Image();
img2.src = './images/IronMan.png';
const img3 = new Image();
img3.src = './images/Nave 2.png';
const img4 = new Image();
img4.src = './images/laser.png';
const imgBomb1 = new Image();
imgBomb1.src = './images/bomb1.png';
const soundGame = new Audio();
soundGame.src = './images/The-Avengers-Theme-Song.mp3';
const soundLaser = new Audio();
soundLaser.src = '../images/cartoon_tiro.mp3';


const myOpponent = [];
const shots = [];
let score = 0;


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const backgroundImage = {
  frames: 0,
  img,
  x: 2,
  speed: -3,

  move() {
    this.x += this.speed;
    this.x %= canvas.width;
  },

  draw() {
    ctx.drawImage(this.img, this.x, 0);
    if (this.speed < 0) {
      ctx.drawImage(this.img, this.x + canvas.width, 0);
    } else {
      ctx.drawImage(this.img, this.x - this.img.width, 0);
    }
  },

  score() {
    ctx.font = '40px verdana';
    ctx.fillStyle = 'red';
    ctx.fillText(`Score:${+score}`, 800, 40);
  },
};

class Component {
  constructor(width, height, x, y, image) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = image;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = -5;
  }

  update() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  crashWith(opponent) {
    return !(
      this.bottom() < opponent.top()
      || this.top() > opponent.bottom()
      || this.right() < opponent.left() + 50
      || this.left() > opponent.right()
    );
  }

  deathOpponent(shotArray) {
    let hit = false;
    shotArray.forEach((element) => {
      if (element.x + 10 >= this.x
        && element.y >= this.y
        && element.y <= this.y + this.height) {
        hit = true;
      }
    });
    return hit;
  }
}

const player = new Component(140, 200, 0, 80, img2);

class Shot {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.speedX = 7;
  }

  update() {
    ctx.drawImage(this.image, this.x, this.y, 50, 50);
  }

  newPos() {
    this.x += this.speedX;
  }

  checkShot(index) {
    if (this.x > canvas.width) {
      shots.splice(index, 1);
    }
  }
}

let requestId;

function shotStart(currentPlayer) {
  for (let i = 0; i < shots.length; i += 1) {
    shots[i].newPos();
    shots[i].update(currentPlayer);
    shots[i].checkShot(i);
  }
}

function checkGameOver() {
  const crashed = myOpponent.some(opponent => player.crashWith(opponent));
  if (crashed) {
    backgroundImage.cancelAnimationFrame(requestId);
  }
}

function checkDeath() {
  myOpponent.forEach((opponent, index) => {
    if (opponent.deathOpponent(shots)) {
      shots.splice(index, 1);
      score += 10;
      opponent.image = imgBomb1;
      opponent.speed = 0;
      setTimeout(() => {
        myOpponent.splice(index, 1);
      }, 500);
    }
  });
}

function updateOpponents() {
  for (let i = 0; i < myOpponent.length; i += 1) {
    myOpponent[i].x += myOpponent[i].speed;
    myOpponent[i].update();
  }
  backgroundImage.frames += 9;
  if (backgroundImage.frames % 100 === 0) {
    let position = Math.floor(Math.random() * canvas.height);
    if (position > 330) {
      position = 330;
    }
    myOpponent.push(new Component(250, 100, 1000, position, img3));
  }
}

function updateCanvas() {
  soundGame.play();
  backgroundImage.move();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundImage.draw();
  player.newPos();
  player.update();
  shotStart(player);
  updateOpponents();
  backgroundImage.score();
  checkGameOver();
  checkDeath();
  requestId = window.requestAnimationFrame(updateCanvas);
}

document.getElementById('start-button').onclick = () => {
  const startContainer = document.querySelector('.game-intro');
  startContainer.style.display = 'none';
  updateCanvas();
};

document.onkeydown = (e) => {
  switch (e.keyCode) {
    case 38:
      player.speedY = -5;
      break;
    case 40:
      player.speedY = 5;
      break;
    case 37:
      player.speedX = -5;
      break;
    case 39:
      player.speedX = 5;
      break;
    case 32:
      shots.push(new Shot(player.x + 90, player.y + 73, img4));
      break;
  }
};

document.onkeyup = () => {
  player.speedX = 0;
  player.speedY = 0;
};
