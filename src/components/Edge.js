// components/Edge.js
import React from "react";

export default function Edge({ v1, v2, placed, active, onClick }) {
  if (placed) {
    return (
      <line
        x1={v1.x}
        y1={v1.y}
        x2={v2.x}
        y2={v2.y}
        stroke="#8B4513"
        strokeWidth="6"
        strokeLinecap="round"
      />
    );
  }

  if (!active) return null; // only show eligible edges

  // clickable placeholder (white dot at midpoint)
  const midX = (v1.x + v2.x) / 2;
  const midY = (v1.y + v2.y) / 2;

  return (
    <circle
      cx={midX}
      cy={midY}
      r={8}
      fill="#fff"
      stroke="#000"
      strokeWidth={1}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
}
