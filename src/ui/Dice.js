// src/components/Dice.js
import React from "react";

export default function Dice({ value, size = 48 }) {

    const darkAccent = "#29201f";

  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        borderRadius: "0.3em",
        backgroundColor: "#dfcea9",
        color: darkAccent,
        fontWeight: "bold",
        fontSize: size * 0.5,
        border: `2px solid ${darkAccent}`,
        margin: "0 4px",
        textShadow: "none"
      }}
    >
      {value}
    </div>
  );
}
