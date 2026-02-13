import { SnakeGame } from '../../utils/snake-game';

Page({
  data: {
    score: 0,
    gameOver: false,
    width: 300,
    height: 300
  },

  onLoad() {
    this.gameLoopId = null;
    this.lastFrameTime = 0;
    this.gameSpeed = 150; // ms per move update
    this.timeSinceLastMove = 0;
    this.canvasNode = null;
    
    // Initialize Canvas
    const query = wx.createSelectorQuery();
    query.select('#gameCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;
        
        const canvas = res[0].node;
        this.canvasNode = canvas; // Store for requestAnimationFrame
        
        const width = res[0].width;
        const height = res[0].height;

        // Handle high DPI screens
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        // Scale context
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Initialize Game Logic
        this.game = new SnakeGame(canvas, width, height);
        
        // Start Loop
        this.startGameLoop();
      });
  },

  onUnload() {
    this.stopGameLoop();
  },

  startGameLoop() {
    if (!this.canvasNode) return;

    const loop = (timestamp) => {
      if (!this.lastFrameTime) this.lastFrameTime = timestamp;
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;

      this.timeSinceLastMove += deltaTime;

      if (this.timeSinceLastMove >= this.gameSpeed) {
        this.game.update();
        this.timeSinceLastMove = 0;
        
        // Sync State with UI
        if (this.data.score !== this.game.score) {
          this.setData({ score: this.game.score });
        }
        
        if (this.game.gameOver && !this.data.gameOver) {
          this.setData({ gameOver: true });
          // Optional: Vibrate on death
          wx.vibrateLong({
            fail: () => {} // Ignore failure on unsupported devices
          }); 
        }
      }

      this.game.draw();
      this.gameLoopId = this.canvasNode.requestAnimationFrame(loop);
    };

    this.gameLoopId = this.canvasNode.requestAnimationFrame(loop);
  },

  stopGameLoop() {
    if (this.canvasNode && this.gameLoopId) {
      this.canvasNode.cancelAnimationFrame(this.gameLoopId);
    }
  },

  onRestart() {
    if (this.game) {
      this.game.reset();
      this.setData({ 
        score: 0, 
        gameOver: false 
      });
      this.lastFrameTime = 0;
      // Restart loop if it was stopped (though we don't strictly stop it on game over, just stop updating logic)
      if (!this.gameLoopId) {
        this.startGameLoop();
      }
    }
  },

  // --- Input Handlers ---

  onUp() { if(this.game) this.game.handleInput('UP'); },
  onDown() { if(this.game) this.game.handleInput('DOWN'); },
  onLeft() { if(this.game) this.game.handleInput('LEFT'); },
  onRight() { if(this.game) this.game.handleInput('RIGHT'); },

  // Touch/Swipe Logic
  touchStartX: 0,
  touchStartY: 0,

  onTouchStart(e) {
    if (!e.touches[0]) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  },

  onTouchMove(e) {
    // Prevent default scrolling behavior on the canvas
    // Note: In strict native, this might need catch:touchmove in WXML
  },

  onTouchEnd(e) {
    if (!e.changedTouches[0]) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - this.touchStartX;
    const dy = touchEndY - this.touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal
      if (Math.abs(dx) > 30) { // Increased threshold slightly
        if (dx > 0) this.onRight();
        else this.onLeft();
      }
    } else {
      // Vertical
      if (Math.abs(dy) > 30) {
        if (dy > 0) this.onDown();
        else this.onUp();
      }
    }
  }
});
