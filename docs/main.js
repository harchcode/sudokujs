var sudoku;

$(function(){
	sudoku = new Sudoku.Board();
	Sudoku.generate(sudoku, 'normal');
	render();

	$('#blank').click(newBlank);
	$('#easiest').click(newEasiest);
	$('#easy').click(newEasy);
	$('#normal').click(newNormal);
	$('#hard').click(newHard);
	$('#hardest').click(newHardest);
	$('#clear').click(clear);
	$('#solve').click(solve);
	$('#submit').click(submit);
});

function submit(){
	for(var i = 0; i < 81; i++){
		sudoku.cells[i] = new Sudoku.Cell(i, $('#cell' + i).val());
	}

	var rs = sudoku.isCompleted();
	if(rs){
		alert('Correct!');
	}else{
		alert('The board is incomplete or there is conflict, please try again!');
	}
}

function newBlank(){
	sudoku.clear(true);
	render();
}

function newEasiest(){
	Sudoku.generate(sudoku, 'easiest');
	render();
}

function newEasy(){
	Sudoku.generate(sudoku, 'easy');
	render();
}

function newNormal(){
	Sudoku.generate(sudoku, 'normal');
	render();
}

function newHard(){
	Sudoku.generate(sudoku, 'hard');
	render();
}

function newHardest(){
	Sudoku.generate(sudoku, 'hardest');
	render();
}

function clear(){
	sudoku.clear();
	render();
}

function solve(){
	if(sudoku.givens.length == 0){
		for(var i = 0; i < 81; i++){
			var tmp = $('#cell' + i).val();
			if(tmp && tmp != ''){
				sudoku.givens[i] = tmp;
			}
		}
	}

	Sudoku.solve(sudoku);
	render();
}

function render(){
	var tmp = sudoku.cells;

	for(var i = 0; i < 81; i++){
		$('#cell' + i).removeClass('given');
		$('#cell' + i).attr('readonly', false);
		
		if(sudoku.givens[i]){
			$('#cell' + i).addClass('given');
			$('#cell' + i).attr('readonly', true);
		}

		if(tmp[i].value != 0){
			$('#cell' + i).val(tmp[i].value);
		}else{
			$('#cell' + i).val('');
		}
	}
}