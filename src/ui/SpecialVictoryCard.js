// src/components/SpecialVictoryBadge.js
import React from "react";
import { SpecialVictoryCardConst } from "../utils/constants";
import { ReactComponent as KnightIcon } from "../assets/icons/knight.svg";
import { ReactComponent as RoadIcon } from "../assets/icons/road.svg";
import theme from "../ui/theme";

const cardMap = {
  [SpecialVictoryCardConst.LARGEST_ARMY]: { icon: KnightIcon },
  [SpecialVictoryCardConst.LONGEST_ROAD]: { icon: RoadIcon },
};

export default function SpecialVictoryBadge({
  specialVictoryCard,
  size = 80,
}) {
  const cardData = cardMap[specialVictoryCard];
  if (!cardData) return null;

  const { icon: IconComponent } = cardData;
  const gradientId = `gold-gradient-${specialVictoryCard}`;

  const darkRedBrown = "#4B2E2E";
  const borderThickness = 4;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: theme.styling.defaultRadius,
        background: `
          linear-gradient(145deg,
            #fff4b0 0%,
            #ffc343 30%,
            #d4a017 60%,
            #fff4b0 100%
          )
        `,
        padding: borderThickness,
        margin: "4px",
        overflow: "hidden", // ⭐ KEY FIX
        boxShadow: `
          inset 0 0 6px rgba(255, 255, 255, 0.6),
          0 3px 6px rgba(0, 0, 0, 0.4)
        `,
      }}
    >
      {/* SVG gradient definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fff4b0" />
            <stop offset="30%" stopColor="#ffc343" />
            <stop offset="60%" stopColor="#d4a017" />
            <stop offset="100%" stopColor="#fff4b0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner card */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: theme.styling.defaultRadius, // ⭐ same radius
          backgroundColor: darkRedBrown,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "inset 0 0 8px rgba(0,0,0,0.6)",
        }}
      >
        <IconComponent
          style={{
            width: "70%",
            height: "70%",
            fill: `url(#${gradientId})`,
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
          }}
        />
      </div>
    </div>
  );
}
