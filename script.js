/* Pseudocode

1. Create gameBoard array, using a for loop to create 9 objects representing each square of the board.
2. Create gameController function, which will contain player1 and player2 objects. Will track if they're "X" or "O", number of turns taken and which square of the board they last played on.
3. 

*/

function gameBoard() {
    const cells = 9;
    const arr = [];

    for (let i = 0; i < cells; i++) {
        arr.push(i);
    }

    const board = arr.map((index) => {
        return {
            position: index,
            occupant: 0,
        }
    })

    const availableCells = board.filter(board => board.occupant === 0)
    
    console.log(availableCells);
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
        board[position]
    }
}