let time_score = 0;
let timer = true;
let scorebox = document.getElementById("timer");
let nameRef = firebase.database().ref('scores');
let num_of_mines = 12;
let unclickedCount = 10 - num_of_mines
let empty_cells = 100 - num_of_mines
let x = 10
let y = 10
let gameState = true;

scorebox.innerHTML = '<p> Time: ' + time_score + '</p>'

function tableUpdate() {
    let scoreData = firebase.database().ref('scores').orderByChild('score').limitToFirst(5);
    scoreData.once('value', function (snapshot) {
        let table = document.getElementById("highscores");
        snapshot.forEach(function (childSnapshot) {
            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let data = childSnapshot.val();
            let name = data.name;
            let score = data.score;
            cell1.id = 'highscores';
            cell2.id = 'highscores';
            cell1.innerHTML = name;
            cell2.innerHTML = score;
        });
    });
}

tableUpdate();

function playExplosion() {
    let sound = document.getElementById('boom');
    sound.play();
}


class dataCell {
    constructor() {
        this.isClicked = false;
        this.hasBomb = false;
        this.neighbourCount = 0;
    }
}



function draw_board() {
    let b = new Array(10);
    for (let i = 0; i < b.length; i++) {
        b[i] = new Array(10);
    }
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            b[i][j] = new dataCell();
        }
    }
    return b;
}

function setBombs(board, bombsRequired) {
    let bombs = 0;
    while (bombs < bombsRequired) {
        let x = Math.floor(Math.random() * board.length);
        let y = Math.floor(Math.random() * board[0].length);
        if (!board[x][y].hasBomb) {
            board[x][y].hasBomb = true;
            bombs += 1;
        };
    }

}
document.getElementById("easy").onclick = function () {
    num_of_mines = 12;
    empty_cells = 100 - num_of_mines;
    document.getElementById("div1").innerHTML = '';
    time_score = 0;
    gameState = true;
    timer = false;
    let board = draw_board();
    setBombs(board, num_of_mines);
    check_beside(board);
    create_table(board);
};

document.getElementById('medium').onclick = function () {
    num_of_mines = 15;
    empty_cells = 100 - num_of_mines;
    document.getElementById("div1").innerHTML = '';
    time_score = 0;
    gameState = true;
    timer = false;
    let board = draw_board();
    setBombs(board, num_of_mines);
    check_beside(board);
    create_table(board);
};

document.getElementById('hard').onclick = function () {
    num_of_mines = 20;
    empty_cells = 100 - num_of_mines;
    document.getElementById("div1").innerHTML = '';
    time_score = 0;
    gameState = true;
    timer = false;
    let board = draw_board();
    setBombs(board, num_of_mines);
    check_beside(board);
    create_table(board);
};

document.getElementById('reset').onclick = function () {
    document.getElementById("div1").innerHTML = '';
    empty_cells = 100 - num_of_mines
    time_score = 0;
    gameState = true;
    timer = false;
    let board = draw_board();
    setBombs(board, num_of_mines);
    check_beside(board);
    create_table(board);
};

let board = draw_board();
setBombs(board, num_of_mines);



