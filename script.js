const puzzle = [
"LEVERAGE0000D00B0",
"I000E0R0Y0PREMIUM",
"Q0NAV0O0I000B00D0",
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

const grid = document.getElementById("grid");
const message = document.getElementById("message");

function buildGrid() {

    grid.innerHTML = "";

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
                const input = document.createElement("input");
                input.className = "cell";
                input.maxLength = 1;
                input.dataset.correct = char;
                wrapper.appendChild(input);
            }

            grid.appendChild(wrapper);
        }
    }

    console.log("Total cells:", grid.children.length);
}


function checkAnswers() {
    const inputs = document.querySelectorAll(".cell");
    let correct = true;

    inputs.forEach(input => {
        if (input.value !== input.dataset.correct) {
            correct = false;
        }
    });

    return correct;
}

document.getElementById("submitBtn").addEventListener("click", function () {
    if (checkAnswers()) {
        message.style.color = "green";
        message.textContent = "Congratulations! Crossword Completed Successfully.";
    } else {
        message.style.color = "red";
        message.textContent = "Some answers are incorrect. Please review.";
    }
});

document.getElementById("clearBtn").addEventListener("click", function () {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.value = "";
    });
    message.textContent = "";
});

buildGrid();
