// components/Vertex.js
import React from "react";

export default function Vertex({ x, y, size = 10, fillColor = "#fff", clickable = false, onClick }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={size}
      fill={fillColor}          // <-- use fillColor prop
      stroke="#000"
      strokeWidth="1"
      style={{ cursor: clickable ? "pointer" : "default" }}
      onClick={clickable ? onClick : undefined}  // <-- only clickable if allowed
    />
  );
}
