// src/ui/MonopolyInterface.js
import React, { useState } from "react";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";
import { Resource } from "../utils/constants";

export default function MonopolyInterface({ 
  onClose,
  monopolizeResource
 }) {
  const resources = [Resource.WOOD, Resource.BRICK, Resource.SHEEP, Resource.WHEAT, Resource.ORE];

  // Track hovered badge
  const [hoveredRes, setHoveredRes] = useState(null);

  return (
    <div
      style={{
        background: theme.colors.componentBackground,
        border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
        borderRadius: theme.styling.defaultRadius,
        padding: theme.styling.componentPadding,
        margin: theme.styling.componentMargin,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "500px",
      }}
    >
      <h3 style={{ color: theme.colors.lightAccent, marginBottom: "16px" }}>
        Choose Resource to Monopolize
      </h3>

      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        {resources.map((res) => (
          <div
            onClick={() => monopolizeResource(res)}
            key={res}
            onMouseEnter={() => setHoveredRes(res)}
            onMouseLeave={() => setHoveredRes(null)}
            style={{
              transition: "transform 0.1s ease",
              transform: hoveredRes === res ? "scale(1.2)" : "scale(1)",
              cursor: "pointer",
            }}
          >
            <ResourceBadge resource={res} />
          </div>
        ))}
      </div>

      {/* Bare-bones close button */}
      <button
        onClick={onClose}
        style={{
          padding: "8px 16px",
          borderRadius: theme.styling.defaultRadius,
          border: `2px solid ${theme.colors.lightAccent}`,
          backgroundColor: theme.colors.componentBackground,
          color: theme.colors.lightAccent,
          cursor: "pointer",
          marginTop: "auto",
        }}
      >
        Close
      </button>
    </div>
  );
}
