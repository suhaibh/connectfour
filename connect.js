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
			if (that.isGameOver) return;
			if (animationComplete) {
				animationComplete = false;
				const col = $(this).data('col');
				const $lastEmptyCell = findLastEmptyCell(col);
				const $child = $lastEmptyCell.children();
				$lastEmptyCell.removeClass(`empty next-${that.player}`);
				$child.addClass('drop-red');
				$lastEmptyCell.data('player', that.player);
				$lastEmptyCell.attr('player', that.player);

				const winner = that.checkForWinner(
					$lastEmptyCell.data('row'), 
					$lastEmptyCell.data('col'))
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
				
				// <------- COMPUTER TURN ------->

				let options = [];
				options[0] = [];
				options[1] = [];
				options[2] = [];
				options[3] = [];

				//console.log("xxxxxxXXXXX COMPUTER SIM START XXXXXxxxxxx");
				for (let i = 0; i < that.COLS; i++) {
					let compCell = findLastEmptyCell(i);
					if (compCell == null) {
						continue;
					}
					//console.log("current column loop: " + i);
					//console.log(`<--------------- simulate black's turn - ${i} ------------>`);
					//console.log("in the for loop current player: " + that.player);
					compCell.data('player', that.player);
					compCell.attr('player', that.player);
					// console.log(compCell.data('player'));
					if (that.checkForWinner(compCell.data('row'), compCell.data('col')) === 'black') {
						options[0].push(compCell.data('col'));
						//console.log(options);
					} else {
						//console.log(`<--------------- simulate red's turn - ${i} ------------>`);
						that.player = (that.player =='black') ? 'red' : 'black';
						//debugger;
						//console.log("in the for loop current row " + compCell.data('row'));
						//console.log("in the for loop current col " + compCell.data('col'));
						compCell.removeData('player');
						compCell.data('player', that.player);
						compCell.attr('player', that.player);
						compCell.removeClass('empty');
						//console.log('current player: ' + that.player);
						//console.log("compCell.data('player'): " + compCell.data('player'));
						if (that.checkForWinner(compCell.data('row'), compCell.data('col')) === 'red') {
							options[1].push(compCell.data('col'));
							//console.log(options);
						} else {
							options[2].push(compCell.data('col'));
						}
					}
					compCell.removeData('player');
					compCell.removeAttr('player');
					that.player = "black";
					//console.log("end of for current player: " + that.player);
					compCell.addClass('empty');
					console.log(options);
				}

				function getRandomNum(max) {
					return Math.floor(Math.random() * Math.floor(max));
				}

				let $compEmptyCell;
				if (options[0].length > 0) {
					$compEmptyCell = findLastEmptyCell(options[0][getRandomNum(options[0].length)]);
				} else if (options[1].length > 0) {
					$compEmptyCell = findLastEmptyCell(options[1][getRandomNum(options[1].length)]);
				} else if (options[2].length > 0) {
					$compEmptyCell = findLastEmptyCell(options[2][getRandomNum(options[2].length)]);
				}

				const $compChild = $compEmptyCell.children();
				
				setTimeout(function(){
					//console.log("<-------- start of computer/black turn ------->");
					//console.log("should be black's turn, actual turn is: " + that.player);
					$compChild.addClass('drop-black');
					$compEmptyCell.data('player', that.player);
					$compEmptyCell.attr('player', that.player);
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
			let i = row + direction.i;
			let j = col + direction.j;
			let $next = $getCell(i, j);
			//console.log($next);
			//console.log("next cell player: " + $next.data('player'));
			//console.log("current player evaulation: " + that.player);
			while (i >= 0 &&
				i < that.ROWS &&
				j >= 0 &&
				j < that.COLS &&
				$next.data('player') === that.player) {
				total++;
				i += direction.i;
				j += direction.j;
				$next = $getCell(i, j);
			}
			return total;
		}

		function checkWin(directionA, directionB) {
			const total = 1 +
				checkDirection(directionA) +
				checkDirection(directionB);
			if (total >= 4) {
				return that.player;
			} else {
				return null;
			}
		}

		function checkVerticals(){
			//console.log("<-------- checking verticals ------>")
			return checkWin({i: -1, j: 0}, {i: 1, j: 0});
		}

		function checkHorizontals() {
			//console.log("<-------- checking horizontals --------->")
			return checkWin({i: 0, j: -1}, {i: 0, j: 1})
		}

		function checkDiagonalBltoTr() {
			//console.log("<-------- checking checkDiagonal bot left to Top right --------->")
			return checkWin({i: 1, j: -1}, {i: -1, j: 1})
		}

		function checkDiagonalBrtoTl(){
			//console.log("<-------- checking checkDiagonal bot right to Top left --------->")
			return checkWin({i: 1, j: 1}, {i: -1, j: -1})
		}	
		
		return checkVerticals() || checkHorizontals() || checkDiagonalBltoTr() || checkDiagonalBrtoTl();
	}

	restart () {
		$(this.selector).empty();
		this.createGrid();
	}
}