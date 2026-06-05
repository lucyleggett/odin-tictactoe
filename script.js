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

    let players = [
        {
            name: "",
            token: 1,
            score: 0,
        },
        {
            name: "",
            token: 2,
            score: 0,
        }
    ]

    const nextBtn = document.querySelector(".next");
    nextBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const playerOneName = document.getElementById("player-one").value;
        players[0].name = playerOneName;
        display.transitionToNameTwo();
        });

    const readyBtn = document.querySelector(".ready");
    readyBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const playerTwoName = document.getElementById("player-two").value;
        players[1].name = playerTwoName;
        display.transitionToMain();
        display.showScores(players);
        message.announceRound(getActivePlayer());
    })

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const boxButtons = document.querySelectorAll(".box");
    boxButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const row = Number(button.id[0]);
            const column = Number(button.id[2]);
            if (checkForWinner()) return;
            playTurn(row, column, button);
        })
    })

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

    const incrementScore = () => {
        getActivePlayer().score += 1;
    }

    const playTurn = (row, column) => {
        const chosenCell = board.getBoard()[row][column];

        if (chosenCell.getOccupant() !== 0) return;
        chosenCell.addToken(getActivePlayer().token);
        display.renderToken(row, column, getActivePlayer().token);
        if (checkForWinner()) {
                incrementScore();
                message.announceWinner(getActivePlayer());
                display.transitionToResults();
            } else {
                switchPlayerTurn();
                display.switchPlayerHighlight();
                message.announceRound(getActivePlayer());
            };
            display.showScores(players);
    }

    return { playTurn, getActivePlayer, };
}

function Display() {
    const fragment = document.createDocumentFragment();
    const boardContainer = document.querySelector(".board");
    const gameInitializer = document.querySelector(".game-initializer");
    const mainGame = document.querySelector("main");
    const resultsConveyor = document.querySelector(".results-conveyor");

    const renderBoard = (board) => {
        const currentBoard = board.getBoard();
        currentBoard.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const box = document.createElement("button");
                box.id = `${rowIndex}[${colIndex}]`;
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

    const showScores = (playersArr) => {
        const p1Score = document.querySelector(".p1 > .score");
        const p2Score = document.querySelector(".p2 > .score");
        const p1Name = document.querySelector(".p1 > .name");
        const p2Name = document.querySelector(".p2 > .name");

        p1Name.textContent = `${playersArr[0].name}`;
        p2Name.textContent = `${playersArr[1].name}`;
        p1Score.textContent = `: ${playersArr[0].score}`;
        p2Score.textContent = `: ${playersArr[1].score}`;
    }

    const switchPlayerHighlight = () => {
        const p1Name = document.querySelector(".p1 > .name");
        const p2Name = document.querySelector(".p2 > .name");

        p1Name.classList.toggle("active");
        p2Name.classList.toggle("active");
    }

    const transitionToNameTwo = () => {
        const nameOneInput = document.querySelector(".name-one");
        const nameTwoInput = document.querySelector(".name-two");

        nameOneInput.classList.add("disabled");
        nameTwoInput.classList.remove("disabled");
    }

    const transitionToMain = () => {
        gameInitializer.classList.add("disabled");
        mainGame.classList.remove("disabled");
    }

    const transitionToResults = () => {
        mainGame.classList.add("disabled");
        resultsConveyor.classList.remove("disabled");
    }

    return { renderBoard, renderToken, showScores, switchPlayerHighlight, transitionToMain, transitionToNameTwo, transitionToResults };
}

function Message() {
    const mainMsg = document.querySelector(".main-message");
    const resultsMsg = document.querySelector(".results-message");

    const announceRound = (player) => { mainMsg.textContent = `It's ${player.name}'s turn.`; };

    const announceWinner = (player) => { resultsMsg.textContent = `${player.name} wins!`; };

    const announceTie = () => { resultsMsg.textContent = "Game over! All available cells have been occupied, and sadly there is no winner..."; };

    return { announceRound, announceWinner, announceTie }
}

const game = GameController();