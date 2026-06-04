function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const display = Display();

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    return { getBoard, };
}

function Cell() {
    let occupant = 0;

    const addToken = (player) => { occupant = player; };

    const getOccupant = () => occupant;

    return { addToken, getOccupant, };
}

function GameController() {
    const board = GameBoard();
    const display = Display();
    const message = Message();

    display.renderBoard(board);

    const boxButtons = document.querySelectorAll(".box");
    boxButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const row = Number(button.id[0]);
            const column = Number(button.id[2]);
            if (checkForWinner()) return;
            playTurn(row, column, button);
        })
    })

    const players = [
        {
            name: "Player One",
            token: 1,
        },
        {
            name: "Player Two",
            token: 2,
        }
    ]

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkForWinner = () => {
        const currentBoard = board.getBoard();
        const availableCells = currentBoard.flat().filter(cell => cell.getOccupant() === 0);
        if (availableCells.length === 0) {
            message.announceTie();
            return true;
        }
        
        const isWinningRow = (row) => {
            const occupants = row.map(cell => cell.getOccupant());
            return occupants[0] !== 0 && occupants.every(occupant => occupant === occupants[0]);
        }
        
        const column1 = currentBoard.map(function(occupant, index) { return occupant[0]; })
        const column2 = currentBoard.map(function(occupant, index) { return occupant[1]; })
        const column3 = currentBoard.map(function(occupant, index) { return occupant[2]; })

        const isWinningColumn = (column) => {
            const occupants = column.map(cell => cell.getOccupant());
            return occupants[0] !== 0 && occupants.every(occupant => occupant === occupants[0]);
        }

        const leftRightDiagonal = [];
        leftRightDiagonal.push(currentBoard[0][0].getOccupant(), currentBoard[1][1].getOccupant(), currentBoard[2][2].getOccupant());

        const rightLeftDiagonal = [];
        rightLeftDiagonal.push(currentBoard[0][2].getOccupant(), currentBoard[1][1].getOccupant(), currentBoard[2][0].getOccupant());

        const isWinningDiagonal = (diagonal) => {
            return diagonal[0] !== 0 && diagonal.every(occupant => occupant === diagonal[0]);
        }
        
        if (isWinningRow(currentBoard[0]) 
            || isWinningRow(currentBoard[1]) 
            || isWinningRow(currentBoard[2])
            || isWinningColumn(column1)
            || isWinningColumn(column2)
            || isWinningColumn(column3)
            || isWinningDiagonal(leftRightDiagonal)
            || isWinningDiagonal(rightLeftDiagonal)
        ) {
            return true;
        }
    }

    const playTurn = (row, column) => {
        const chosenCell = board.getBoard()[row][column];
        console.log(`${chosenCell}`);

        if (chosenCell.getOccupant() !== 0) return;
        chosenCell.addToken(getActivePlayer().token);
        display.renderToken(row, column, getActivePlayer().token);
        if (checkForWinner()) {
                message.announceWinner();
            } else {
                switchPlayerTurn();
                message.announceRound();
            };
    }

    return { playTurn, getActivePlayer, };
}

function Display() {
    const fragment = document.createDocumentFragment();
    const boardContainer = document.querySelector(".board");

    const renderBoard = (board) => {
        const currentBoard = board.getBoard();
        currentBoard.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const box = document.createElement("button");
                box.id = `${rowIndex}[${colIndex}]`;
                box.textContent = box.id;
                box.classList.add("box");
                fragment.appendChild(box);
            })
        })
        boardContainer.appendChild(fragment);
    }

    const renderToken = (row, column, player) => {
        const currentButton = document.getElementById(`${row}[${column}]`);
        if (player === 1) currentButton.classList.add("player-one");
        if (player === 2) currentButton.classList.add("player-two");
    }

    return { renderBoard, renderToken, };
}

function Message() {
    const messageDiv = document.querySelector(".message");

    const announceRound = () => { messageDiv.textContent = `It's ${getActivePlayer().name}'s turn.`; };

    const announceWinner = () => { messageDiv.textContent = `${getActivePlayer().name} wins!`; };

    const announceTie = () => { messageDiv.textContent = "Game over! All available cells have been occupied, and sadly there is no winner..."; };

    return { announceRound, announceWinner, announceTie }
}

const game = GameController();