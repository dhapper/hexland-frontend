function Hex({ x, y, size = 60, fill = "#c2a14d", row, col, onClick }) {
  const h = size;
  const w = size * 0.87;

  const points = `
    ${x},${y - h}
    ${x + w},${y - h / 2}
    ${x + w},${y + h / 2}
    ${x},${y + h}
    ${x - w},${y + h / 2}
    ${x - w},${y - h / 2}
  `;

  return (
    <polygon
      points={points}
      fill={fill}
      stroke="#333"
      strokeWidth="3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
}

export default Hex;
