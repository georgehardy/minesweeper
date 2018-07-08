document.addEventListener('DOMContentLoaded', startGame)
//Explosion sound created by Bykgames - https://freesound.org/people/Bykgames/sounds/414346/

var board;
var firstMove;
var seconds;
var size = 6;
var timer;

function startGame () {
  document.getElementsByClassName("board")[0].innerHTML = null;
  board = { cells: [] };
  buildBoard();
  firstMove = true;
  seconds = 1;
  document.getElementById("notes").innerHTML = "Click a cell to start the clock";
  document.addEventListener("click", checkForWin);
  document.addEventListener("contextmenu", checkForWin);
    // Don't remove this function call: it makes the game work!
  lib.initBoard();
}

function buildBoard () {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      board.cells.push({row: i, col: j, isMine: false, hidden: true, surroundingMines:0});
    }
  }
  //Number of mines is random between size and size*1.5
  var mineCount = Math.floor(size + Math.random() * ((size * 1.5) - size + 1));
  //Randomly place mines
  while (mineCount > 0) {
    var randCell = Math.floor(Math.random() * (size*size));
    if (!board.cells[randCell].isMine) {
      board.cells[randCell].isMine = true;
      mineCount--;
    }
  }
  //Calc surrounding mines for each cell
  for (let i = 0; i < board.cells.length; i++) {
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i]);
  }
}

//Start timer after first cell clicked
function startTimer () {
  if (board.cells) {
    document.getElementById("notes").innerHTML = "Time: " + seconds;
    timer = setInterval(function () {
      seconds++;
      document.getElementById("notes").innerHTML = "Time: " + seconds;
     } , 1000);
    firstMove = false;
  }
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin (evt) {
  evt.preventDefault();
  let clicked = board.cells[getCellIndex(getRow(evt.target), getCol(evt.target))];

  if (firstMove) { 
    startTimer(); 
  }

  //Clicked a mine
  if (clicked.isMine && !clicked.hidden) {
    let explode = new Audio('explode.mp3');
    explode.play();
    gameOver('BOOM! You lose.');
    return;
  }
  
  //Check to see if there are any unmarked mines
  for (let i = 0; i < board.cells.length; i++) {
  if (board.cells[i].isMine) {
    if (!board.cells[i].isMarked) {
      console.log("no win - unmarked mine found");
      return;
    }
  }
  //check to see if there are any unhidden cells
  else {
    if (board.cells[i].hidden) {
      console.log("no win - hidden cell found");
      return;
    }
  }
 }
   //If we get this far all mines are marked, and all other cells are visible
   gameOver('NICE! You won.');
}

function gameOver (message) {
  clearInterval(timer);
  lib.displayMessage(message + " " + "<a id='reset' href='#' onclick='startGame();'>Play again?</a>");
}

// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`: 
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through 
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  let surroundingCells = getSurroundingCells(cell.row, cell.col);
  let count = 0;
  for (let i = 0; i < surroundingCells.length; i++) {
    if (surroundingCells[i].isMine === true) {
      count++;
    }
  }
  return count;
}
