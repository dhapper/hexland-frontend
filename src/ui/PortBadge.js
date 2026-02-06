// src/components/PortBadge.js
import React from "react";
import portBg from "../assets/portbg.jpg";

export default function PortBadge({
  resource = "Any",
  offer = "3:1",
  size = 60,
  backgroundColor = "#816751",
  textColor = "#ffffff"
}) {
  const textShadow = `
    1px 1px 4px rgba(0,0,0,1),
    -1px -1px 4px rgba(0,0,0,1),
    1px -1px 4px rgba(0,0,0,1),
    -1px 1px 4px rgba(0,0,0,1)
  `;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderRadius: "50%", // circular
        backgroundColor,
        backgroundImage: `url(${portBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: textColor,
        fontWeight: "500",
        fontSize: size * 0.2,
        border: "4px solid black",
        margin: "0 4px",
        textAlign: "center",
        lineHeight: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.5)", // shadow for the badge itself
      }}
    >
      <span style={{ fontSize: size * 0.3, textShadow }}>{offer}</span>
      <span style={{ fontSize: size * 0.25, textShadow }}>{resource}</span>
    </div>
  );
}
