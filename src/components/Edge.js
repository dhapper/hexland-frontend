import React from "react";

export default function Edge({ v1, v2, placed, active, playerColor, clickColor, onClick }) {
  if (placed) {
    return (
      <>
        {/* black outline */}
        <line
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke="#000"           // black outline
          strokeWidth="11"         // slightly thicker than main line
          strokeLinecap="round"
        />
        {/* actual road color */}
        <line
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke={playerColor}    // player's color
          strokeWidth="6"         // slightly thinner than outline
          strokeLinecap="round"
        />
      </>
    );
  }

  if (!active) return null; // only show clickable edges

  // clickable placeholder (white dot at midpoint)
  const midX = (v1.x + v2.x) / 2;
  const midY = (v1.y + v2.y) / 2;

  return (
    <circle
      cx={midX}
      cy={midY}
      r={12}
      fill={clickColor}
      stroke="#000"
      strokeWidth={1}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
}
