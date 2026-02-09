import React, { useState } from "react";
import theme from "../ui/theme";
import { ReactComponent as RobberIcon } from "../assets/icons/pawn.svg";

export default function Robber({ x, y, size = 24, color = "#252525", placeRobber = false, onPlaceRobber }) {

  const [hovered, setHovered] = useState(false);

  const resized = size / 2; // match size roughly

  if (placeRobber) {
    // Draw simple placeholder circle
    return (
      <circle
        cx={x}
        cy={y}
        r={hovered ? resized * 1.2 : resized}
        fill={hovered ? theme.colors.greenHover : "#fff"}
        // fill="#fff"
        stroke="#000"
        strokeWidth={2}
        pointerEvents="all"
        // style={{ cursor: "pointer" }}
        onClick={onPlaceRobber}

        style={{
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}

        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    );
  }

  // Draw actual pawn SVG
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`} pointerEvents="none">
      <RobberIcon
        width={size}
        height={size}
        style={{
          filter: "drop-shadow(2px 2px 2px rgba(0,0,0,1))"
        }}
        stroke="black"      // border color
        strokeWidth={1.5}
      />
    </g>
  );
}
