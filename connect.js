class Connect4 {
	constructor(selector) {
		this.ROWS = 6;
		this.COLS = 7;
		this.selector = selector

		this.createGrid();
	}

	createGrid() {
		const $board = $(this.selector);
		for (let row = 0; row < this.ROWS; row++) {
			const $row = $('<div>')
				.addClass('row');
			// this loop results in 7 div#col being appended to the newly created $row element
			for (let col = 0; col < this.COLS; col++) {
				const $col = $('<div>')
					.addClass('col empty');
					$row.append($col);
			}
			$board.append($row); // this adds 1 $row element which now has 7 $col in it to the board
		}
		console.log($board.html());
	}
}