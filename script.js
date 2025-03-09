const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls ion-icon");

let foodX;
let foodY;
let gameOver = false;
let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let clearIntervalid;
let score = 0;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const getLeaderboard = () =>
  JSON.parse(localStorage.getItem("leaderboard")) || [];
const updateLeaderboard = (name, score) => {
  if (score === 0) return false;
  let leaderboard = getLeaderboard();
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
};

let reiting = document.querySelector(".reiting div");
console.log(reiting);

const readTop = () => {
  let data = getLeaderboard();
  reiting.innerHTML = data
    .map((el, index) => `<p>${index + 1}.  ${el.name} score: ${el.score}</p>`)
    .join("");
};

const handleGameOver = () => {
  clearInterval(clearIntervalid);
  const playerName = prompt("Game Over! Enter your name:");
  if (playerName) {
    updateLeaderboard(playerName, score);
    readTop();
  }
};

let highScore = localStorage.getItem(`high-score`) || 0;

highScoreElement.innerText = `High score 🔥: ${highScore}`;
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) =>
  key.addEventListener("click", () =>
    changeDirection({
      key: key.dataset.key,
    })
  )
);

// Функция для обновления игрового поля
const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`;
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push(foodX, foodY);
    score++;
    highScore = score >= highScore ? score : highScore;
    scoreElement.innerText = `Score: ${score}`;

    localStorage.setItem("high-score", highScore);
  }
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];
  snakeX += velocityX;
  snakeY += velocityY;
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }
  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
clearIntervalid = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection, readTop());
