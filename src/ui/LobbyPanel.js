// src/ui/LobbyPanel.js
import React from "react";
import theme from "./theme";
import { truncate } from "../utils/stringUtils";

export default function LobbyPanel({
  startGame,
  rerollBoard,
  resetGame,
  changeColor,
  isHost,

  players,
  myPlayerId,
  hostId,
}) {
  return (
    <div
      style={{
        background: theme.colors.componentBackground,
        border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
        borderRadius: theme.styling.defaultRadius,
        padding: theme.styling.componentPadding,
        margin: theme.styling.componentMargin,
      }}
    >
      {Object.entries(players).map(([id, player]) => {
        const isMe = id === myPlayerId;
        const isHostPlayer = id === hostId;

        return (
          <div
            key={id}
            style={{
              marginBottom: 10,
              padding: 10,
              backgroundColor: player.color || "#999",
              color: "#fff",
              borderRadius: theme.styling.defaultRadius,
              border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Player name */}
              <strong
                style={{
                  flex: 1,
                  textAlign: "left",
                  textShadow: "0px 0px 4px black",
                }}
              >
                {truncate(id)}
              </strong>

              {/* Indicators */}
              <span style={{ minWidth: "4em", textAlign: "right" }}>
                {isHostPlayer && "✪"}
                {!isHostPlayer && isMe && "YOU"}
              </span>
            </div>
          </div>
        );
      })}

      <button onClick={changeColor}>Change My Color</button>

      {isHost && (
        <>
          <button onClick={startGame}>Start Game</button>
          <button onClick={rerollBoard}>Reroll Board</button>
          <button onClick={resetGame}>Reset Game</button>
        </>
      )}
    </div>
  );
}
