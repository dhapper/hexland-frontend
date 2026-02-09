import React from "react";
import { ReactComponent as ShipIcon } from "../assets/ship2.svg";
import theme from "../ui/theme";

export default function Port({ x, y, angle = 0, size = 24, xOffset, yOffset, offer, resource }) {
    const dockLength = size * 1;
    const dockWidth = size * 0.7;
    const yAdjust = -dockLength / 2;

    const xOffsetAdjustedShip = xOffset * 3.5;
    const yOffsetAdjustedShip = yOffset * 3.5 - size / 10;
    const xOffsetAdjustedSign = xOffset * 4;
    const yOffsetAdjustedSign = yOffset * 4;
    const xOffsetAdjustedText = xOffset * 1.1;
    const yOffsetAdjustedText = yOffset * 1.1;


    return (
        <>
            {/* Dock plank — keep exactly as before */}
            <g
                transform={`translate(${x}, ${y}) rotate(${angle})`}
                pointerEvents="none"
            >
                <rect
                    x={0}
                    y={yAdjust}
                    width={dockWidth}
                    height={dockLength}
                    rx={3}
                    fill={theme.colors.dock}
                    stroke={"#000000"}
                    strokeWidth={3}
                />

                {/* Cross planks */}
                <line
                    x1={0}
                    y1={yAdjust + dockLength * 0.33}
                    x2={dockWidth}
                    y2={yAdjust + dockLength * 0.33}
                    stroke={theme.colors.dockAccent}
                    strokeWidth={2}
                />
                <line
                    x1={0}
                    y1={yAdjust + dockLength * 0.66}
                    x2={dockWidth}
                    y2={yAdjust + dockLength * 0.66}
                    stroke={theme.colors.dockAccent}
                    strokeWidth={2}
                />

            </g>

            <g pointerEvents="none">
                {/* Define shadow filter */}
                <defs>
                    <filter id={`textShadow-${offer}-${resource}`} width="200%" height="200%" x="-50%" y="-50%">
                        <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="black" floodOpacity="1" />
                    </filter>
                </defs>

                <g transform={`translate(${x + xOffsetAdjustedText}, ${y + yOffsetAdjustedText})`}>
                    <text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        fontSize={10}
                        fill="white"
                        style={{ userSelect: "none" }}
                        filter={`url(#textShadow-${offer}-${resource})`} // apply shadow
                    >
                        <tspan x={0} dy="-7">{offer}</tspan>
                        <tspan x={0} dy="14">{resource}</tspan>
                    </text>
                </g>
            </g>

            {/* Ship icon — completely independent, not rotated by dock */}
            <g transform={`translate(${x - size / 2 + xOffsetAdjustedShip}, ${y - size / 2 + yOffsetAdjustedShip})`} pointerEvents="none">
                <ShipIcon
                    width={size}
                    height={size}
                    stroke="black"
                    strokeWidth={2}
                />
            </g>
        </>
    );
}
