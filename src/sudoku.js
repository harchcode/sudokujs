/*!
* SudokuJS v1.0
*
* Copyright 2013, Hartono Chandra
* Licensed under the MIT licenses.
*/

/** @namespace */
Sudoku = {};

/**
 * Represents a cell on a Sudoku board.
 * @constructor
 * @param {number} index - Index of the cell in board (0 - 80).
 * @param {number} value - Value of the cell.
 */
Sudoku.Cell = function(index, value){
	if(!index){
		this.index = 0;
	}else{
		this.index = index;
	}
	if(!value){
		this.value = 0;
	}else{
		this.value = value;
	}

	this.row = this.getRowIndex();
	this.column = this.getColumnIndex();
	this.block = this.getBlockIndex();
}

/** 
 * Get cell's row index. 
 * @return {number} The cell's row index (0 - 8).
 */
Sudoku.Cell.prototype.getRowIndex = function(){
	return Math.floor(this.index / 9);
}

/** 
 * Get cell's column index.
 * @return {number} The cell's column index (0 - 8). 
 */
Sudoku.Cell.prototype.getColumnIndex = function(){
	return this.index % 9;
}

/** 
 * Get cell's block index.
 * @return {number} The cell's block index (0 - 8). 
 */
Sudoku.Cell.prototype.getBlockIndex = function(){
	var r = this.getRowIndex();
	var c = this.getColumnIndex();

	if(r >= 0 && r <= 2){
		if(c >= 0 && c <= 2){
			return 0;
		}else if(c >= 3 && c <= 5){
			return 1;
		}else if(c >= 6 && c <= 8){
			return 2;
		}
	}else if(r >= 3 && r <= 5){
		if(c >= 0 && c <= 2){
			return 3;
		}else if(c >= 3 && c <= 5){
			return 4;
		}else if(c >= 6 && c <= 8){
			return 5;
		}
	}else if(r >= 6 && r <= 8){
		if(c >= 0 && c <= 2){
			return 6;
		}else if(c >= 3 && c <= 5){
			return 7;
		}else if(c >= 6 && c <= 8){
			return 8;
		}
	}
}

/**
 * Represents a Sudoku board.
 * @constructor
 * @param {array} givens - cells with predefined value.
 */
Sudoku.Board = function(givens){
	this.cells = [];
	if(givens){
		this.givens = givens;
	}else{
		this.givens = [];
	}

	for(var i = 0; i < 81; i++){
		if(this.givens[i]){
			this.cells[i] = new Sudoku.Cell(i, this.givens[i]);
		}else{
			this.cells[i] = new Sudoku.Cell(i, 0);
		}
	}
}

/**
 * Check if the board is completed and if the answer is correct.
 * @return {boolean} True if the board is completed and correct.
 */
Sudoku.Board.prototype.isCompleted = function(){
	for(var i = 0; i < 81; i++){
		if(!this.cells[i] || this.cells[i].value == 0){
			return false;
		}else{
			var tmp = new Sudoku.Cell(i, this.cells[i].value);
			if(this.isConflict(tmp)){
				return false;
			}
		}
	}

	return true;
}

/**
 * Clear the board.
 * @param {boolean} clearGiven - Wether the givens should be cleared or not.
 */
Sudoku.Board.prototype.clear = function(clearGiven){
	this.cells = [];

	if(clearGiven){
		this.givens = [];
	}
	
	for(var i = 0; i < 81; i++){
		if(!clearGiven && this.givens[i]){
			this.cells[i] = new Sudoku.Cell(i, this.givens[i]);
			continue;
		}

		this.cells[i] = new Sudoku.Cell(i, 0);
	}
}

/**
 * Check if the test cell is conflicting with the rest of board.
 * @param {Sudoku.Cell} test - The cell to be tested.
 * @return {boolean} True if there is a conflict.
 */
Sudoku.Board.prototype.isConflict = function(test){
	for(var i = 0; i < this.cells.length; i++){
		if(i == test.index){
			continue;
		}

		var s = this.cells[i];

		if (s.row == test.row ||
           s.column == test.column ||
           s.block == test.block){
            
	        if (s.value == test.value) {
	            return true;
	        }
   		}
	}
	
	return false;
}

