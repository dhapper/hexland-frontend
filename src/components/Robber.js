import { ReactComponent as RobberIcon } from "../assets/icons/pawn.svg";

export default function Robber({ x, y, size = 24, color = "#252525", placeRobber = false, onPlaceRobber }) {
  if (placeRobber) {
    // Draw simple placeholder circle
    return (
      <circle
        cx={x}
        cy={y}
        r={size / 2} // match size roughly
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
        pointerEvents="all"
        style={{ cursor: "pointer" }}
        onClick={onPlaceRobber}
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
          filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.75))"
        }}
        stroke={color}      // border color
        strokeWidth={1}
      />
    </g>
  );
}
