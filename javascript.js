(function init (){
    const startBtn = document.querySelector(".start");
    const playerOneInput = document.querySelector(".p1-name > input");
    const playerTwoInput = document.querySelector(".p2-name > input");
    const p1Toggle = document.querySelector(".toggle-one");
    const p2Toggle = document.querySelector(".toggle-two");
    const board = GameBoard();
    const DOMHandler = DOMRender(board);
    const form = document.querySelector("form");

    const startGame = (function () {
        startBtn.addEventListener("click", () => {
            if (form.checkValidity()) {
                const playerOneName = playerOneInput.value;
                const playerTwoName = playerTwoInput.value;
                const playerOneMark = p1Toggle.textContent;
                const playerTwoMark = p2Toggle.textContent;
                const players = Player(playerOneName, playerOneMark, playerTwoName, playerTwoMark);
                const game = GameController(board, players);
                boardClicksHandler(board, game, DOMHandler);
                DOMHandler.renderPlayers(playerOneName, playerOneMark, playerTwoName, playerTwoMark);
                DOMHandler.renderActivePlayer(game.getActivePlayer());
            }
        })
    
        p1Toggle.addEventListener("click", () => {
            DOMHandler.switchPlayerMark(p1Toggle);
            DOMHandler.switchPlayerMark(p2Toggle);
        });
        p2Toggle.addEventListener("click", () => {
            DOMHandler.switchPlayerMark(p1Toggle);
            DOMHandler.switchPlayerMark(p2Toggle);
        })
    })()
})()

function GameBoard () {
    const board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

    const getCellState = (row, column) => {
        return board[row][column];
    }
    const getBoardState = () => board;
    const dropMark = function (row, column, playermark) {
        if (!(board[row][column])) {
            board[row][column] = playermark;
            return true;
        }
        else {
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

    return {getBoardState, getCellState, dropMark, clearBoard};
};


function Player (nameone, markone, nametwo, marktwo) {

        const playerOne = {
            name: nameone,
            mark: markone,
            color: "green",
            score: 0
        };

        const playerTwo = {
            name: nametwo,
            mark: marktwo,
            color: "red",
            score: 0
        };


        return {playerOne, playerTwo};
}



function GameController (board, players) {
    const boardState = board.getBoardState();
    const playerOne = players.playerOne;
    const playerTwo = players.playerTwo;
    let gameOver = false;
    let activePlayer;
    let firstPlayer = playerOne;

    const setActivePlayer = function (player) {
        activePlayer = player;
    }

    const getActivePlayer = () => activePlayer;


    const switchFirstPlayer = function () {
        if (firstPlayer === playerOne) {
            firstPlayer = playerTwo;
        }
        else {
            firstPlayer = playerOne;
        }
    }

    const getFirstPlayer = () => firstPlayer;

    const increaseScore = (player) => ++player.score;
    const getPlayerScore = (player) => player.score;



    const playRound = function (row, column) {
        const turnPlay = board.dropMark(row, column, activePlayer.mark);
        const checkWinner = GameOverCondition(boardState);
        if (!checkWinner) {
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
            if(board[0][0] === board[1][0] && board[1][0] === board[2][0] && board[1][0] !== 0 ||
               board[0][1] === board[1][1] && board[1][1] === board[2][1] && board[1][1] !== 0 ||
               board[0][2] === board[1][2] && board[1][2] === board[2][2] && board[1][2] !== 0 ) {
                return true;
            }
        }

        const diagonalWin = function () {
            if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[1][1] !== 0 ||
                board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[1][1] !== 0) {
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
            gameOver = true;
            return true;

        }
        else if (tie()){
            gameOver = "tie";
            return "tie";
        }
        else {
            return false;
        }
    }

    const isGameOver = () => gameOver;
    const gameOverSetter = () => gameOver = false;

 
    setActivePlayer(playerOne);



    return {getActivePlayer, setActivePlayer, getFirstPlayer, switchFirstPlayer, increaseScore, playRound, isGameOver, gameOverSetter, getPlayerScore};
}

function DOMRender (board) {
    const gridContainer = document.querySelector(".grid-container");
    const Name1 = document.querySelector(".P-1 .player-name");
    const Name2 = document.querySelector(".P-2 .player-name");
    const Mark1 = document.querySelector(".P-1 .player-mark");
    const Mark2 = document.querySelector(".P-2 .player-mark");
    const activePlayer = document.querySelector(".player-turn");
    const playerOneCup = document.querySelector(".P-1 img");
    const playerTwoCup = document.querySelector(".P-2 img");
    const playerOneScore = document.querySelector(".P-1 .score");
    const playerTwoScore = document.querySelector(".P-2 .score");
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

    const modal = (function () {
        const dialog = document.querySelector("dialog");
        dialog.showModal();
    })()

    const switchPlayerMark = function (button) {
        if (button.textContent === "X") {
            button.textContent = "O";
        }
        else {
            button.textContent = "X";
        }

    }

    const renderPlayers = function (name1, mark1, name2, mark2) {
        Name1.textContent = name1;
        Mark1.textContent = mark1;
        Name2.textContent = name2;
        Mark2.textContent = mark2;
    }

    const renderActivePlayer = function (player) {
        activePlayer.textContent = player.name + "'s Turn";
        activePlayer.style.color = player.color;
    }

    const renderWinner = function (player) {
        activePlayer.textContent = player.name + " has Won!"
        if (player.color === "green") {
            playerOneCup.style.display = "block";
        }
        else {
            playerTwoCup.style.display = "block";
        }
    }

    const hideCup = function (player) {
        if (player.color === "green") {
            playerOneCup.style.display = "none";
        }
        else {
            playerTwoCup.style.display = "none";
        }
    }

    const renderTie = function () {
        activePlayer.textContent = "It's a Tie!";
        activePlayer.style.color = "blue";
    }

    const renderScore = function(player) {
        if (player.color === "green") {
            playerOneScore.textContent = "Score: " + player.score;
        }
        else {
            playerTwoScore.textContent = "Score: " + player.score;
        }

    }








    renderGrid(boardState);


    return {renderGrid, updateCell, switchPlayerMark, renderPlayers, renderActivePlayer, renderWinner, renderTie, renderScore, hideCup}
}

function boardClicksHandler (board, game, DOMHandler) {
    const restartBtn = document.querySelector(".restart");
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.addEventListener("click", (event) => {
        if (event.target === gridContainer) {
            return;
        }
        if (game.isGameOver()) {
            return;
        }
        else {
            let cellDOM = event.target;
            let cell = event.target.dataset;
            game.playRound(cell.row, cell.column);
            DOMHandler.updateCell(cellDOM, cell.row, cell.column);
            const activePlayer = game.getActivePlayer();
            DOMHandler.renderActivePlayer(activePlayer);
            if (game.isGameOver() === true) {
                DOMHandler.renderWinner(activePlayer);
                game.increaseScore(activePlayer);
                DOMHandler.renderScore(activePlayer);
            }
            else if (game.isGameOver() === "tie") {
                DOMHandler.renderTie();
            }
        }
    });

    restartBtn.addEventListener("click", () => {
        const boardState = board.getBoardState();
        board.clearBoard();
        DOMHandler.renderGrid(boardState);
        DOMHandler.hideCup(game.getActivePlayer());
        game.gameOverSetter();
        game.switchFirstPlayer();
        game.setActivePlayer(game.getFirstPlayer());
        DOMHandler.renderActivePlayer(game.getFirstPlayer());
    })




}

