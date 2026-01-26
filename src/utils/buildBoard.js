const BOARD_LAYOUT = [3, 4, 5, 4, 3];

function buildBoard(layout) {
  const board = [];

  layout.forEach((hexCount, row) => {
    const rowHexes = [];
    for (let col = 0; col < hexCount; col++) {
      const hex = {
        id: `${row}-${col}`,
        row,
        col,
        neighbors: [], // will fill next
      };
      rowHexes.push(hex);
    }
    board.push(rowHexes);
  });

  // compute neighbors
  board.forEach((rowArr, row) => {
    rowArr.forEach((hex, col) => {
      hex.neighbors = getNeighbors(row, col, layout);
    });
  });

  return board;
}
