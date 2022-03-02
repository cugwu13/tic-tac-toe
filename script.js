const gameBoard = (() => {
    const createBoard = () => {
        return new Array(
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        );
    };
    const displayBoard = () => {
        const board = createBoard();
        const boardContainer = document.querySelector('.container');
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                const div = document.createElement('div');
                div.dataset.position = `${i}${j}`;
                div.innerText = board[i][j];
                boardContainer.appendChild(div);
            }
        }
    };
    const clearDisplayBoard = () => {
        const spots = document.querySelectorAll('.container > div');
        spots.forEach(spot => spot.innerHTML = '');
    };
    const clearArrayBoard = (board) => {
        board.forEach(row => {
            row.forEach(item => item = '');
        });
    };

    return { createBoard, displayBoard, clearDisplayBoard, clearArrayBoard };
})();

const player = (selection) => {
    const marker = () => selection;
    let score = 0;

    return { marker, score };
};

const gameController = (() => {
    const boardContainer = document.querySelector('.container');
    const gameOver = document.querySelector('.game-over');
    let winner;
    let moveCounter = 0;
    let board = gameBoard.createBoard();
    const updateBoard = (spot, marker) => {
        const position = Array.from(spot.dataset.position);
        const row = position[0];
        const col = position[1];
        board[row][col] = marker;
    };
    const displayBoard = () => gameBoard.displayBoard();
    const getSelection = () => {
        let selection;
        while (selection !== 'x' && selection !== 'X' && selection !== 'o' && selection !== 'O') {
            selection = prompt('X or O?');
        }

        return selection.toLowerCase();
    };
    let turn = 'player1';
    const player1 = player(getSelection());
    const player2 = player(player1.marker() === 'x' ? 'o' : 'x');
    const updateScores = () => {
        const scores = document.querySelector('.score');
        scores.innerText = `${player1.score} - ${player2.score}`
    }
    const loopTurns = spot => {
        if (spot.innerText !== '') {
            return;
        }
        if (turn === 'player1') {
            updateBoard(spot, player1.marker());
            spot.innerText = player1.marker().toUpperCase();
            turn = 'player2';
        } else {
            updateBoard(spot, player2.marker());
            spot.innerText = player2.marker().toUpperCase();
            turn = 'player1';
        }
        moveCounter++;
    };
    const checkThreeInRow = () => {
        const transposeBoard = (board) => {
            const newBoard = [];
            let j = 0;
            for (k = 0; k < board.length; k++) {
                let row = [];
                for (i = 0; i < board.length; i++) {
                    row.push(board[i][j]);
                }
                newBoard.push(row);
                j++;
            }
        
            return newBoard;
        };
        const checkRowAndCol = (board) => {
            board.forEach(row => {
                let totalX = 0;
                let totalO = 0;
                row.forEach(item => {
                    if (item === 'x') totalX++;
                    if (totalX === 3) endGame('x');
                    if (item === 'o') totalO++;
                    if (totalO === 3) endGame('o');
                });
            });
        };
        const checkDiagonals = (board) => {
            let totalX = 0;
            let totalO = 0;
            for (let item of [board[0][0], board[1][1], board[2][2]]) {
                if (item === 'x') totalX++;
                if (totalX === 3) endGame('x');
                if (item === 'o') totalO++;
                if (totalO === 3) endGame('o');
            }
            totalX = 0;
            totalO = 0;
            for (let item of [board[0][2], board[1][1], board[2][0]]) {
                if (item === 'x') totalX++;
                if (totalX === 3) endGame('x');
                if (item === 'o') totalO++;
                if (totalO === 3) endGame('o');
            }
        };
        checkRowAndCol(board);
        const newBoard = transposeBoard(board);
        checkRowAndCol(newBoard);
        checkDiagonals(board);
    };
    const checkTieGame = () => {
        if (moveCounter === 9 && !winner) {
            endGame('tie');
        }
    };
    const endGame = marker => {
        boardContainer.classList.add('unclickable');
        let winnerText;
        if (marker === 'tie') {
            winnerText = 'Tie game!';
        } else {
            if (player1.marker() === marker) {
                player1.score++;
                winnerText = 'Player 1 wins!';
                winner = 'player1'
            } else {
                player2.score++;
                winnerText = 'Player 2 wins!';
                winner = 'player2'
            }
        }
        updateScores();
        turn = 'player1';
        winner = null;
        moveCounter = 0;
        
        gameOver.firstElementChild.innerText = winnerText;
        gameOver.classList.remove('invisible');
        const playAgain = document.querySelector('#play-again');
        playAgain.addEventListener('click', () => resetGame());
    };
    const executeClickEvent = () => {
        displayBoard();
        const spots = document.querySelectorAll('.container > div');
        spots.forEach(spot => spot.addEventListener('click', () => {
            loopTurns(spot);
            checkThreeInRow();
            checkTieGame();
        }));
    };
    const runGame = () => {
        executeClickEvent();
    };
    const resetGame = () => {
        gameBoard.clearDisplayBoard();
        board = gameBoard.createBoard();
        boardContainer.classList.remove('unclickable');
        gameOver.classList.add('invisible');
    };
    
    return { runGame };
})();

gameController.runGame();
