# :warning: This project is deprecated in favor of https://github.com/harchcode/simple-sudoku-ts

##### THIS PROJECT IS OUTDATED. I can update the library to today’s standard (using NPM, make it a CommonJS module, Typescript type definition, etc) if someone requests me to. Thank you.

SudokuJS
========

A sudoku solver and generation library for javascript.

Installation
============
<ul>
<li>Download the sudoku.js or sudoku.min.js file from the src folder.</li>
<li>Copy the file into your web directory.</li>
<li>Include it in your HTML file with <code>&lt;script src="path/to/sudoku.min.js"&gt;&lt;/script&gt;</code></li>
<li>Now you are ready to use the library.</li>
</ul>

How to Use
==========
<ul>
<li>Create a Sudoku board with <code>var board = new Sudoku.Board()</code>.</li>
<li>Then you can generate a new puzzle with <code>Sudoku.generate(board, 'normal')</code>.
Note that 'normal' is the difficulty of generated puzzle. There are 5 difficulties at the moment, they are 'easiest', 'easy', 'normal', 'hard', and 'hardest'.</li>
<li>You can solve the board with <code>Sudoku.solve(board)</code>.</li>
<li>You can clear the board with <code>board.clear()</code>. If you want to clear the givens, you can call <code>board.clear(true)</code>.</li>
<li>If you want to check wether the board is completed and correct, you can do it with 
<pre>
if(board.isCompleted){
  //correct 
}else{ 
  //incorrect or incomplete
}
</pre></li>
<li>If you want to make a puzzle with givens that you defined (not random), you need to declare the givens first with
<pre>var givens = {
  '2' : '9',
  '8' : '3',
  '80' : '5'
}</pre>
and then make a Sudoku board with <code>var board = new Sudoku.Board(givens)</code>.
Note that '2', '8', and '80' in the example are the indexes of the givens, and '9', '3', '5' are the values.
In this library, the cells are numbered from 0 to 80, from left to right, top to bottom. So the top left cell has index 0, the cell right of it has index 1, and so on.</li>
<li>Now that's left to do is to render the Sudoku board. There is no render function in this library because there are too many ways to render it, so you have to do the rendering yourself.
To get all the cells' and givens' data from the board, you can do:
<pre>
  for(var i = 0; i &lt; board.cells.length){
    var index = board.cells[i].index; // same as i
    var value = board.cells[i].value;
    
    if(board.givens[i]){
      // A given exist in index of i, do something.
    }
  }
</pre>
</li>
</ul>

Demo
====
To run the demo, you will need a web server (like Apache in XAMPP or WAMP).
If you just want to see the code in action, just visit https://harchcode.github.io/sudokujs/ :)
