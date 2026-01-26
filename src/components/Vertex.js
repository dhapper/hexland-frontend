// components/Vertex.js
import React from "react";

export default function Vertex({ x, y, size = 10, onClick }) {
  const [color, setColor] = React.useState("#fff"); // default white

  const handleClick = () => {
    setColor("#4a90e2"); // place house (blue)
    if (onClick) onClick();
  };

  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill={color}
      stroke="#000"
      strokeWidth="1"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    />
  );
}
