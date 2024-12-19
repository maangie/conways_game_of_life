const CELL_SIZE = 12;
let rows, cols;
let grid = [];
let isRunning = false;
let intervalId = null;

window.onload = initGrid;
window.onresize = initGrid;

/**
 * @description Initializes the grid based on the window size
 */
function initGrid() {
    const container = document.getElementById('grid');
    rows = Math.floor((window.innerHeight - 100) / CELL_SIZE);
    cols = Math.floor(window.innerWidth / CELL_SIZE);

    container.style.gridTemplateColumns = `repeat(${cols}, ${CELL_SIZE}px)`;
    grid = createEmptyGrid(rows, cols);

    container.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = createCell(i, j);
            container.appendChild(cell);
        }
    }
    updateDisplay();
}

/**
 * @description Creates an empty grid
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Array} Empty grid
 */
function createEmptyGrid(rows, cols) {
    return Array(rows).fill().map(() => Array(cols).fill(false));
}

/**
 * @description Creates a cell element
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {HTMLElement} Cell element
 */
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.onclick = () => toggleCell(row, col);
    return cell;
}

/**
 * @description Toggles the state of a cell
 * @param {number} row - Row index
 * @param {number} col - Column index
 */
function toggleCell(row, col) {
    grid[row][col] = !grid[row][col];
    updateDisplay();
}

/**
 * @description Gets the neighbor level based on the number of neighbors
 * @param {number} neighbors - Number of neighbors
 * @returns {string} Neighbor level class
 */
function getNeighborLevel(neighbors) {
    if (neighbors <= 0) return '';
    if (neighbors <= 2) return ' level-1';
    if (neighbors <= 4) return ' level-2';
    if (neighbors <= 6) return ' level-3';
    return ' level-4';
}

/**
 * @description Updates the display of the grid
 */
function updateDisplay() {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);
            cells[i * cols + j].className = 'cell' + (grid[i][j] ? getNeighborLevel(neighbors) : '');
        }
    }
}

/**
 * Counts the number of live neighbors around a given cell in a toroidal grid.
 *
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @returns {number} The number of live neighbors around the cell.
 */
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = (row + i + rows) % rows;
            const newCol = (col + j + cols) % cols;
            if (grid[newRow][newCol]) count++;
        }
    }
    return count;
}

/**
 * @description Advances the grid to the next generation
 */
function nextGeneration() {
    const newGrid = createEmptyGrid(rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = countNeighbors(i, j);
            newGrid[i][j] = grid[i][j] ? (neighbors === 2 || neighbors === 3) : (neighbors === 3);
        }
    }

    grid = newGrid;
    updateDisplay();
}

/**
 * @description Starts or stops the simulation
 */
function startStop() {
    isRunning = !isRunning;
    if (isRunning) {
        intervalId = setInterval(nextGeneration, 500); // 0.5秒間隔に変更
    } else {
        clearInterval(intervalId);
    }
}

/**
 * @description Clears the grid
 */
function clear() {
    grid = createEmptyGrid(rows, cols);
    updateDisplay();
}

/**
 * @description Randomizes the grid
 */
function randomize() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() < 0.3;
        }
    }
    updateDisplay();
}
