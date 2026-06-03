/* Pseudocode

1. Create gameBoard array, using a for loop to create 9 objects representing each square of the board.
2. Create gameController function, which will contain player1 and player2 objects. Will track if they're "X" or "O", number of turns taken and which square of the board they last played on.
3. 

*/

function gameBoard() {
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
        if (chosenCell.getOccupant() !== 0) return;
        chosenCell.addToken(player);
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

function gameController() {
    const board = gameBoard();

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

    const playTurn = (row, column) => {
        console.log(`${getActivePlayer().name} has occupied cell ${row},${column}.`)
        board.playToken(row, column, getActivePlayer().token);

        switchPlayerTurn();
        announceRound();
    }

    announceRound();

    return { playTurn, announceRound, getActivePlayer, };
}

const game = gameController();