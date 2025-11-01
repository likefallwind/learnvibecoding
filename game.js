class Game1024 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.score = 0;
        this.updateScore();
        this.setupGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.renderGrid();
    }

    setupGrid() {
        const gridContainer = document.getElementById('grid-container');
        gridContainer.innerHTML = '';
        
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            gridContainer.appendChild(cell);
        }
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.handleMove(e.key);
            }
        });

        // Touch events for mobile
        const gameContainer = document.getElementById('grid-container');
        
        gameContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        gameContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });

        // Restart button
        document.getElementById('restart').addEventListener('click', () => {
            this.init();
        });

        document.getElementById('retry').addEventListener('click', () => {
            document.getElementById('game-message').classList.remove('show');
            this.init();
        });
    }

    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.handleMove('ArrowRight');
                } else {
                    this.handleMove('ArrowLeft');
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    this.handleMove('ArrowDown');
                } else {
                    this.handleMove('ArrowUp');
                }
            }
        }
    }

    handleMove(direction) {
        const previousGrid = JSON.stringify(this.grid);
        let moved = false;

        switch(direction) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved && JSON.stringify(this.grid) !== previousGrid) {
            this.addRandomTile();
            this.renderGrid();
            this.updateScore();
            
            if (this.isGameOver()) {
                setTimeout(() => {
                    this.showGameOver();
                }, 500);
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const newRow = this.mergeLine(this.grid[row]);
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
            }
            this.grid[row] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const reversed = [...this.grid[row]].reverse();
            const newRow = this.mergeLine(reversed).reverse();
            if (JSON.stringify(newRow) !== JSON.stringify(this.grid[row])) {
                moved = true;
            }
            this.grid[row] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = this.grid.map(row => row[col]);
            const newColumn = this.mergeLine(column);
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
            }
            for (let row = 0; row < this.size; row++) {
                this.grid[row][col] = newColumn[row];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = this.grid.map(row => row[col]);
            const reversed = [...column].reverse();
            const newColumn = this.mergeLine(reversed).reverse();
            if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
                moved = true;
            }
            for (let row = 0; row < this.size; row++) {
                this.grid[row][col] = newColumn[row];
            }
        }
        return moved;
    }

    mergeLine(line) {
        // Remove zeros
        let newLine = line.filter(val => val !== 0);
        
        // Merge adjacent equal values
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                this.score += newLine[i];
                newLine.splice(i + 1, 1);
            }
        }
        
        // Fill with zeros
        while (newLine.length < this.size) {
            newLine.push(0);
        }
        
        return newLine;
    }

    addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderGrid() {
        const tileContainer = document.getElementById('tile-container');
        tileContainer.innerHTML = '';
        
        const containerWidth = document.getElementById('grid-container').offsetWidth;
        const cellSize = (containerWidth - (10 * (this.size + 1))) / this.size;
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const value = this.grid[row][col];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value > 8192 ? 'super' : value}`;
                    tile.textContent = value;
                    
                    const left = col * (cellSize + 10) + 10;
                    const top = row * (cellSize + 10) + 10;
                    
                    tile.style.width = `${cellSize}px`;
                    tile.style.height = `${cellSize}px`;
                    tile.style.left = `${left}px`;
                    tile.style.top = `${top}px`;
                    tile.style.lineHeight = `${cellSize}px`;
                    
                    tileContainer.appendChild(tile);
                }
            }
        }
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        
        document.getElementById('best').textContent = this.bestScore;
    }

    isGameOver() {
        // Check for empty cells
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const current = this.grid[row][col];
                
                // Check right
                if (col < this.size - 1 && current === this.grid[row][col + 1]) {
                    return false;
                }
                
                // Check down
                if (row < this.size - 1 && current === this.grid[row + 1][col]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    showGameOver() {
        const messageElement = document.getElementById('game-message');
        messageElement.querySelector('p').textContent = 'Game Over!';
        messageElement.classList.add('show');
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game1024();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    const game = window.game1024;
    if (game) {
        game.renderGrid();
    }
});
