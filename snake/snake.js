const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const rows = canvasSize / box;
const columns = canvasSize / box;

let snake = [{ x: 9 * box, y: 9 * box }];
let direction = null;
let food = spawnFood();
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * columns) * box,
    y: Math.floor(Math.random() * rows) * box
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#3cba54" : "#66bb6a";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#f44336";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Collision detection
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
  ) {
    alert("Game Over! Your score: " + score);
    document.location.reload();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

setInterval(drawGame, 150);