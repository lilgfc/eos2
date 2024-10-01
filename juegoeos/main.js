let matrix = shuffleMatrix();
let background = document.querySelector('.background');
let timerElement = document.getElementById('time');
let winMessage = document.querySelector('.win-message');
let finalTimeElement = document.getElementById('final-time');
let clicksCountElement = document.getElementById('clicks-count');
let statsElement = document.querySelector('.stats');

let totalTime = 60;  // Tiempo en segundos
let timer;  // Referencia del temporizador
let clicks = 0;  // Contador de clicks
let gameFinished = false;

drawTokens();
addEventListeners();
startTimer();

function drawTokens(){
    background.innerHTML = '';
    matrix.forEach(row => row.forEach(element => {
        if (element === '') {
            background.innerHTML += `<div class="empty">${element}</div>`;
        } else {
            background.innerHTML += `<div class="token">${element}</div>`;
        }
    }));
}

function addEventListeners(){
    let tokens = document.querySelectorAll('.token');
    tokens.forEach(token => 
        token.addEventListener('click', () => {
            if (!gameFinished) {
                clicks++;
                let actualPosition = searchPosition(token.innerText);
                let emptyPosition = searchPosition('');
                let movement = canMove(actualPosition, emptyPosition);

                if (movement !== false) {
                    updateMatrix(token.innerText, actualPosition, emptyPosition);
                    drawTokens();
                    addEventListeners();
                    checkWin();
                }
            }
        })
    );
}

function searchPosition(element){
    let rowIndex = 0;
    let columnIndex = 0;
    matrix.forEach((row, index) => {
        let rowElement = row.findIndex(item => item == element);
        if (rowElement !== -1) {
            rowIndex = index;
            columnIndex = rowElement;
        }
    });
    return [rowIndex, columnIndex];
}

function canMove(actualPosition, emptyPosition) {
    if (actualPosition[1] === emptyPosition[1]) {
        if (Math.abs(actualPosition[0] - emptyPosition[0]) > 1) {
            return false;
        }
    } else if (actualPosition[0] === emptyPosition[0]) {
        if (Math.abs(actualPosition[1] - emptyPosition[1]) > 1) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

function updateMatrix(element, actualPosition, emptyPosition){
    matrix[actualPosition[0]][actualPosition[1]] = '';
    matrix[emptyPosition[0]][emptyPosition[1]] = element;
}

function shuffleMatrix() {
    let shuffleMatrix = [
        [],[],[]
    ];
    let array = ['1', '2', '3', '4', '5', '6', '7', '8', ''];
    let shufleArray = array.sort(() => Math.random() - 0.5);
    let column = 0;
    let row = 0;
    shufleArray.forEach(element => {
        shuffleMatrix[row].push(element);
        if (column < 2) {
            column++;
        } else {
            column = 0;
            row++;
        }
    });
    console.log(shuffleMatrix);
    return shuffleMatrix;
}

function startTimer() {
    timer = setInterval(() => {
        if (totalTime > 0) {
            totalTime--;
            timerElement.textContent = totalTime;
        } else {
            clearInterval(timer);
            endGame(false);
        }
    }, 1000);
}

function checkWin() {
    let winningMatrix = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '']
    ];

    // Comprobar si la matriz actual coincide con la matriz ganadora
    if (JSON.stringify(matrix) === JSON.stringify(winningMatrix)) {
        clearInterval(timer);
        endGame(true);
    }
}

function endGame(win) {
    gameFinished = true;
    background.innerHTML = '';  // Limpia la pantalla de juego

    if (win) {
        winMessage.style.display = 'block';
    }

    statsElement.style.display = 'block';
    finalTimeElement.textContent = 60 - totalTime;
    clicksCountElement.textContent = clicks;
}
