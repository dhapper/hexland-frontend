// src/components/PortBadge.js
import React from "react";

export default function PortBadge({
  resource = "Any",
  offer = "3:1",
  size = 60,
  backgroundColor = "#816751",
  textColor = "#000000"
}) {
  const darkBorder = "#29201f";

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderRadius: "50%", // makes it circular
        backgroundColor,
        color: textColor,
        fontWeight: "bold",
        fontSize: size * 0.2,
        border: "4px solid black",
        margin: "0 4px",
        textAlign: "center",
        lineHeight: 1
      }}
    >
      <span style={{ fontSize: size * 0.3 }}>{offer}</span>
      <span style={{ fontSize: size * 0.25 }}>{resource}</span>
    </div>
  );
}
