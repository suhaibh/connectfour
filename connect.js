class Connect4 {
	constructor(selector) {
		this.ROWS = 6;
		this.COLS = 7;
		this.selector = selector
		this.createGrid();
		this.setupEventListners();
	}

	createGrid() {
		const $board = $(this.selector);
		for (let row = 0; row < this.ROWS; row++) {
			const $row = $('<div>')
				.addClass('row');
			// this loop results in 7 div#col being appended to the newly created $row element
			for (let col = 0; col < this.COLS; col++) {
				const $col = $('<div>')
					.addClass('col empty')
					.attr('data-col', col)
					.attr('data-row', row);
					$row.append($col);
			}
			$board.append($row); // this adds 1 $row element which now has 7 $col in it to the board
		}
		console.log($board.html());
	}

	setupEventListners() {
		const $board = $(this.selector);

		function findLastEmptyCell(col) {
			const cells = $(`.col[data-col='${col}']`);
			for (let i = cells.length - 1; i>= 0; i-- ) {
				const $cell = $(cells[i]);
				if ($cell.hasClass('empty')) {
					return $cell;
				}
			}
			return null;
		}

		$board.on('mouseenter', '.col.empty', function(){
			const col = $(this).data('col');
			const $lastEmptyCell = findLastEmptyCell(col);
			$lastEmptyCell.addClass(`next-red`);
		})

		$board.on('mouseleave', '.col', function (){
			$('.col').removeClass(`next-red`);
		})
	}
}