(function init (){
    GameBoard();
    // GameController();
})()

function GameBoard () {
    const board = [
    ["O","X","O"],
    ["X","O","O"],
    [0,"X","X"]
];


    const printBoard = () => console.log(board);
    const getBoardState = () => board;
    const dropToken = function (row, column, playerToken) {
        if (!(board[row][column])) {
            board[row][column] = playerToken;
        }
        else {
            console.log("Already checked");
        }
    }

    return {getBoardState, printBoard, dropToken};
};


function Player (nameone, nametwo) {

        const playerOne = {
            name: nameone,
            token: "X"
        };

        const playerTwo = {
            name: nametwo,
            token: "O"
        };

        const printPlayers = () => console.log(playerOne, playerTwo);

        return {playerOne, playerTwo, printPlayers};
}



function GameController () {
    const players = Player("3antozz", "Haithem");
    const board = GameBoard();
    const boardState = board.getBoardState();
    const playerOne = players.playerOne;
    const playerTwo = players.playerTwo;
    let activePlayer;

    const setActivePlayer = function (player) {
        activePlayer = player;
        console.log("it's " + activePlayer.name + "'s turn...");
    }

    const getActivePlayer = function (activePlayer) {
        console.log("it's " + activePlayer.name + "'s turn...");
    }

    setActivePlayer(playerOne);


    const playRound = function (row, column) {
        board.dropToken(row, column, activePlayer.token);
        board.printBoard();
        const checkWinner = GameOverCondition(boardState);
        if (checkWinner) {
            endGame(checkWinner);
        }
        else {
            if (activePlayer === playerOne) {
                setActivePlayer(playerTwo);
            }
            else {
                setActivePlayer(playerOne);
            }
        }
    }

    const GameOverCondition = function(board) {
        const rowWin = function () {
            for (row of board) {
                if (row[0] === row[1] && row[1] === row[2] && row[1] !== 0) {
                    return true;
                }
            }
        };

        const columnWin = function () {
            if(board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[1][0]!== 0 || board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[1][1] !== 0 || board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[1][2] !== 0 ) {
                return true;
            }
        }

        const diagonalWin = function () {
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[1][1] !== 0 || board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[1][1] !== 0) {
                return true;
            }
        }

        const tie = function () {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        // const tie = function () {
        //     for (let row of board) {
        //         for (let column of row) {
        //             if (column === 0) {
        //                 return false;
        //             }
        //         }
        //     }
        //     return true;
        // }


        if (rowWin() || columnWin() || diagonalWin()) {
            return true;
        }
        else if (tie()){
            return "tie";
        }
        else {
            return false;
        }
    }

    const endGame = function (decision){
        if (decision === true) {
            console.log("Game over! " + activePlayer.name + " wins!" )
        }
        else {
            console.log("Game over! it's a Tie!" )
        }
    }


    return {getActivePlayer, playRound};
}



const game = GameController();