function check_beside(board) {
    let count = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (!board[i][j].hasBomb) {

                if (j + 1 < 10) {
                    if (board[i][j + 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (j - 1 >= 0) {
                    if (board[i][j - 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (i + 1 < 10) {
                    if (board[i + 1][j].hasBomb) {
                        board[i][j].neighbourCount = (board[i][j].neighbourCount + 1);
                    }
                }
                if (i - 1 >= 0) {
                    if (board[i - 1][j].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (i - 1 >= 0 && j - 1 >= 0) {
                    if (board[i - 1][j - 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (i + 1 < 10 && j - 1 >= 0) {
                    if (board[i + 1][j - 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (i + 1 < 10 && j + 1 < 10) {
                    if (board[i + 1][j + 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }
                if (i - 1 >= 0 && j + 1 < 10) {
                    if (board[i - 1][j + 1].hasBomb) {
                        board[i][j].neighbourCount = board[i][j].neighbourCount + 1;
                    }
                }

            }
        }
    }

}

function create_table(board) {
    let total_rows = 10;
    let total_cols = 10;
    let div1 = document.getElementById("div1");
    let table1 = document.createElement("table");
    table1.id = "minesweeper";

    for (let r = 0; r < total_rows; r++) {
        var row = document.createElement("tr");
        for (let c = 0; c < total_cols; c++) {

            let cell = document.createElement("td");

            cell.onclick = function () {
                if (!board[r][c].isClicked) {
                    board[r][c].isClicked = true;
                    empty_cells -= 1;
                    timer = true;

                    if (board[r][c].hasBomb) {
                        cell.innerHTML = 'b'
                        gameState = false;
                        timer = false;
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                                if (board[i][j].hasBomb) {
                                    table1.rows[i].cells[j].innerHTML = "<img src='./Images/mine.jpg' alt='b' height='24px' width='24px'>";
                                    table1.rows[i].cells[j].onclick = '';
                                }
                                board[i][j].isClicked = true;
                            }
                        }
                        playExplosion();
                        window.alert('You Lose!');
                    }

                    else if (empty_cells == 0) {
                        cell.innerHTML = board[r][c].neighbourCount;
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                                if (board[i][j].hasBomb) {
                                    table1.rows[i].cells[j].onclick = '';
                                }
                            }
                        }
                        timer = false;
                        window.alert('You Win!');
                    }

                    else if (board[r][c].neighbourCount == 0) {
                        cell.innerHTML = board[r][c].neighbourCount;
                        if (r + 1 < 10) {
                            table1.rows[r + 1].cells[c].click();
                        }
                        if (r + 1 < 10 && c + 1 < 10) {
                            table1.rows[r + 1].cells[c + 1].click();
                        }
                        if (c + 1 < 10) {
                            table1.rows[r].cells[c + 1].click();
                        }
                        if (r - 1 >= 0 && c + 1 < 10) {
                            table1.rows[r - 1].cells[c + 1].click();
                        }
                        if (r - 1 >= 0) {
                            table1.rows[r - 1].cells[c].click();
                        }
                        if (r - 1 >= 0 && c - 1 >= 0) {
                            table1.rows[r - 1].cells[c - 1].click();
                        }
                        if (c - 1 >= 0) {
                            table1.rows[r].cells[c - 1].click();
                        }
                        if (r + 1 < 10 && c - 1 >= 0) {
                            table1.rows[r + 1].cells[c - 1].click();
                        }
                    }


                    else {
                        cell.innerHTML = board[r][c].neighbourCount;
                    }
                }
            }
            row.appendChild(cell);
        }


        table1.appendChild(row);
    }

    div1.appendChild(table1);
}
check_beside(board);
create_table(board);

document.getElementById("div1").addEventListener('click', function () {
    setInterval(function () {
        if (timer == true) {
            time_score += 1;
            scorebox.innerHTML = '<p> Time: ' + time_score + '<p>';
        }
        else {
            scorebox.innerHTML = '<p> Time: ' + time_score + '<p>';
        }
    }, 1000);
}, { once: true });

document.getElementById("userform").addEventListener('submit', function (event) {
    if (gameState == true) {
        event.preventDefault();
        let name = document.getElementById("yourName").value;
        console.log(name);
        let newScore = nameRef.push();
        newScore.set({
            name: name,
            score: time_score,
        });
        document.getElementById("highscores").innerHTML = "<table id='highscores'><th id='highscores>HIGH SCORES</th><tr><td id='highscores'>NAME</td><td id='highscores'>SCORE</td></tr></table>";
        tableUpdate();
    }
    else {
        window.alert("You have to win if you want to get onto the high scores.")
    };
});
