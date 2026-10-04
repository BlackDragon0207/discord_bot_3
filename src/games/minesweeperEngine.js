class MinesweeperGame {
    constructor(width, height, mines) {
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.board = this.generateBoard();
        this.revealed = Array.from({ length: height }, () => Array(width).fill(false));
        this.gameOver = false;
        this.victory = false;
    }

    generateBoard() {
        const board = Array.from({ length: this.height }, () => Array(this.width).fill(0));
        let placed = 0;

        while (placed < this.mines) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (board[y][x] === '💣') continue;

            board[y][x] = '💣';
            placed++;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width && board[ny][nx] !== '💣') {
                        board[ny][nx]++;
                    }
                }
            }
        }
        return board;
    }

    reveal(x, y) {
        if (this.revealed[y][x] || this.gameOver) return;
        this.revealed[y][x] = true;

        if (this.board[y][x] === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy, nx = x + dx;
                    if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width) {
                        if (!this.revealed[ny][nx]) this.reveal(nx, ny);
                    }
                }
            }
        }

        // 승리 체크
        if (this.checkVictory()) {
            this.gameOver = true;
            this.victory = true;
        }
    }

    checkVictory() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] !== '💣' && !this.revealed[y][x]) return false;
            }
        }
        return true;
    }
}

module.exports = MinesweeperGame;