Sudoku.Board.prototype.swapCell = function(index1, index2){
	var tmp = this.cells[index1].value;

	this.cells[index1].value = this.cells[index2].value;
	this.cells[index2].value = tmp;

	if(this.cells[index1].value == 0){
		this.givens[index1] = null;
	}else{
		this.givens[index1] = this.cells[index1].value;
	}

	if(this.cells[index2].value == 0){
		this.givens[index2] = null;
	}else{
		this.givens[index2] = this.cells[index2].value;
	}
}

/**
 * Do an equivalent propagation to the board by swapping 2 columns of blocks.
 * @param {number} index1 - Index of column of blocks to be swapped (0 - 2).
 * @param {number} index1 - Index of column of blocks to be swapped (0 - 2).
 */
Sudoku.Board.prototype.columnBlockPropagation = function(index1, index2){
	var id1 = index1 * 3;
	var id2 = index2 * 3;

	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 3; j++){
			this.swapCell(id1, id2);

			id1++;
			id2++;
		}
		id1 += 6;
		id2 += 6;
	}
}

/**
 * Do an equivalent propagation to the board by swapping 2 rows of blocks.
 * @param {number} index1 - Index of row of blocks to be swapped (0 - 2).
 * @param {number} index1 - Index of row of blocks to be swapped (0 - 2).
 */
Sudoku.Board.prototype.rowBlockPropagation = function(index1, index2){
	var id1 = index1 * 27;
	var id2 = index2 * 27;

	for(var i = 0; i < 27; i++){
		this.swapCell(id1, id2);

		id1++;
		id2++;
	}
}

/**
 * Generate a random integer between 2 numbers.
 * @param {number} min - The lowest possible value.
 * @param {number} max - The highest possible value.
 * @return The generated random number.
 */
