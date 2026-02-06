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
        border: `4px solid black`,
        // margin: "0 4px",
        textShadow: "none",
        boxShadow: `
    inset -2px -2px 4px rgb(0, 0, 0), /* top-left highlight */
    inset 2px 2px 4px rgb(255, 255, 255)        /* bottom-right shadow */
  `
      }}

    >
      {value}
    </div>
  );
}
