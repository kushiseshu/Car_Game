const score = document.querySelector('.score');
const highScore = document.querySelector('.highScore');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

let player = {
  speed: 5,
  score: 0,
  highScore: 0
};

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyup(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function Start() {
  gameArea.innerHTML = "";
  startScreen.classList.add('hide');
  player.isStart = true;
  player.score = 0;
  player.speed = 5;
  window.requestAnimationFrame(Play);

  for (let i = 0; i < 5; i++) {
    let roadLines = document.createElement('div');
    roadLines.setAttribute('class', 'roadLines');
    roadLines.y = (i * 140);
    roadLines.style.top = roadLines.y + "px";
    gameArea.appendChild(roadLines);
  }

  for (let i = 0; i < 3; i++) {
    let Opponents = document.createElement('div');
    Opponents.setAttribute('class', 'Opponents');
    Opponents.y = ((i) * -300);
    Opponents.style.top = Opponents.y + "px";
    Opponents.style.left = Math.floor(Math.random() * 350) + "px";
    Opponents.style.backgroundColor = randomColor();
    gameArea.appendChild(Opponents);
  }

  let car = document.createElement('div');
  car.setAttribute('class', 'car');
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;
  car.style.left = player.x + 'px';
  car.style.top = player.y + 'px';
}

function randomColor() {
  let r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  let g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  let b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function Play() {
  let car = document.querySelector('.car');
  let road = gameArea.getBoundingClientRect();

  if (player.isStart) {
    moveLines();
    moveOpponents(car);

    if (keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;
    if (keys.ArrowDown && player.y < (road.height - 75)) player.y += player.speed;
    if (keys.ArrowRight && player.x < 350) player.x += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    score.innerHTML = "Score: " + player.score;
    if (player.highScore < player.score) {
      player.highScore = player.score;
      highScore.innerHTML = "HighScore: " + player.highScore;
    }

    player.score++;
    player.speed += 0.01;
    window.requestAnimationFrame(Play);
  }
}

function moveLines() {
  let roadLines = document.querySelectorAll('.roadLines');
  roadLines.forEach(item => {
    if (item.y >= 700) item.y -= 700;
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function moveOpponents(car) {
  let Opponents = document.querySelectorAll('.Opponents');
  Opponents.forEach(item => {
    if (isCollide(car, item)) {
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
      item.style.backgroundColor = randomColor();
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    (aRect.top > bRect.bottom) ||
    (aRect.bottom < bRect.top) ||
    (aRect.right < bRect.left) ||
    (aRect.left > bRect.right)
  );
}

function endGame() {
  player.isStart = false;
  startScreen.classList.remove('hide');
  startScreen.innerHTML = `
    <button class="startBtn">Restart Game</button>
    <p>Game Over!<br>Your score: ${player.score}<br><br>INSTRUCTIONS:<br>
    Use Arrow keys to move the car<br>
    Avoid hitting other cars</p>
  `;
  document.querySelector('.startBtn').addEventListener('click', Start);
}

// Initial start button listener
document.querySelector('.startBtn').addEventListener('click', Start);
