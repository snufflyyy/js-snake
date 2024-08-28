const gameCanvas = document.getElementById("gameCanvas");
const gameCanvasColor = "#282828";

const context = gameCanvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const resetButton = document.getElementById("resetButton");

const tileSize = 25;

const snakeColor = "#023e8a";
const snakeHeadColor = "#0077b6";
const foodColor = "red";

let gameOver = false;
let score = 0;

// input
window.addEventListener("keydown", input);

// input queue
let inputQueue = []

let applePosition = {x: 0, y: 0};

let snakePositions = [
    {x: (gameCanvas.width / tileSize / 2) * tileSize,
     y: (gameCanvas.height / tileSize / 2) * tileSize}
];
let snakeDirection = "none";

function resetApple() {
  let x =
    Math.floor(Math.random() * (gameCanvas.width / tileSize)) * tileSize;
  let y =
    Math.floor(Math.random() * (gameCanvas.height / tileSize)) * tileSize;
    
  for (let i = 0; i < snakePositions.length - 1; i++) {
    if (x == snakePositions[i].x && y == snakePositions[i].y) {
      resetApple();
    }
  }

  applePosition.x = x;
  applePosition.y = y;
}

function drawApple() {
  context.fillStyle = foodColor;
  context.fillRect(applePosition.x, applePosition.y, tileSize, tileSize);
}

function resetSnake() {
  snakePositions = [
    {x: (gameCanvas.width / tileSize / 2) * tileSize,
     y: (gameCanvas.height / tileSize / 2) * tileSize}
  ];

  snakeDirection = "none";
}

function addSnakePeice() {
  snakePositions.push({x: snakePositions[0].x, y: snakePositions[0].y});
}

function input(event) {
  switch (event.keyCode) {
    case 38:
    case 87:
      if (snakeDirection != "down") {
        inputQueue.push("up");
      }
      break;
    case 40:
    case 83:
      if (snakeDirection != "up") {
        inputQueue.push("down");
      }
      break;
    case 37:
    case 65:
      if (snakeDirection != "right") {
        inputQueue.push("left");
      }
      break;
    case 39:
    case 68:
      if (snakeDirection != "left") {
        inputQueue.push("right");
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

  if (inputQueue[0]) {
    snakeDirection = inputQueue[0];

    inputQueue.pop(0);
    for (let i = inputQueue.length - 1; i > 0; i--) {
      inputQueue[i] = inputQueue[i - 1];
    }
  }

  // head positions (switch to vec2)
  const head = {x: snakePositions[0].x, y: snakePositions[0].y};
  
  // bounds check
  if (
    head.x < 0 ||
    head.x >= gameCanvas.width ||
    head.y < 0 ||
    head.y >= gameCanvas.height
  ) {
    gameOver = true;
  }

  // apple check
  if (head.x == applePosition.x && head.y == applePosition.y) {
    addSnakePeice();
    resetApple();

    score++;
    scoreText.innerHTML = score;
  }

  // body check
  if (snakePositions.length > 1) {
    for (let i = 1; i < snakePositions.length - 1; i++) {
      if (head.x == snakePositions[i].x && head.y == snakePositions[i].y) {
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
