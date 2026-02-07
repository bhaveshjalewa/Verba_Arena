/*************************
 START + TIMER
*************************/

let timerInterval;
let startTime;

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const gameContainer = document.getElementById("gameContainer");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

startBtn.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    buildGrid();
});

function updateTimer() {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    timerDisplay.textContent =
        (m < 10 ? "0" + m : m) + ":" +
        (s < 10 ? "0" + s : s);
}


/*************************
 PUZZLE DATA
*************************/

const puzzle = [
"LEVERAGE0000D00B00",
"I000E0R0Y0PREMIUM0",
"Q0NAV0O0I000B00D00",
"U000E0W0EQUITY0G0",
"I000N0T0L00000BETA",
"D000U0HEDGING00T0P",
"0W00E00000N000000I",
"0E00000000F0PROFIT",
"MARGIN0C00L000000A",
"0L00000R0SAVINGS0L",
"0TAXABLE00T0000000",
"0H00000D0TENURE000",
"0000000I00000E0000",
"0DEFAULT0DURATION0",
"0000L0000E0I#U0000",
"0COUPON00B0SPREAD0",
"0000H0000T0K0N0000",
"0000ASSETS00000000"
];

const acrossCluesText = [
"Strategic use of borrowed capital to amplify returns.",
"Additional return demanded for bearing uncertainty.",
"Per-unit valuation metric of an investment fund.",
"Residual ownership interest after liabilities.",
"Sensitivity measure of security to market movement.",
"Offsetting position taken to reduce risk.",
"Surplus after deducting expenses from revenue.",
"Broker-provided borrowing to increase exposure.",
"Income deliberately set aside.",
"Income subject to government levy.",
"Agreed duration of financial contract.",
"Failure to meet debt obligation.",
"Bond price sensitivity measure.",
"Periodic bond interest payment.",
"Yield difference reflecting risk.",
"Resources expected to generate value."
];

const downCluesText = [
"Easily convertible into cash.",
"Total income before expenses.",
"Increase beyond inflation.",
"Borrowed funds requiring repayment.",
"Structured financial plan.",
"Income percentage return.",
"Financial resources for growth.",
"Rise in general price level.",
"Accumulated financial value.",
"Ability to repay borrowed money.",
"Total gain or loss on investment.",
"Excess return beyond benchmark.",
"Outstanding financial obligations.",
"Uncertainty in financial outcomes."
];

const COMPLETION_CODE =
"X9F7LQ2ZP8M4R1T6V3W0K5Y8C2D7N4B1S6H9E0J3G2U5A";


/*************************
 GRID + WORD ENGINE
*************************/

const grid = document.getElementById("grid");
const acrossDiv = document.getElementById("acrossClues");
const downDiv = document.getElementById("downClues");

let words = [];
let activeWord = null;
let currentDirection = "across";
let historyStack = [];

function buildGrid() {

    grid.innerHTML = "";
    words = [];
    acrossDiv.innerHTML = "";
    downDiv.innerHTML = "";

    let number = 1;
    let acrossIndex = 0;
    let downIndex = 0;

    for (let r = 0; r < 18; r++) {
        for (let c = 0; c < 18; c++) {

            const char = puzzle[r][c];
            const wrapper = document.createElement("div");
            wrapper.className = "grid-cell";

            if (char === "0") {
                wrapper.classList.add("zero-cell");
            }

            else if (char === "#") {
                wrapper.classList.add("black-cell");
            }

            else {

                const startAcross =
                    (c === 0 || puzzle[r][c - 1] === "0" || puzzle[r][c - 1] === "#") &&
                    (c < 17 && puzzle[r][c + 1] !== "0" && puzzle[r][c + 1] !== "#");

                const startDown =
                    (r === 0 || puzzle[r - 1][c] === "0" || puzzle[r - 1][c] === "#") &&
                    (r < 17 && puzzle[r + 1][c] !== "0" && puzzle[r + 1][c] !== "#");

                if (startAcross || startDown) {

                    const num = document.createElement("div");
                    num.className = "cell-number";
                    num.textContent = number;
                    wrapper.appendChild(num);

                    if (startAcross) {
                        const word = {
                            number,
                            direction: "across",
                            cells: collectWord(r, c, "across"),
                            clue: acrossCluesText[acrossIndex++]
                        };
                        words.push(word);
                        renderClue(word, acrossDiv);
                    }

                    if (startDown) {
                        const word = {
                            number,
                            direction: "down",
                            cells: collectWord(r, c, "down"),
                            clue: downCluesText[downIndex++]
                        };
                        words.push(word);
                        renderClue(word, downDiv);
                    }

                    number++;
                }

                const input = document.createElement("input");
                input.className = "cell";
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;
                input.dataset.correct = char;

                input.addEventListener("focus", () => activateCell(r, c));
                input.addEventListener("input", autoMove);

                wrapper.appendChild(input);
            }

            grid.appendChild(wrapper);
        }
    }
}

