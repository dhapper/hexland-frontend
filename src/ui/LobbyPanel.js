// src/ui/LobbyPanel.js
import React, { useState } from "react";
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

  onSubmitName,
  availableColors = [],
  onSetColor,
  onSetBoardLayout,
  onSetAllBankResources
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Name cannot be empty");
      return;
    }
    console.log("Submitted:", inputValue);
  };

  const [boardLayoutInput, setBoardLayoutInput] = useState("");
  const [bankQtyInput, setBankQtyInput] = useState("");

  const usedColors = Object.values(players).map(p => p.color);

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
                {/* {truncate(id)} */}
                {players[id].displayName}
              </strong>

              {/* Indicators */}
              <span style={{ minWidth: "4em", textAlign: "right" }}>
                {isHostPlayer && "✪"}
                {!isHostPlayer && isMe && "YOU"}
              </span>
            </div>

            {/* Display Name Field
            {id === myPlayerId && (
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 10))}
                  style={{ width: "150px", fontSize: "16px", padding: "5px" }}
                />
                <button
                  onClick={() => {
                    if (!inputValue.trim()) {
                      alert("Name cannot be empty");
                      return;
                    }
                    onSubmitName(inputValue); // ✅ pass the input value
                    console.log("Submitted:", inputValue);
                  }}
                >
                  Submit
                </button>
              </div>
            )} */}


          </div>
        );
      })}


      {/* Display Name */}
      <div>
        <div style={{ color: theme.colors.lightAccent }}>Enter Display Name:</div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.slice(0, 10))}
          style={{ width: "150px", fontSize: "16px", padding: "5px" }}
        />
        <button
          onClick={() => {
            if (!inputValue.trim()) {
              alert("Name cannot be empty");
              return;
            }
            onSubmitName(inputValue); // ✅ pass the input value
            console.log("Submitted:", inputValue);
          }}
        >
          Submit
        </button>
      </div>

      {/* Colors */}
      {/* <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
        {availableColors.map((color) => (
          <button
            key={color}
            style={{
              backgroundColor: color,
              width: 25,
              height: 25,
              borderRadius: "50%",
              border: "1px solid #000",
              cursor: "pointer",
            }}
            onClick={() => { }}
            title={color} // optional: shows color name on hover
          />
        ))}
      </div> */}
      <div style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
        {availableColors.map((color) => {
          const isUsed = usedColors.includes(color);

          return (
            <div
              key={color}
              style={{
                position: "relative",
                width: 25,
                height: 25,
              }}
            >
              <button
                style={{
                  backgroundColor: color,
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "1px solid #000",
                  cursor: isUsed ? "not-allowed" : "pointer",
                  opacity: isUsed ? 0.5 : 1,
                  transition: "transform 0.12s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isUsed) {
                    e.currentTarget.style.transform = "scale(1.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => onSetColor(color)}
                disabled={isUsed}
                title={color}
              />

              {isUsed && (
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                    pointerEvents: "none",
                  }}
                >
                  ✕
                </span>
              )}
            </div>
          );
        })}
      </div>




      {isHost && (

        <div>
          <div style={{ color: theme.colors.lightAccent, marginTop: "10px"}}>Host Buttons</div>

          <div>
            <button onClick={startGame}>Start Game</button>
            <button onClick={rerollBoard}>Reroll Board</button>
            <button onClick={resetGame}>Reset Game</button>
          </div>


          {/* Board Layout */}
          <div style={{ marginTop: 12 }}>
            <div style={{ color: theme.colors.lightAccent }}>
              Board Layout:
            </div>

            <input
              type="text"
              value={boardLayoutInput}
              onChange={(e) => setBoardLayoutInput(e.target.value)}
              placeholder="4,5,6,5,4"
              style={{ width: "180px", fontSize: "16px", padding: "5px" }}
            />

            <button
              onClick={() => {
                const parsedLayout = boardLayoutInput
                  .split(",")
                  .map(v => v.trim())
                  .filter(v => v !== "")
                  .map(Number);

                if (
                  parsedLayout.length === 0 ||
                  parsedLayout.some(n => Number.isNaN(n))
                ) {
                  alert("Invalid layout. Example: 4,5,6,5,4");
                  return;
                }

                onSetBoardLayout(parsedLayout); // ✅ SOCKET EMIT
                console.log("Submitted board layout:", parsedLayout);
              }}
            >
              Submit
            </button>
          </div>

          {/* Bank Resources */}
          <div style={{ marginTop: 12 }}>
            <div style={{ color: theme.colors.lightAccent }}>
              Bank Resource Quantity:
            </div>
            <div style={{ color: theme.colors.lightAccent }}>
              (Base = 19 | 5-6 Expansion = 24)
            </div>

            <input
              type="number"
              value={bankQtyInput}
              onChange={(e) => setBankQtyInput(e.target.value)}
              placeholder="24"
              style={{
                width: "60px",
                fontSize: "16px",
                padding: "5px",
                // backgroundColor: "#222",
                // border: "1px solid #555",
              }}
            />

            <button
              onClick={() => {
                const qty = Number(bankQtyInput);

                if (!Number.isInteger(qty) || qty < 0) {
                  alert("Invalid quantity. Example: 19 or 24");
                  return;
                }

                onSetAllBankResources(qty); // ✅ SOCKET EMIT
                console.log("Set all bank resources to:", qty);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
