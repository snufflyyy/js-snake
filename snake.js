const gameCanvas = document.querySelector("#gameCanvas");
const gameCanvasColor = "#282828";

const context = gameCanvas.getContext("2d");

const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");

const tileSize = 25;

const snakeColor = "#023e8a";
const snakeHeadColor = "#0077b6";
const foodColor = "red";

let gameOver = false;
let score = 0;

// input
window.addEventListener("keydown", input);

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let applePosition = new Vector2(0, 0);

let snakePositions = [
  new Vector2(
    (gameCanvas.width / tileSize / 2) * tileSize,
    (gameCanvas.height / tileSize / 2) * tileSize,
  ),
];
let snakeDirection = "none";

function resetApple() {
  let x =
    Math.round(Math.random() * (gameCanvas.width / tileSize) - 1) * tileSize;
  let y =
    Math.round(Math.random() * (gameCanvas.height / tileSize) - 1) * tileSize;

  for (let i = 0; i < snakePositions.length - 1; i++) {
    if (x == snakePositions[i].x && y == snakePositions[i].y) {
      resetApple();
    }
  }

  applePosition.x =
    Math.round(Math.random() * (gameCanvas.width / tileSize)) * tileSize;
  applePosition.y =
    Math.round(Math.random() * (gameCanvas.height / tileSize)) * tileSize;
}

function drawApple() {
  context.fillStyle = foodColor;
  context.fillRect(applePosition.x, applePosition.y, tileSize, tileSize);
}

function resetSnake() {
  snakePositions = [
    new Vector2(
      (gameCanvas.width / tileSize / 2) * tileSize,
      (gameCanvas.height / tileSize / 2) * tileSize,
    ),
  ];

  snakeDirection = "none";
}

function addSnakePeice() {
  snakePositions.push(new Vector2(snakePositions[0].x, snakePositions[0].y));
}

function input(event) {
  if (event.keyCode == 32) {
    resetGame();
  }

  switch (event.keyCode) {
    case 38:
    case 87:
      if (snakeDirection != "down") {
        snakeDirection = "up";
      }
      break;
    case 40:
    case 83:
      if (snakeDirection != "up") {
        snakeDirection = "down";
      }
      break;
    case 37:
    case 65:
      if (snakeDirection != "right") {
        snakeDirection = "left";
      }
      break;
    case 39:
    case 68:
      if (snakeDirection != "left") {
        snakeDirection = "right";
      }
      break;
  }
}

function updateSnake() {
  for (let i = snakePositions.length - 1; i > 0; i--) {
    snakePositions[i].x = snakePositions[i - 1].x;
    snakePositions[i].y = snakePositions[i - 1].y;
  }

  switch (snakeDirection) {
    case "up":
      snakePositions[0].y -= tileSize;
      break;
    case "down":
      snakePositions[0].y += tileSize;
      break;
    case "left":
      snakePositions[0].x -= tileSize;
      break;
    case "right":
      snakePositions[0].x += tileSize;
      break;
  }

  // head positions (switch to vec2)
  const headX = snakePositions[0].x;
  const headY = snakePositions[0].y;

  // bounds check
  if (
    headX < 0 ||
    headX >= gameCanvas.width ||
    headY < 0 ||
    headY >= gameCanvas.height
  ) {
    gameOver = true;
  }

  // apple check
  if (headX == applePosition.x && headY == applePosition.y) {
    addSnakePeice();
    resetApple();

    score++;
    scoreText.innerHTML = score;
  }

  // body check
  if (snakePositions.length > 1) {
    for (let i = 1; i < snakePositions.length - 1; i++) {
      if (headX == snakePositions[i].x && headY == snakePositions[i].y) {
        gameOver = true;
      }
    }
  }
}

function drawSnake() {
  for (let i = 0; i < snakePositions.length; i++) {
    if (i == 0) {
      context.fillStyle = snakeHeadColor;
    } else {
      context.fillStyle = snakeColor;
    }

    context.fillRect(
      snakePositions[i].x,
      snakePositions[i].y,
      tileSize,
      tileSize,
    );
  }
}

function clearCanvas() {
  context.fillStyle = gameCanvasColor;
  context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function resetGame() {
  score = 0;
  scoreText.innerHTML = score;

  resetApple();
  resetSnake();

  gameOver = false;

  update();
}

function update() {
  if (!gameOver) {
    setTimeout(() => {
      clearCanvas();
      updateSnake();
      drawApple();
      drawSnake();
      update();
    }, 100);
  } else {
    scoreText.innerHTML = "game over! score: " + score;
  }
}

resetGame();
