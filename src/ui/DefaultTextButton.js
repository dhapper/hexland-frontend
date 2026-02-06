// src/components/Dice.js
import React, { useState} from "react";
import theme from "./theme";

export default function DefaultTextButton({
    text,
    backgroundColor = theme.colors.lightAccent,
    onClick,
    disabled = false,
}) {

    const [hovered, setHovered] = useState(false);

    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}

            onClick={onClick}
            disabled={disabled}

            style={{
                cursor: !disabled ? "pointer" : "default",
                // margin: "10px",
                padding: "10px",
                border: "4px solid",
                borderRadius: "32px",
                backgroundColor: hovered ? theme.colors.greenHover : backgroundColor,
                transform: hovered ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s ease",
                fontWeight: "600"
            }}
        >
            {text}
        </button>
    );
}
