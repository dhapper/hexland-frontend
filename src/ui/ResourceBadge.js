// src/components/ResourceBadge.js
import React from "react";
import { Resource } from "../utils/constants";
import { ReactComponent as WoodIcon } from "../assets/icons/wood-pile.svg";
import { ReactComponent as BrickIcon } from "../assets/icons/brick-pile.svg";
import { ReactComponent as SheepIcon } from "../assets/icons/sheep.svg";
import { ReactComponent as WheatIcon } from "../assets/icons/wheat.svg";
import { ReactComponent as OreIcon } from "../assets/icons/stone-pile.svg";
import theme from "../ui/theme";

const resourceMap = {
  [Resource.WOOD]: { icon: WoodIcon, color: "#176431" },
  [Resource.BRICK]: { icon: BrickIcon, color: "#4d2c2c" },
  [Resource.WHEAT]: { icon: WheatIcon, color: "#74653b" },
  [Resource.ORE]: { icon: OreIcon, color: "#485c6e" },
  [Resource.SHEEP]: { icon: SheepIcon, color: "#4f6d41" },
};

export default function ResourceBadge({ resource, quantity, size = 80 }) {
  const resourceData = resourceMap[resource];
  if (!resourceData) return null;

  const { icon: IconComponent, color } = resourceData;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: theme.styling.defaultRadius,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: color,
        position: "relative",
        margin: "4px",
        border: `4px solid #000000`,
        overflow: "visible"
      }}
    >
      <IconComponent
        style={{
          width: "80%",
          height: "80%",
          fill: color,
        }}
      />

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
            color: "black",
            fontWeight: "bold",
            fontSize: size * 0.2,
            boxShadow: "0 0 2px black",
            padding: "0px",
            border: `4px solid #000000`,
            overflow: "visible"
          }}
        >
          {quantity}
        </div>
      )}
    </div>
  );
}
