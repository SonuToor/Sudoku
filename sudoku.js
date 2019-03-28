const board = document.querySelector(".board");
const controlPanel = document.querySelector(".control-panel");
const gamePanel = document.querySelector(".game-panel");
const squareArray = Array.from(document.querySelectorAll(".sudoku-square")); 
let dataStructure= []; 

controlPanel.addEventListener("submit", setPuzzle);
squareArray.forEach(square => square.addEventListener("input", checkNewEntry));
squareArray.forEach(square => square.addEventListener("transitionend", removeClass));


// set up GUI Sudoku Board
window.onload = function() {
    for (let i = 0; i < 9; i++) {

        let boardRow = document.createElement('tr');

        for (let j = 0; j < 9; j++) {

            let boardItem = document.createElement('td');
            boardItem.innerHTML = `<input type="number" min="0" max="9" class="sudoku-square row${i} col${j}">`;

            boardRow.appendChild(boardItem);

            secIDi = Math.floor(i / 3);
            secIDj = Math.floor(j / 3);
            
            if ((secIDi + secIDj) % 2 == 0) {

                boardItem.classList.add("style-grey")
            }
        }

        board.appendChild(boardRow)
    }

    createSudokuDataStructure();
}

// take the empty board and place it into a data structure 
function createSudokuDataStructure() {

    for (let i = 0; i < 9; i++) {
        const currentRow = document.querySelectorAll(`.row${i}`); 
        valuesCurrentRow = Array.from(currentRow).map(square => square.value); 
        dataStructure.push(valuesCurrentRow);
    }
}

// verify if the given number is within the given row
function verifyRow(row, number) {
    
    return dataStructure[row].includes(number);
}

// verify if the given number is within the given column
function verifyColumn(column, number) {
    
    let columnToVerify = Array.from(dataStructure.map(row => row[column]));
    return columnToVerify.includes(number);

}

// verify if the given number is within the given square 
function verifySquare(row, column, number) {

    gridRow = Math.floor(row/3);
    gridColumn = Math.floor(column/3); 

    // there has to be a more algorithmic way of doing this!!!!
    squareGridArray = []

    if (gridRow == 0) {
        if (gridColumn == 0) {
            for (let i = 0; i < 3; i++) {
                squareGridArray.push(dataStructure[i][0], dataStructure[i][1], dataStructure[i][2]);
            }
        }
        if (gridColumn == 1) {
            for (let i = 0; i < 3; i++) {
                squareGridArray.push(dataStructure[i][3], dataStructure[i][4], dataStructure[i][5]);
            }
        }
        else if (gridColumn == 2) {
            for (let i = 0; i < 3; i++) {
                squareGridArray.push(dataStructure[i][6], dataStructure[i][7], dataStructure[i][8]);
            };
        }
    }

    if (gridRow == 1) {
        if (gridColumn == 0){
            for (let i = 3; i < 6; i++) {
                squareGridArray.push(dataStructure[i][0], dataStructure[i][1], dataStructure[i][2]);
            }
        }
        if (gridColumn == 1){
            for (let i = 3; i < 6; i++) {
                squareGridArray.push(dataStructure[i][3], dataStructure[i][4], dataStructure[i][5]);
            }
        }
        else if (gridColumn == 2) {
            for (let i = 3; i < 6; i++) {
                squareGridArray.push(dataStructure[i][6], dataStructure[i][7], dataStructure[i][8]);
            }
        }
    }

    if (gridRow == 2) {
        if (gridColumn == 0){
            for (let i = 6; i < 9; i++) {
                squareGridArray.push(dataStructure[i][0], dataStructure[i][1], dataStructure[i][2]);
            }
        }
        if (gridColumn == 1){
            for (let i = 6; i < 9; i++) {
                squareGridArray.push(dataStructure[i][3], dataStructure[i][4], dataStructure[i][5]);
            }
        }
        else if (gridColumn == 2) {
            for (let i = 6; i < 9; i++) {
                squareGridArray.push(dataStructure[i][6], dataStructure[i][7], dataStructure[i][8]);
            }
        }
    }
    
    return squareGridArray.includes(number);
}

// sets puzzle up based on desired difficulty 
function setPuzzle(e) {
    
    e.preventDefault();

    gamePanel.reset(); 

    let allSquares = Array.from(document.querySelectorAll(".sudoku-square"));

    allSquares.forEach(function(square) { 

        square.removeAttribute("value");
        square.removeAttribute("disabled");
        square.style.background = "white";

    });
    
    dataStructure.length = 0;
    createSudokuDataStructure();

    randomizeTable();

    allSquares.forEach(square => square.addEventListener("input", checkNewEntry));
    allSquares.forEach(square => square.addEventListener("transitionend", removeClass));

}

// fill the empty board with random numbers depending on difficulty 
function randomizeTable() {
    
    let squaresGiven = []; 

    let difficultyNumber = Number(document.getElementById("difficulty").value);

    for (let i = 0; i < difficultyNumber; i++) {

        let newNumero = [];
        newNumero.push(Math.floor(Math.random()*9), Math.floor(Math.random()*9));

        squaresGiven.push(newNumero)
    }

    for (square of squaresGiven) {

        let boardLocation = document.getElementsByClassName(`row${square[0]} col${square[1]}`); 

        let randomGivenValue = (Math.floor(Math.random()*9) + 1);

        // even if the rules aren't broken  by the placement of these numbers, the puzzle can still be unvalid.
            // if the placement of these numbers prevents a square from being filled because of the rules 
            
            // TO DO - solve the above problem <---- SEE BACKTRACKING ALGO -- This random placement won't cut it. 

        // check to see if the placement of the random number breaks any rules 
        if (verifyRow(square[0], randomGivenValue) == false && verifyColumn(square[1], randomGivenValue) == false && verifySquare(square[0], square[1], randomGivenValue) == false) {
            
            dataStructure[square[0]][square[1]] = randomGivenValue; 

            boardLocation[0].setAttribute("value", randomGivenValue);

            boardLocation[0].setAttribute("disabled", true);

            boardLocation[0].style.background = "rgb(212, 208, 208)";
        }
    }
}

function checkNewEntry(e) {

    let square = e.target;
    let entry = Number(e.target.value);

    let entryRow = Number(e.target.classList[1].substr(-1));
    let entryCol = Number(e.target.classList[2].substr(-1));


    if (entry < 0 || entry > 9) {
        return
    }
    if (entry == "") {
        return
    }
    
    if (verifyRow(entryRow, entry) == true || verifyColumn(entryCol, entry) == true || verifySquare(entryRow, entryCol, entry) == true) {
        square.classList.add("wrong-entry");
        return
    }

    if (verifyRow(entryRow, entry) == false && verifyColumn(entryCol, entry) == false && verifySquare(entryRow, entryCol, entry) == false) {
        square.classList.add("correct-entry");
        dataStructure[entryRow][entryCol] = entry; 
        return
    }

}

function removeClass(e) {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove("wrong-entry");
    e.target.classList.remove("correct-entry");
}