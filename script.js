//your JS code here. If required.
//your JS code here. If required.

// Select and store references to DOM elements
const submitBtn = document.getElementById("submit");
const msgDiv = document.querySelector(".message");
const boardDiv = document.querySelector(".board");

// Store player names (initialized as empty strings)
let players = ["", ""];
// Track whose turn it is (0 for player 1, 1 for player 2)
let current = 0; // 0 => player1 (X), 1 => player2 (O)
// Create an array to track the game board state (9 cells, initially null)
let boardState = Array(9).fill(null); // keep track of X/O or null

// Define all possible winning combinations (rows, columns, diagonals)
// Each array represents the indices of cells that form a winning line
const wins = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal from top-left to bottom-right
  [2, 4, 6], // diagonal from top-right to bottom-left
];

// Add click event listener to the start button
submitBtn.addEventListener("click", startGame);

/**
 * Initiates the game after players enter their names
 * Validates inputs, hides setup screen and renders the game board
 */
function startGame() {
  // Get player names from input fields and remove whitespace
  const p1 = document.getElementById("player-1").value.trim();
  const p2 = document.getElementById("player-2").value.trim();

  // Validate that both names are provided
  if (!p1 || !p2) {
    alert("Please enter both player names!");
    return;
  }

  // Store player names
  players = [p1, p2];
  // Hide the setup screen
  document.querySelector(".setup").style.display = "none";
  // Initialize the game board
  renderBoard();
  // Display whose turn it is
  updateMessage();
}

/**
 * Creates the game board with 9 empty cells
 * Resets the game state to begin a new game
 */
function renderBoard() {
  // Clear any existing board elements
  boardDiv.innerHTML = ""; // clear any previous
  // Reset board state to all null
  boardState.fill(null);
  // Reset to player 1's turn
  current = 0;

  // Create 9 cells for the tic-tac-toe board
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    // Set cell ID (1-9)
    cell.id = (i + 1).toString();
    cell.className = "cell";
    // Add click handler to each cell
    cell.addEventListener("click", handleMove);
    // Add cell to the board
    boardDiv.appendChild(cell);
  }
}

/**
 * Updates the message display to show game status
 * @param {string} text - Optional custom message. If not provided, shows whose turn it is
 */
function updateMessage(text) {
  if (text) {
    // Display custom message (win or draw)
    msgDiv.textContent = text;
  } else {
    // Display whose turn it is
    msgDiv.textContent = `${players[current]}, you're up`;
  }
}

/**
 * Handles player moves when they click on a cell
 * Updates the board, checks for win/draw conditions, and switches turns
 * @param {Event} e - The click event object
 */
function handleMove(e) {
  // Get the cell index (0-8) from the cell ID (1-9)
  const idx = parseInt(e.target.id, 10) - 1;
  // Ignore clicks on already marked cells
  if (boardState[idx]) return; // already played

  // Determine which mark to use based on the current player
  const mark = current === 0 ? "x" : "o";
  // Update the board state with the player's mark
  boardState[idx] = mark;
  // Update the cell's appearance with the player's mark
  e.target.textContent = mark;
  // Disable the cell to prevent further clicks
  e.target.classList.add("disabled");

  // Check if the current move created a winning pattern
  const winningLine = wins.find((line) =>
    line.every((i) => boardState[i] === mark)
  );

  if (winningLine) {
    // Highlight the winning cells
    winningLine.forEach((i) => {
      const cell = document.getElementById((i + 1).toString());
      cell.classList.add("winner");
    });
    // Display win message
    updateMessage(`${players[current]}, congratulations you won!`);
    // Disable all remaining cells to end the game
    document
      .querySelectorAll(".cell")
      .forEach((c) => c.classList.add("disabled"));
    return;
  }

  // Check for a draw (all cells filled with no winner)
  if (boardState.every((v) => v !== null)) {
    updateMessage(`It's a draw!`);
    return;
  }

  // Switch to the other player's turn
  current = 1 - current;
  // Update message to show whose turn it is now
  updateMessage();
}