function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const playToken = (row, column, player) => {
        const chosenCell = board[row][column];
        if (chosenCell.getOccupant() !== 0) return false;
        chosenCell.addToken(player);
        return true;
    }

    const printBoard = () => {
        const boardWithOccupants = board.map((row) =>
        row.map((cell) => cell.getOccupant())
        );
        console.log(boardWithOccupants);
    };

    return { getBoard, playToken, printBoard };
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

    display.renderBoard();

    const boxButtons = document.querySelectorAll(".box");
    boxButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const row = button.id[0];
            const column = button.id[2];
            console.log(row, column);
            playTurn(row, column);
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

    const announceRound = () => {
        board.printBoard();
        console.log(`It's ${getActivePlayer().name}'s turn.`);
    }

    const checkForWinner = () => {
        const currentBoard = board.getBoard();
        const availableCells = currentBoard.flat().filter(cell => cell.getOccupant() === 0);
        if (availableCells.length === 0) {
            console.log("Game over! All available cells have been occupied, and sadly there is no winner...")
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
            console.log(`${getActivePlayer().name} wins!`);
            return true;
        }
    }

    const playTurn = (row, column) => {
        const success = board.playToken(row, column, getActivePlayer().token);
        if (!success) {
            console.log("Invalid move. That cell has already been occupied.");
        } else {
            console.log(`${getActivePlayer().name} has occupied cell ${row},${column}.`)
            if (checkForWinner()) {
                console.log("Great game! Thanks for playing. Here's the final board:")
                board.printBoard();
            } else {
                switchPlayerTurn();
                announceRound();
            }
        }
    }

    return { playTurn, announceRound, getActivePlayer, };
}

function Display() {
    const gameBoard = GameBoard();

    const fragment = document.createDocumentFragment();
    const boardContainer = document.querySelector(".board");

    const renderBoard = () => {
        const board = gameBoard.getBoard();

        board.forEach((row, rowIndex) => {
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

    const updateBoard = () => {
        board.getOccupant();
    }

    return { renderBoard };
}

const game = GameController();