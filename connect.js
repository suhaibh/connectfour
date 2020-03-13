class Connect4 {
	constructor(selector) {
		this.ROWS = 6;
		this.COLS = 7;
		this.player = 'red';
		this.isGameOver = false;
		this.selector = selector
		this.createGrid();
		this.setupEventListners();
	}

	createGrid() {
		const $board = $(this.selector);
		const $restartButton = $('#restart');
		
		this.isGameOver = false;
		this.player = 'red';
		for (let row = 0; row < this.ROWS; row++) {
			const $row = $('<div>')
				.addClass('row')
				.addClass(`row-${row}`);
			// this loop results in 7 div#col being appended to the newly created $row element
			for (let col = 0; col < this.COLS; col++) {
				const $token = $('<div>').addClass('token');
				const $col = $('<div>')
					.addClass('col empty')
					.addClass(`col-${col}`)
					.attr('data-col', col)
					.attr('data-row', row)
					.append($token);
					$row.append($col);
			}
			$board.append($row); // this adds 1 $row element which now has 7 $col in it to the board
		}
		$restartButton.css("visibility", "visible");
	}

	setupEventListners() {
		const $board = $(this.selector);
		const $resetButton = $('#restart');
		const that = this;
		var animationComplete = true;

		function findLastEmptyCell(col) {
			const cells = $(`.col[data-col='${col}']`);
			for (let i = cells.length - 1; i >= 0; i-- ) {
				const $cell = $(cells[i]);
				if ($cell.hasClass('empty')) {
					return $cell;
				}
			}
			return null;
		}

		$board.on('mouseenter', '.col.empty', function() {
			if (that.isGameOver) return;
			const col = $(this).data('col');
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.addClass(`next-${that.player}`);
		})

		$board.on('mouseleave', '.col', function () {
			if (that.isGameOver) return;
			$('.col').removeClass(`next-${that.player}`);
		})

		$board.on('click', '.col.empty', function() {
			//console.log(this);
			if (that.isGameOver) return;
			if (animationComplete) {
				animationComplete = false;
				const col = $(this).data('col');
				// const row = $(this).data('row'); when this was set the click would make the cirlce 
				// 									we were clicking the target instead of the last empty cell
				//									Resulted in the while loop in checkDirection not being executed because $next.data('player') would come up as undefined
				//									The loop would only run at the second to last because when it did the -1 direction to look at the row below it, 
				//									it would finally trigger as having $next.data('player') equal something
				//const row = $(this).data('row'); // TEST - REMOVE THIS
				const $lastEmptyCell = findLastEmptyCell(col);
				const $child = $lastEmptyCell.children();
				$lastEmptyCell.removeClass(`empty next-${that.player}`);
				$child.addClass('drop-red');
				$lastEmptyCell.data('player', that.player);

				const winner = that.checkForWinner(
					$lastEmptyCell.data('row'), 
					$lastEmptyCell.data('col')) // explicitly setting this instead of using col and row makes it so we're targeting the last empty cell's data attrs not the one we're clicking
				if (winner) {
					that.isGameOver = true;
					animationComplete = true;
					alert(`Game Over! ${that.player} has won!`);
					$('.col.empty').removeClass('empty');
					return;
				}

				// <------ TO DO ---------->
				//add a check for $('.col.empty').length == 0 for a popup to say draw

				that.player = (that.player =='red') ? 'black' : 'red';
				
				
				// COMPUTER TURN

				function getRandomNum(max) {
					return Math.floor(Math.random() * Math.floor(max));
				}

				const allEmptyCells = $('.col.empty');
				const randEmptyCellIndex = getRandomNum(allEmptyCells.length);
				const randCell = allEmptyCells[randEmptyCellIndex];

				const compCol = $(randCell).data('col');
				const $compEmptyCell = findLastEmptyCell(compCol);
				const $compChild = $compEmptyCell.children();
				
				setTimeout(function(){
					$compChild.addClass('drop-black');
					$compEmptyCell.data('player', that.player);
					$compEmptyCell.removeClass('empty');

					const compWinner = that.checkForWinner(
						$compEmptyCell.data('row'),
						$compEmptyCell.data('col'))
					if (compWinner) {
						alert(`Game Over! ${that.player} has won!`);
					}
					that.player = (that.player =='black') ? 'red' : 'black';
					animationComplete = true;
				}, 500)
			}
		
		})

		$resetButton.on('click', function(){
			that.restart();
		})

	}

	checkForWinner(row, col) {
		const that = this;

		function $getCell(i, j) {
			return $(`.col[data-row='${i}'][data-col='${j}']`);
		}

		function checkDirection(direction) {
			let total = 0;
			//console.log("the i value we're adding: " + direction.i);
			//console.log("the j value we're adding: " + direction.j);
			//console.log("new direction");
			let i = row + direction.i;
			// IMPORTANT console.log("i/row: " + i);
			let j = col + direction.j;
			// IMPORTANT console.log("j/col: " + j)
			let $next = $getCell(i, j);
			//console.log("next i/row: " + $next.data('row'));
			//console.log("next j/col: " + $next.data('col'));
			// IMPORTANT console.log($next.data('player'));
			//console.log("end one direction");
			while (i >= 0 &&
				i < that.ROWS &&
				j >= 0 &&
				j < that.COLS &&
				$next.data('player') === that.player) {
				total++;
				// IMPORTANT console.log("total: " + total);
				// IMPORTANT console.log("in the loop direction.i " + direction.i);
				// IMPORTANT console.log("in the loop direction.j " + direction.j);
				i += direction.i;
				j += direction.j;
				$next = $getCell(i, j);
				// IMPORTANT console.log("in the loop after addition i/row " + i);
				// IMPORTANT console.log("in the loop after addition j/col " + j);
			}
			return total;
		}

		function checkWin(directionA, directionB) {
			const total = 1 +
				checkDirection(directionA) +
				checkDirection(directionB);
			//console.log("total: " + total);
			if (total >= 4) {
				return that.player;
			} else {
				return null;
			}
		}

		function checkVerticals(){
			return checkWin({i: -1, j: 0}, {i: 1, j: 0});
		}

		function checkHorizontals() {
			return checkWin({i: 0, j: -1}, {i: 0, j: 1})
		}

		function checkDiagonalBltoTr() {
			return checkWin({i: 1, j: -1}, {i: -1, j: 1})
		}

		function checkDiagonalBrtoTl(){
			return checkWin({i: 1, j: 1}, {i: -1, j: -1})
		}	
		
		return checkVerticals() || checkHorizontals() || checkDiagonalBltoTr() || checkDiagonalBrtoTl();
	}

	restart () {
		$(this.selector).empty();
		this.createGrid();
	}
}