function collectWord(r, c, dir) {
    const cells = [];
    while (r < 18 && c < 18 &&
        puzzle[r][c] !== "0" &&
        puzzle[r][c] !== "#") {
        cells.push({ r, c });
        if (dir === "across") c++;
        else r++;
    }
    return cells;
}

function renderClue(word, container) {
    const div = document.createElement("div");
    div.className = "clue-item";
    div.textContent = word.number + ". " + word.clue;
    div.onclick = () => highlightWord(word);
    word.clueElement = div;
    container.appendChild(div);
}


/*************************
 HIGHLIGHT
*************************/

function activateCell(r, c) {
    const matchingWords = words.filter(w =>
        w.cells.some(cell => cell.r === r && cell.c === c)
    );

    if (activeWord && matchingWords.length === 2) {
        currentDirection =
            currentDirection === "across" ? "down" : "across";
    }

    activeWord =
        matchingWords.find(w => w.direction === currentDirection)
        || matchingWords[0];

    highlightWord(activeWord);
}

function highlightWord(word) {
    document.querySelectorAll(".cell")
        .forEach(c => c.style.background = "white");
    document.querySelectorAll(".clue-item")
        .forEach(c => c.style.background = "transparent");

    if (!word) return;

    word.cells.forEach(cell => {
        const el = getCell(cell.r, cell.c);
        if (el) el.style.background = "#d0e8ff";
    });

    if (word.clueElement)
        word.clueElement.style.background = "#d0e8ff";

    activeWord = word;
}

function getCell(r, c) {
    return document.querySelector(
        `.cell[data-row='${r}'][data-col='${c}']`
    );
}


/*************************
 AUTO MOVE
*************************/

function autoMove(e) {
    e.target.value = e.target.value.toUpperCase();
    if (!activeWord) return;

    const index = activeWord.cells.findIndex(cell =>
        cell.r == e.target.dataset.row &&
        cell.c == e.target.dataset.col
    );

    if (index < activeWord.cells.length - 1) {
        const next = activeWord.cells[index + 1];
        getCell(next.r, next.c).focus();
    }
}


/*************************
 UNDO
*************************/

document.getElementById("undoBtn")
    .addEventListener("click", function () {

        const last = historyStack.pop();
        if (!last) return;

        const cell = getCell(last.row, last.col);
        if (cell) {
            cell.value = last.prev;
            cell.focus();
        }
    });


/*************************
 CLEAR
*************************/

document.getElementById("clearBtn")
    .addEventListener("click", function () {

        document.querySelectorAll(".cell")
            .forEach(cell => cell.value = "");

        message.textContent = "";
    });


/*************************
 SUBMIT
*************************/

document.getElementById("submitBtn")
    .addEventListener("click", function () {

        let correct = true;

        document.querySelectorAll(".cell")
            .forEach(input => {
                if (input.value !== input.dataset.correct) {
                    correct = false;
                }
            });

        if (correct) {
            clearInterval(timerInterval);
            message.style.color = "green";
            message.innerHTML =
                "<b>Completed Successfully!</b><br><br>" +
                "Completion Code:<br><br>" +
                "<div style='word-break:break-all'>" +
                COMPLETION_CODE +
                "</div>";
        }
        else {
            message.style.color = "red";
            message.textContent =
                "Some answers are incorrect.";
        }
    });
