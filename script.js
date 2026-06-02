/* Pseudocode

1. Create gameBoard array, using a for loop to create 9 objects representing each square of the board.
2. Create gameController function, which will contain player1 and player2 objects. Will track if they're "X" or "O", number of turns taken and which square of the board they last played on.
3. 

*/

function gameBoard() {
    const cells = 9;
    const board = [];

    for (let i = 0; i < cells; i++) {
        board[i] = [];
        board[i].push(Cell());
    }

    const playTurn = (position, player) => {
        const availableCells = board.filter(board => board.occupant === 0);
        if(!availableCells.length) return;

        const chosenCell = board.cell[position];
        chosenCell.addToken(player);
    }
    console.log(board);
}

function Cell() {
    let occupant = 0;
    
    const addToken = (player) => {
        occupant = player;
    }

    const getOccupant = () => occupant;

    return {
        addToken,
        getOccupant,
    }
}

function gameController() {
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

    const board = gameBoard();

    let activePlayer = players[0];

    const getActivePlayer = () => {activePlayer};
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    function playTurn(position) {
        
    }

    playTurn(3);
    console.log(gameBoard());
}