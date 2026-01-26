function getNeighbors(row, col, layout) {
  const neighbors = [];
  const isOdd = row % 2 === 1;

  // Directions relative to (row, col)
  const deltas = isOdd
    ? [
        [-1, 0], [-1, 1], // upper neighbors
        [0, -1], [0, 1],  // same row
        [1, 0], [1, 1],   // lower neighbors
      ]
    : [
        [-1, -1], [-1, 0], 
        [0, -1], [0, 1], 
        [1, -1], [1, 0],
      ];

  deltas.forEach(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;

    if (nr >= 0 && nr < layout.length && nc >= 0 && nc < layout[nr]) {
      neighbors.push({ row: nr, col: nc });
    }
  });

  return neighbors;
}
