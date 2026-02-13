export const GRID_SIZE = 20;
export const TILE_COUNT = 15; // 15x15 grid

export class SnakeGame {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    
    // Calculate actual tile size based on canvas dimensions
    this.tileSize = width / TILE_COUNT;
    
    this.reset();
  }

  reset() {
    this.snake = [
      { x: 5, y: 5 }, // Head
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    this.velocity = { x: 1, y: 0 }; // Moving right initially
    this.food = this.spawnFood();
    this.score = 0;
    this.gameOver = false;
    this.paused = false;
    
    // Input buffer to prevent multiple turns in one tick
    this.nextVelocity = { x: 1, y: 0 };
  }

  spawnFood() {
    let food;
    // Keep trying until food doesn't spawn on snake
    while (true) {
      food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
      };
      
      const onSnake = this.snake.some(segment => segment.x === food.x && segment.y === food.y);
      if (!onSnake) break;
    }
    return food;
  }

  update() {
    if (this.gameOver || this.paused) return;

    this.velocity = this.nextVelocity;

    const head = { ...this.snake[0] };
    head.x += this.velocity.x;
    head.y += this.velocity.y;

    // Check Wall Collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      this.gameOver = true;
      return;
    }

    // Check Self Collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(head);

    // Check Food Collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.spawnFood();
      // Don't pop, so snake grows
    } else {
      this.snake.pop();
    }
  }

  draw() {
    const ctx = this.ctx;
    
    // Clear background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Food
    ctx.fillStyle = '#ff4d4d';
    const padding = 2;
    ctx.fillRect(
      this.food.x * this.tileSize + padding,
      this.food.y * this.tileSize + padding,
      this.tileSize - padding * 2,
      this.tileSize - padding * 2
    );

    // Draw Snake
    ctx.fillStyle = '#4CAF50';
    this.snake.forEach((segment, index) => {
      // Head is slightly darker
      if (index === 0) ctx.fillStyle = '#388E3C';
      else ctx.fillStyle = '#4CAF50';

      ctx.fillRect(
        segment.x * this.tileSize + padding,
        segment.y * this.tileSize + padding,
        this.tileSize - padding * 2,
        this.tileSize - padding * 2
      );
    });
    
    // Draw Game Over Overlay
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, this.width, this.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', this.width / 2, this.height / 2);
    }
  }

  handleInput(direction) {
    if (this.gameOver) return;

    // Prevent reversing direction directly
    switch (direction) {
      case 'UP':
        if (this.velocity.y === 0) this.nextVelocity = { x: 0, y: -1 };
        break;
      case 'DOWN':
        if (this.velocity.y === 0) this.nextVelocity = { x: 0, y: 1 };
        break;
      case 'LEFT':
        if (this.velocity.x === 0) this.nextVelocity = { x: -1, y: 0 };
        break;
      case 'RIGHT':
        if (this.velocity.x === 0) this.nextVelocity = { x: 1, y: 0 };
        break;
    }
  }
}
