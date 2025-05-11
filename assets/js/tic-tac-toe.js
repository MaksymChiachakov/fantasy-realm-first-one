
(function () {
    const body = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const gameModal = document.getElementById('gameModal');


    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        themeToggleBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    let currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Створюємо об'єкт аудіо   
    let bg_music = new Audio("../assets/audio/music.mp3");
    bg_music.loop = true;
    bg_music.volume = 0.7;

    // Дочекаємося взаємодії користувача (будь-який клік)
    document.addEventListener('click', function startMusic() {
        bg_music.play().catch((e) => console.warn("Автовідтворення заблоковане:", e));
        document.removeEventListener('click', startMusic); // більше не слухаємо
    });

    // Close modal when clicking outside content
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            gameModal.style.display = 'none';
        }
    });

    const userRaceSelect = document.getElementById('userRace');
    const opponentRaceSelect = document.getElementById('opponentRace');
    const startButton = document.getElementById('startButton');
    const gameBoard = document.getElementById('gameBoard');
    const selectionContainer = document.getElementById('selectionContainer');
    const resultMessage = document.getElementById('resultMessage');
    const restartButton = document.getElementById('restartButton');
    const strikeLine = document.getElementById('strikeLine');

    let board = Array(9).fill(null);
    let userRace = 'Elves';
    let opponentRace = 'Orcs';
    let userSymbol = 'X';
    let opponentSymbol = 'O';
    let isGameOver = false;
    let scores = JSON.parse(localStorage.getItem("tictactoeScores")) || {
        Elves: 0,
        Orcs: 0,
        Dragons: 0,
        Dwarves: 0
    };

    function updateScoreDisplay() {
        for (let race in scores) {
            const el = document.getElementById(`score-${race.toLowerCase()}`);
            if (el) el.textContent = `${race}: ${scores[race]}`;
        }
    }

    updateScoreDisplay();

    let cellRects = [];
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function createBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', `Cell ${i + 1}`);
            cell.setAttribute('tabindex', '0');
            cell.dataset.index = i;
            cell.addEventListener('click', onCellClick);
            cell.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCellClick(e);
                }
            });
            gameBoard.appendChild(cell);
        }

        window.requestAnimationFrame(() => {
            cellRects = Array.from(gameBoard.children).map(cell => {
                const rect = cell.getBoundingClientRect();
                const parentRect = gameBoard.getBoundingClientRect();
                return {
                    left: rect.left - parentRect.left + rect.width / 2,
                    top: rect.top - parentRect.top + rect.height / 2
                };
            });
        });
    }

    function onCellClick(event) {
        if (isGameOver) return;
        const index = event.currentTarget.dataset.index;
        if (board[index] !== null) return;
        playerMove(index);
    }

    function playerMove(index) {
        board[index] = userSymbol;
        renderBoard();
        if (checkWin(userSymbol)) {
            finishGame(userRace, getWinningCells(userSymbol));
            return;
        }
        if (board.every(cell => cell !== null)) {
            finishGame(null, []);
            return;
        }

        isGameOver = true;
        setTimeout(() => {
            computerMove();
            isGameOver = false;
        }, 500);
    }

    function computerMove() {
        const freeIndices = board.reduce((acc, val, idx) => val === null ? acc.concat(idx) : acc, []);
        if (freeIndices.length === 0) return;
        const randomIndex = freeIndices[Math.floor(Math.random() * freeIndices.length)];
        board[randomIndex] = opponentSymbol;
        renderBoard();
        if (checkWin(opponentSymbol)) {
            finishGame(opponentRace, getWinningCells(opponentSymbol));
            return;
        }
        if (board.every(cell => cell !== null)) {
            finishGame(null, []);
            return;
        }
    }

    function renderBoard() {
        board.forEach((val, idx) => {
            const cell = gameBoard.children[idx];
            cell.textContent = val === null ? '' : val;
            cell.classList.toggle('occupied', val !== null);
            cell.classList.toggle('opponent', val === opponentSymbol);
            cell.style.color = val === userSymbol ? 'var(--user-color)' : 'var(--opponent-color)';
        });
    }

    function checkWin(symbol) {
        return winningLines.some(combo => combo.every(idx => board[idx] === symbol));
    }

    function getWinningCells(symbol) {
        return winningLines.find(combo => combo.every(idx => board[idx] === symbol));
    }

    function finishGame(winnerRace, winningCells) {
        isGameOver = true;
        if (winningCells && winningCells.length === 3) {
            drawStrikeLine(winningCells);
        }

        if (winnerRace) {
            scores[winnerRace] = (scores[winnerRace] || 0) + 1;
            localStorage.setItem("tictactoeScores", JSON.stringify(scores));
            updateScoreDisplay();
            resultMessage.textContent = `${winnerRace} win!`;
        } else {
            resultMessage.textContent = "It's a draw!";
        }

        // Show modal instead of just showing the restart button
        gameModal.style.display = 'flex';
        setTimeout(() => {
            gameModal.classList.add('show');
        }, 10);
    }

    function drawStrikeLine(cells) {
        if (!cells || cells.length !== 3) return;
        const [a, , c] = cells;
        const start = cellRects[a];
        const end = cellRects[c];
        if (!start || !end) return;
        strikeLine.setAttribute('x1', start.left);
        strikeLine.setAttribute('y1', start.top);
        strikeLine.setAttribute('x2', end.left);
        strikeLine.setAttribute('y2', end.top);
        strikeLine.style.opacity = '1';
    }

    function clearStrikeLine() {
        strikeLine.style.opacity = '0';
    }

    startButton.addEventListener('click', () => {
        userRace = userRaceSelect.value;
        opponentRace = opponentRaceSelect.value;
        if (userRace === opponentRace) {
            alert('Please select different races for you and the opponent.');
            return;
        }
        startGame();
    });

    restartButton.addEventListener('click', () => {
        resetGame();
    });

    function startGame() {
        board.fill(null);
        clearStrikeLine();
        resultMessage.textContent = '';
        gameModal.style.display = 'none';
        gameModal.classList.remove('show');
        selectionContainer.style.display = 'none';
        gameBoard.style.display = 'grid';
        createBoard();
        renderBoard();
        isGameOver = false;
    }

    function resetGame() {
        board.fill(null);
        clearStrikeLine();
        resultMessage.textContent = '';
        gameModal.style.display = 'none';
        gameModal.classList.remove('show');
        gameBoard.style.display = 'none';
        selectionContainer.style.display = 'block';
        isGameOver = false;
    }

    resetGame();
})();

