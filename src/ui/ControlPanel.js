// src/components/BoardScaleControl.js
import React from "react";
import theme from "./theme";
import DefaultTextButton from "./DefaultTextButton";

export default function ControlPanel({ boardScale, setBoardScale, hexPanRef, repositioned, setRepositioned }) {
    return (
        <div
            style={{
                color: theme.colors.lightAccent,
                paddingRight: 4,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                margin: theme.styling.componentMargin,
                backgroundColor: theme.colors.componentBackground,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            <h3>Board Scale: {Math.round(boardScale * 100)}%</h3>

            <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={boardScale}
                onChange={(e) => setBoardScale(parseFloat(e.target.value))}
                style={{
                    width: "200px",
                    marginBottom: "10px",
                    accentColor: theme.colors.lightAccent,
                    cursor: "pointer",
                }}
            />

            <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
                <DefaultTextButton
                    onClick={() => {
                        hexPanRef.current?.setPan({ x: 0, y: 0 })
                        setRepositioned(false);
                    }}
                    disabled={!repositioned}
                    style={{
                        fontSize: 32,
                        padding: "5px 12px",
                        paddingBottom: "6px",
                    }}
                    text="⛶"
                />

                <DefaultTextButton
                    onClick={() => setBoardScale(0.8)}
                    style={{
                        fontSize: 32,
                        padding: "5px 10px",
                        paddingBottom: "6px",
                    }}
                    disabled={boardScale === 0.8}
                    text="🔍︎"
                />
            </div>
        </div>
    );
}
