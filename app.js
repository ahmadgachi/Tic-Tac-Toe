const play = function () {
  const table = document.querySelector(".table");
  const fields = document.querySelectorAll(".table div");
  const player1 = document.querySelector(".player-1");
  const player2 = document.querySelector(".player-2");
  const replayBtn = document.querySelector(".start");
  const winText = document.querySelector(".text");
  let p1score = 0;
  let p2score = 0;

  let currentPlayer = "X";
  player1.classList.add("selected");
  const modeBtn = document.querySelector(".mode button p");
  const diffModes = document.querySelectorAll(".levels li p");

  // create the winning combinations
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Update Scores
  function updateScore() {
    const p1 = document.querySelector(".player-1 p.score");
    const p2 = document.querySelector(".player-2 p.score");

    p1.innerHTML = p1score;
    p2.innerHTML = p2score;
  }

  // Create an empty board
  let origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // Main fuction
  function outCome(e) {
    const fieldArray = Array.from(fields);
    const index = fieldArray.indexOf(e.target);

    const checkWin = () => {
      return winCombinations.some((combination) => {
        return combination.every((index) => {
          return fieldArray[index].classList.contains("x");
        });
      });
    };

    const checkWin2 = () => {
      return winCombinations.some((combination) => {
        return combination.every((index) => {
          return fieldArray[index].classList.contains("o");
        });
      });
    };

    const isDraw = () => {
      return fieldArray.every((field) => {
        return field.classList.contains("x") || field.classList.contains("o");
      });
    };

    // Computer's Move Easy
    function computerMoveEasy() {
      // filter the fieldArray
      function filterFields() {
        return fieldArray.filter((field) => {
          return field.textContent === "";
        });
      }

      const computerChoice = Math.floor(Math.random() * filterFields().length);

      const computerPlay = filterFields()[computerChoice];
      computerPlay.textContent = "O";
      computerPlay.classList.add("o");

      // Check if O wins
      if (checkWin2()) {
        p2score++;
        updateScore();
        setTimeout(function () {
          endGame(false);
        }, 200);
      }
      currentPlayer = "X";
    }

    // Computer's Move Impossible using minimax algorithm
    function computerMoveImpossible() {
      const human = "X";
      const computer = "O";

      let bestSpot = minimax(origBoard, computer);

      fieldArray[bestSpot.index].textContent = "O";
      origBoard.splice(bestSpot.index, 1, "O");
      fieldArray[bestSpot.index].classList.add("o");

      function minimax(newBoard, player) {
        let emptySpots = emptyIndexies(newBoard);

        if (winning(newBoard, human)) {
          return { score: -1 };
        } else if (winning(newBoard, computer)) {
          return { score: 1 };
        } else if (emptySpots.length === 0) {
          return { score: 0 };
        }

        // Collect the scores from each of the empty spots
        let moves = [];

        for (let i = 0; i < emptySpots.length; i++) {
          let move = {};
          move.index = newBoard[emptySpots[i]];

          newBoard[emptySpots[i]] = player;

          if (player == computer) {
            let result = minimax(newBoard, human);
            move.score = result.score;
          } else {
            let result = minimax(newBoard, computer);
            move.score = result.score;
          }

          newBoard[emptySpots[i]] = move.index;

          moves.push(move);
        }

        let bestMove;
        if (player === computer) {
          let bestScore = -10;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        } else {
          let bestScore = 10;
          for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        }

        return moves[bestMove];
      }
      function emptyIndexies(board) {
        return board.filter((b) => b != "O" && b != "X");
      }

      function winning(board, player) {
        if (
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
        ) {
          return true;
        } else {
          return false;
        }
      }

      // Check if O wins
      if (checkWin2()) {
        p2score++;
        updateScore();
        setTimeout(function () {
          endGame(false);
        }, 200);
      }

      currentPlayer = "X";
    }

    // Player's Move
    if (currentPlayer === "X" && fieldArray[index].textContent === "") {
      currentPlayer = "O";
      fieldArray[index].textContent = "X";
      fieldArray[index].classList.add("x");
      origBoard.splice(index, 1, "X");
    }

    // Call computerMove
    if (currentPlayer === "O" && modeBtn.className === "Impossible") {
      setTimeout(function () {
        computerMoveImpossible();
      }, 300);
    } else if (currentPlayer === "O" && modeBtn.className === "Easy") {
      setTimeout(function () {
        computerMoveEasy();
      }, 300);
    }

    // Check if X wins
    if (checkWin()) {
      p1score++;
      updateScore();
      setTimeout(function () {
        endGame(false);
      }, 200);
      // Check for draw
    } else if (isDraw()) {
      setTimeout(function () {
        endGame(true);
      }, 200);
    }

    // End Game
    const endGame = (draw) => {
      if (draw) {
        winText.textContent = "Draw!";
        winText.classList.add("popText");
        table.style.opacity = "0";
        table.style.pointerEvents = "none";
      } else {
        if (checkWin()) {
          winText.textContent = "X Wins!";
          winText.classList.add("popText");
          table.style.opacity = "0";
          table.style.pointerEvents = "none";
        } else if (checkWin2()) {
          winText.textContent = "O Wins!";
          winText.classList.add("popText");
          table.style.opacity = "0";
          table.style.pointerEvents = "none";
        }
      }
    };
  }

  function startGame() {
    // Reset fields
    fields.forEach((field) => {
      field.classList.remove("o");
      field.classList.remove("x");
      field.innerHTML = "";
      field.removeEventListener("click", outCome);
      field.addEventListener("click", outCome, {
        once: true,
      });
    });

    winText.classList.remove("popText");
    table.style.opacity = "1";
    table.style.pointerEvents = "all";

    currentPlayer = "X";
    player2.classList.remove("selected");
    player1.classList.add("selected");

    table.classList.add("replay");

    setTimeout(() => {
      table.classList.remove("replay");
    }, 1000);

    // Reset the origBoard to intial state;
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  // Listen for a click event on replay button
  replayBtn.addEventListener("click", startGame);

  // Change difficulty
  diffModes.forEach((diffMode) => {
    diffMode.addEventListener("click", () => {
      modeBtn.innerHTML = `${diffMode.textContent}`;
      modeBtn.className = `${diffMode.textContent}`;
      startGame();
    });
  });

  // Loop through the fields
  fields.forEach((field) => {
    field.addEventListener("click", outCome, {
      once: true,
    });
  });
};
play();
