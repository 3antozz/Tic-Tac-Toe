(function init (){
    const board = GameBoard();
    const game = GameController(board);
    const DOMHandler = DOMRender(board);
    clickHandler(board, game, DOMHandler);
})()

function GameBoard () {
    const board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

    const getCellState = (row, column) => {
        console.log(board[row][column]);
        return board[row][column];
    }
    const printBoard = () => console.log(board);
    const getBoardState = () => board;
    const dropMark = function (row, column, playermark) {
        if (!(board[row][column])) {
            board[row][column] = playermark;
            return true;
        }
        else {
            console.log("Already checked");
            return false;
        }
    }
    const clearBoard = function () {
        board.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                board[rowIndex][columnIndex] = 0;
            });
        });
    }

    return {getBoardState, getCellState, printBoard, dropMark, clearBoard};
};


function Player (nameone, nametwo) {

        const playerOne = {
            name: nameone,
            mark: "X"
        };

        const playerTwo = {
            name: nametwo,
            mark: "O"
        };

        const printPlayers = () => console.log(playerOne, playerTwo);

        return {playerOne, playerTwo, printPlayers};
}



function GameController (board) {
    const players = Player("3antozz", "Haithem");
    const boardState = board.getBoardState();
    const playerOne = players.playerOne;
    const playerTwo = players.playerTwo;
    board.printBoard();
    let activePlayer;

    const setActivePlayer = function (player) {
        activePlayer = player;
        console.log("it's " + activePlayer.name + "'s turn...");
    }

    const getActivePlayer = function () {
        console.log("it's " + activePlayer.name + "'s turn...");
    }

    setActivePlayer(playerTwo);


    const playRound = function (row, column) {
        const turnPlay = board.dropMark(row, column, activePlayer.mark);
        board.printBoard();
        const checkWinner = GameOverCondition(boardState);
        if (checkWinner) {
            endGame(checkWinner);
        }
        else {
            if (!turnPlay){
                setActivePlayer(activePlayer) ;
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

function DOMRender (board) {
    const gridContainer = document.querySelector(".grid-container");
    const boardState = board.getBoardState();

    const renderGrid = function (board) {
        gridContainer.textContent = "";
        board.forEach((row, rowIndex) => {
            row.forEach((cell, column) => renderCell(cell, rowIndex, column));
            
        });

    }

    const renderCell = function (cell, row, column) {
        const cellDiv = document.createElement("button");;
        if (!cell) {
            cellDiv.textContent = "";
        }
        else {
            cellDiv.textContent = cell;
        }
        cellDiv.classList.add("cell");
        cellDiv.dataset.row = row;
        cellDiv.dataset.column = column;
        gridContainer.append(cellDiv);
    }

    const updateCell = function (cellDOM, row, column) {
        const cellState = board.getCellState(row, column);
        cellDOM.textContent = cellState;
    }






    renderGrid(boardState);


    return {renderGrid, updateCell}
}

function clickHandler (board, game, DOMHandler) {
    const restartBtn = document.querySelector(".restart");
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.addEventListener("click", (event) => {
        let cellDOM = event.target;
        let cell = event.target.dataset;
        game.playRound(cell.row, cell.column);
        DOMHandler.updateCell(cellDOM, cell.row, cell.column);
    });

    restartBtn.addEventListener("click", () => {
        const boardState = board.getBoardState();
        board.clearBoard();
        DOMHandler.renderGrid(boardState);
    })
}



// const game = GameController();