function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = []; 
    const display = Display();

    const initializeBoard = () => {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
        return board;
    }

    const getBoard = () => board;

    return { initializeBoard, getBoard, };
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

    board.initializeBoard();
    display.renderBoard(board);

    let players = [
        {
            name: "",
            token: 1,
            score: 0,
            icon: "",
        },
        {
            name: "",
            token: 2,
            score: 0,
            icon: "",
        }
    ]

    document.querySelectorAll(".icon.p1").forEach(icon => {
        icon.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".icon").forEach(i => i.classList.remove("chosen"));
            icon.classList.add("chosen");
            players[0].icon = icon.id;
            console.log(players);
        });
    });

    document.querySelectorAll(".icon.p2").forEach(icon => {
        icon.addEventListener("click", (event) => {
            event.preventDefault();
            document.querySelectorAll(".icon").forEach(i => i.classList.remove("chosen"));
            icon.classList.add("chosen");
            players[1].icon = icon.id;
            console.log(players);
        });
    });

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
    })

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const addBoxListeners = () => {
        document.querySelectorAll(".box").forEach(button => {
            button.addEventListener("click", (event) => {
                const row = Number(button.id[0]);
                const column = Number(button.id[2]);
                if (checkForWinner()) return;
                playTurn(row, column, button);
            });
        });
    }

    addBoxListeners();

    document.querySelector(".anotherBtn").addEventListener("click", () => {
        display.transitionToFromResults();
        resetGame();
    });

    document.querySelector(".resultsBtn").addEventListener("click", () => {
        display.transitionToFinalResults();
        message.announceVictor(determineVictor());
    })

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkForWinner = () => {
        const currentBoard = board.getBoard();
        
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
        
        const availableCells = board.getBoard().flat().filter(cell => cell.getOccupant() === 0);
        
        if (checkForWinner()) {
                incrementScore();
                message.announceWinner(getActivePlayer());
                display.transitionToFromResults();
            } else if (availableCells.length === 0) {
                message.announceTie();
                display.transitionToFromResults();
            } else {
                switchPlayerTurn();
                display.switchPlayerHighlight();
            };
            display.showScores(players);
    }

    const resetGame = () => {
        board.initializeBoard();
        display.resetBoard();
        addBoxListeners();
        activePlayer = players[0];
        display.switchPlayerHighlight();
    }

    const determineVictor = () => {
        player1Score = players[0].score;
        player2Score = players[1].score;
        let winner;

        if (player1Score === player2Score) {
            winner = "Nobody...";
        } else if (player1Score > player2Score) {
            winner = `${players[0].name}`;
        } else {
            winner = `${players[1].name}`;
        }
        return winner;
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
        document.querySelector(".p1 > .name").textContent = `${playersArr[0].name}`;
        document.querySelector(".p2 > .name").textContent = `${playersArr[1].name}`;
        document.querySelector(".p1 > .score").textContent = `: ${playersArr[0].score}`;
        document.querySelector(".p2 > .score").textContent = `: ${playersArr[1].score}`;
    }

    const switchPlayerHighlight = () => {
        document.querySelector(".p1 > .name").classList.toggle("active");
        document.querySelector(".p2 > .name").classList.toggle("active");
    }

    const transitionToNameTwo = () => {
        document.querySelector(".name-one").classList.add("disabled");
        document.querySelector(".name-two").classList.remove("disabled");
        document.getElementById("player-two").focus();
    }

    const transitionToMain = () => {
        document.querySelector(".game-initializer").classList.add("disabled");
        document.querySelector("main").classList.remove("disabled");
    }

    const transitionToFromResults = () => {
        document.querySelector(".blur-overlay").classList.toggle("disabled");
        document.querySelector(".results-conveyor").classList.toggle("disabled");
    }

    const resetBoard = (board) => {
        boardContainer.innerHTML = "";
        const newFragment = document.createDocumentFragment();
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const box = document.createElement("button");
            box.id = `${i}[${j}]`;
            box.classList.add("box");
            newFragment.appendChild(box);
        }
    }
    boardContainer.appendChild(newFragment);
}

    const transitionToFinalResults = () => {
        document.querySelector("main").classList.add("disabled");
        document.querySelector(".blur-overlay").classList.add("disabled");
        document.querySelector(".results-conveyor").classList.add("disabled");
        document.querySelector(".final-results").classList.remove("disabled");
    }

    return { renderBoard, renderToken, showScores, switchPlayerHighlight, transitionToMain, transitionToNameTwo, transitionToFromResults, transitionToFinalResults, resetBoard };
}

function Message() {
    const mainMsg = document.querySelector(".main-message");
    const resultsMsg = document.querySelector(".results-message");

    const announceWinner = (player) => { resultsMsg.textContent = `${player.name} won!`; };

    const announceTie = () => { resultsMsg.textContent = "Game over! It's a tie..."; };

    const announceVictor = (victor) => {
        document.querySelector(".drumroll").textContent = "And the winner is...";
        document.querySelector(".victor").textContent = `${victor}`;
    }

    return { announceWinner, announceTie, announceVictor, }
}

const game = GameController();