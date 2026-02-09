// components/Vertex.js
import React, { useState } from "react";
import theme from "../ui/theme";

export default function Vertex({ x, y, size = 10, fillColor = "#fff", clickable = false, onClick }) {

  const [hovered, setHovered] = useState(false);

  return (
    <circle
      cx={x}
      cy={y}
      r={hovered ? size * 1.2 : size}
      fill={hovered ? theme.colors.greenHover : fillColor}         // <-- use fillColor prop
      stroke="#000"
      strokeWidth="2"
      // onClick={clickable ? onClick : undefined}  // <-- only clickable if allowed
      onClick={(e) => {
        if (!clickable) return;
        setHovered(false);   // 👈 reset hover on click
        onClick?.(e);
      }}
      style={{
        cursor: clickable ? "pointer" : "default",
        transition: "all 0.3s ease",
      }}

      onMouseEnter={() => clickable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}
