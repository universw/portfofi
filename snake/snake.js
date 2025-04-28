const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Create the snake
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
const gridSize = 20;
const tileCount = 20;

// Listen to key presses
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Update game loop
function gameLoop() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Game over conditions
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    alert("Game Over!");
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  } else {
    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } else {
      snake.pop();
    }
  }

  // Draw everything
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#007bff";
  snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2));

  // Draw food
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
}

// Start game loop
setInterval(gameLoop, 150);