Sudoku.rand = function(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generate a terminal pattern.
 * @param {Sudoku.Board} board - The board to be generated.
 */
Sudoku.generateTerminalPattern = function(board){
	board.clear(true);

	var test = [];
	var c = 0;

	for(var i = 0; i < 81; i++){
		test[i] = [];
		for(var j = 1; j <= 9; j++){
			test[i].push(j);
		}
	}

	do{
		if(test[c].length != 0){
			var x = Sudoku.rand(0, test[c].length - 1);
			var y = test[c][x];
			var tmp = new Sudoku.Cell(c, y);

			if(!board.isConflict(tmp)){
				board.cells[c] = tmp;
				test[c].splice(x, 1);
				c += 1;
			}else{
				test[c].splice(x, 1);
			}
		}else{
			for(var i = 1; i <= 9; i++){
				test[c].push(i);
			}

			c -= 1;

			board.cells[c] = new Sudoku.Cell();
		}
	}while(c < 81);
}

/**
 * Solve a Sudoku board. This function will modify the board.
 * @param {Sudoku.Board} board - The board to be solved.
 */
Sudoku.solve = function(board){
	board.clear();

	var test = [];
	var c = 0;

	for(var i = 0; i < 81; i++){
		test[i] = [];
		for(var j = 1; j <= 9; j++){
			test[i].push(j);
		}
	}

	do{
		if(board.givens[c]){
			c += 1;
			continue;
		}

		if(test[c].length != 0){
			var x = Sudoku.rand(0, test[c].length - 1);
			var y = test[c][x];
			var tmp = new Sudoku.Cell(c, y);

			if(!board.isConflict(tmp)){
				board.cells[c] = tmp;
				test[c].splice(x, 1);
				c += 1;
			}else{
				test[c].splice(x, 1);
			}
		}else{
			for(var i = 1; i <= 9; i++){
				test[c].push(i);
			}

			c -= 1;
			while(board.givens[c]){
				c -= 1;
			}
			board.cells[c] = new Sudoku.Cell();
		}

		if(c < 0){
			return false;
		}
	}while(c < 81);	

	return true;
}

/**
 * Same as solve, but this function always return the same solution even if there are more than one solution.
 * @param {Sudoku.Board} board - The board to be solved.
 */
Sudoku.quickSolve = function(board){
	board.clear();

	var test = [];
	var c = 0;

	for(var i = 0; i < 81; i++){
		test[i] = [];
		for(var j = 1; j <= 9; j++){
			test[i].push(j);
		}
	}

	do{
		if(board.givens[c]){
			c += 1;
			continue;
		}

		if(test[c].length != 0){
			var x = test[c].length - 1;
			var y = test[c][x];
			var tmp = new Sudoku.Cell(c, y);

			if(!board.isConflict(tmp)){
				board.cells[c] = tmp;
				test[c].pop();
				c += 1;
			}else{
				test[c].pop();
			}
		}else{
			for(var i = 1; i <= 9; i++){
				test[c].push(i);
			}

			c -= 1;
			while(board.givens[c]){
				c -= 1;
			}
			board.cells[c] = new Sudoku.Cell();
		}

		if(c < 0){
			return false;
		}
	}while(c < 81);	

	return true;
}

/**
 * Generate a Sudoku puzzle. This function will modify the board.
 * @param {Sudoku.Board} board - The board to be generated.
 * @param {string} difficulty - 'easiest', 'easy', 'normal', 'hard', or 'hardest'.
 */
Sudoku.generate = function(board, difficulty){
	Sudoku.generateTerminalPattern(board);

	for(var i = 0; i < 81; i++){
		board.givens[i] = board.cells[i].value;
	}

	var currentGivens = 81;
	var totalGivens;
	var maxEmpty;
	var emptyCellsInRow = [];
	var emptyCellsInColumn = [];
	var emptyCellsInBlock = [];
	var cellToDig = [];

	for(var i = 0; i < 81; i++){
		cellToDig.push(i);
	}

	for(var i = 0; i < 9; i++){
		emptyCellsInRow[i] = 0;
		emptyCellsInColumn[i] = 0;
		emptyCellsInBlock[i] = 0;
	}

	switch(difficulty){
		case 'easiest':
			totalGivens = Sudoku.rand(50, 55);
			maxEmpty = 4;
			break;
		case 'easy':
			totalGivens = Sudoku.rand(36, 49);
			maxEmpty = 5;
			break;
		case 'normal':
			totalGivens = Sudoku.rand(32, 35);
			maxEmpty = 6;
			break;
		case 'hard':
			totalGivens = Sudoku.rand(28, 31);
			maxEmpty = 7;
			break;
		case 'hardest':
			totalGivens = 22;
			maxEmpty = 9;
			break;
	}

	while(cellToDig.length > 0 && currentGivens > totalGivens){
		var k;

		if(difficulty == 'hardest'){
			k = cellToDig.length - 1;
		}else{	
			k = Sudoku.rand(0, cellToDig.length - 1);
		}

		var i = cellToDig[k];
		
		if(difficulty == 'hardest'){
			cellToDig.pop();
		}else{
			cellToDig.splice(k, 1);
		}

		var tmp = board.cells[i];
		var unique = true;

		if(emptyCellsInBlock[tmp.block] >= maxEmpty &&
			emptyCellsInColumn[tmp.column] >= maxEmpty &&
			emptyCellsInRow[tmp.row] >= maxEmpty){
			continue;
		}

		for(var j = 1; j <= 9; j++){
			if(j == tmp.value){
				continue;
			}

			var tmp2 = new Sudoku.Cell(i, j);
			if(board.isConflict(tmp2)){
				continue;
			}

			board.givens[i] = j;
			board.cells[i] = tmp2;

			if(Sudoku.quickSolve(board)){
				unique = false;
				break;
			}
		}

		if(unique){
			board.givens[i] = null;
			board.cells[i] = new Sudoku.Cell();
			emptyCellsInRow[tmp.row] += 1;
			emptyCellsInColumn[tmp.column] += 1;
			emptyCellsInBlock[tmp.block] += 1;
			currentGivens -= 1;
		}else{
			board.givens[i] = tmp.value;
			board.cells[i] = tmp;
		}

		board.clear();
	}

	if(difficulty == 'hardest'){
		var id1 = Sudoku.rand(0, 2);
		var id2 = Sudoku.rand(0, 2);
		if(id1 != id2){
			board.columnBlockPropagation(id1, id2);
		}

		id1 = Sudoku.rand(0, 2);
		id2 = Sudoku.rand(0, 2);
		if(id1 != id2){
			board.rowBlockPropagation(id1, id2);
		}
	}
}