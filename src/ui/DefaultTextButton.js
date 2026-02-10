// src/components/Dice.js
import React, { useState } from "react";
import theme from "./theme";

export default function DefaultTextButton({
    text,
    backgroundColor = theme.colors.lightAccent,
    onClick,
    disabled = false,
    style = {}, // custom styles
}) {
    const [hovered, setHovered] = useState(false);

    // 1️⃣ Start with hover/default dependent styles
    const dynamicStyles = {
        cursor: !disabled ? "pointer" : "default",
        padding: "10px",
        border: "4px solid",
        borderRadius: "32px",
        backgroundColor: hovered ? theme.colors.greenHover : backgroundColor,
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "all 0.2s ease",
        fontWeight: "600",
    };

    // 2️⃣ Merge in user styles LAST so they override defaults
    const finalStyles = { ...dynamicStyles, ...style };

    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            disabled={disabled}
            style={finalStyles}
        >
            {text}
        </button>
    );
}
