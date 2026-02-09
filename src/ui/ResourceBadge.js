// src/components/ResourceBadge.js
import React from "react";
import { Resource } from "../utils/constants";
import { ReactComponent as WoodIcon } from "../assets/icons/transparentRes/wood-pile.svg";
import { ReactComponent as BrickIcon } from "../assets/icons/transparentRes/brick-pile.svg";
import { ReactComponent as SheepIcon } from "../assets/icons/transparentRes/sheep.svg";
import { ReactComponent as WheatIcon } from "../assets/icons/transparentRes/wheat.svg";
import { ReactComponent as OreIcon } from "../assets/icons/transparentRes/stone-pile.svg";
import theme from "../ui/theme";
import hillBg from "../assets/brick.jpg";
import fieldBg from "../assets/wheat.jpg";
import pastureBg from "../assets/sheep.jpg";
import forestBg from "../assets/wood.jpg";
import mountainBg from "../assets/ore.jpg";

const resourceMap = {
  [Resource.WOOD]: { icon: WoodIcon, color: "#176431", bg: forestBg },
  [Resource.BRICK]: { icon: BrickIcon, color: "#4d2c2c", bg: hillBg },
  [Resource.WHEAT]: { icon: WheatIcon, color: "#74653b", bg: fieldBg },
  [Resource.ORE]: { icon: OreIcon, color: "#485c6e", bg: mountainBg },
  [Resource.SHEEP]: { icon: SheepIcon, color: "#4f6d41", bg: pastureBg },
};

export default function ResourceBadge({ resource, quantity, size = 80 }) {
  const resourceData = resourceMap[resource];
  if (!resourceData) return null;

  const { icon: IconComponent, color, bg } = resourceData;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: theme.styling.defaultRadius,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        margin: "4px",
        border: `4px solid`,
        borderColor: quantity <= 0 ? "gray" : "black",
        overflow: "visible",
        backgroundColor: color, // fallback if image doesn't load
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          // borderRadius: theme.styling.defaultRadius,
          borderRadius: "4px",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: quantity <= 0 ? "grayscale(100%) brightness(70%)" : "none",
          zIndex: 0,
        }}
      />

      {/* Icon (always normal color) */}
      <IconComponent
        style={{
          width: "80%",
          height: "80%",
          fill: color,
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,1))",
          zIndex: 1,
          position: "relative",
        }}
      />

      {/* Quantity badge */}
      {quantity != null && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: -8,
            minWidth: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: quantity === 0 ? "gray" : "black",
            backgroundColor: quantity === 0 ? "white" : theme.colors.lightAccent,
            fontWeight: "bold",
            fontSize: size * 0.2,
            boxShadow: "0 0 2px black",
            padding: "0px",
            border: `4px solid`,
            borderColor: quantity === 0 ? "gray" : "black",
            overflow: "visible",
            zIndex: 2,
          }}
        >
          {quantity}
        </div>
      )}
    </div>
  );
}
