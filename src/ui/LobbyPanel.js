// src/ui/LobbyPanel.js
import React, { useState } from "react";
import theme from "./theme";
import { truncate } from "../utils/stringUtils";
import { PLAYER_UI_COLORS } from "../utils/playerUIColorMap";
import DefaultTextButton from "./DefaultTextButton";

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
  onSetAllBankResources,
  onEnabledPairedPlayer,
  onSetDevCards,
  onSetRobberMax,
  robberMaxCardsValue,
  onSetVictoryPointsNeeded,
  victoryPointsNeededValue,
  disconnectEveryone,

  connected,
}) {
  const [inputValue, setInputValue] = useState("");
  const [pairedPlayerEnabled, setPairedPlayerEnabled] = React.useState(false);
  const [expDevCards, setExpDevCards] = React.useState(false);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert("Name cannot be empty");
      return;
    }
    console.log("Submitted:", inputValue);
  };

  const [boardLayoutInput, setBoardLayoutInput] = useState("");
  const [bankQtyInput, setBankQtyInput] = useState("");
  const [robberMaxCards, setRobberMaxCards] = useState("");
  const [victoryPointsNeeded, setVictoryPointsNeeded] = useState("");

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

      {!connected && (
        <div style={{ color: "white" }} >Server not connected or offline</div>
      )}

      {connected && (
        <>

          {Object.entries(players).map(([id, player]) => {
            const isMe = id === myPlayerId;
            const isHostPlayer = id === hostId;

            return (
              <div
                key={id}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  backgroundColor: PLAYER_UI_COLORS[player.color].bgColor || "#999",
                  color: "#000000",
                  borderRadius: theme.styling.defaultRadius,
                  border: `${theme.styling.defaultBorder} ${PLAYER_UI_COLORS[player.color].borderColor}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Player name */}
                  <strong
                    style={{
                      flex: 1,
                      textAlign: "left",
                      // textShadow: "0px 0px 4px black",
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
              </div>
            );
          })}


          {/* Display Name */}
          <div>
            <div style={{ color: theme.colors.lightAccent, marginBottom: "5px", }}>Enter Display Name:</div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 10))}
              style={{
                width: "150px", fontSize: "16px", padding: "5px", marginBottom: "5px",
                border: theme.styling.defaultBorder,
                borderRadius: theme.styling.defaultRadius,
                marginRight: "5px"
              }}
            />
            <DefaultTextButton
              onClick={() => {
                if (!inputValue.trim()) {
                  alert("Name cannot be empty");
                  return;
                }
                onSubmitName(inputValue); // ✅ pass the input value
                console.log("Submitted:", inputValue);
              }}
              text="Submit"
            />
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: 5, flexWrap: "wrap" }}>
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
                      border: "4px solid #000",
                      cursor: isUsed ? "" : "pointer",
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

          {/* Host Panel */}
          {isHost && (

            <div>
              <div style={{ color: theme.colors.lightAccent, marginTop: "15px" }}>Host Buttons</div>

              <div style={{ display: "flex", gap: "5px", margin: "5px 0", flexWrap: "wrap" }}>
                <DefaultTextButton onClick={startGame} text="Start" backgroundColor={theme.colors.blueButton} />
                <DefaultTextButton onClick={rerollBoard} text="Reroll" />
                <DefaultTextButton onClick={resetGame} text="Restart" />
                <DefaultTextButton onClick={disconnectEveryone} text="Disconnect" backgroundColor={theme.colors.redButton} />
              </div>


              {/* Board Layout */}
              <div style={{ marginTop: "15px" }}>
                <div style={{ color: theme.colors.lightAccent }}>
                  Board Layout:
                </div>

                <input
                  type="text"
                  value={boardLayoutInput}
                  onChange={(e) => setBoardLayoutInput(e.target.value)}
                  placeholder="4,5,6,5,4"
                  style={{
                    width: "180px", fontSize: "16px", padding: "5px", margin: "5px 0",
                    border: theme.styling.defaultBorder,
                    borderRadius: theme.styling.defaultRadius,
                    marginRight: "5px"
                  }}
                />
                <DefaultTextButton
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
                  text="Submit"
                />
              </div>

              {/* Bank Resources */}
              <div style={{ marginTop: "15px" }}>
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
                    border: theme.styling.defaultBorder,
                    borderRadius: theme.styling.defaultRadius,
                    marginRight: "5px"
                  }}
                />
                <DefaultTextButton
                  onClick={() => {
                    const qty = Number(bankQtyInput);
                    if (!Number.isInteger(qty) || qty < 0) {
                      alert("Invalid quantity. Example: 19 or 24");
                      return;
                    }
                    onSetAllBankResources(qty); // ✅ SOCKET EMIT
                    console.log("Set all bank resources to:", qty);
                  }}
                  text="Submit"
                />
              </div>

              {/* Robber Max Number */}
              <div style={{ marginTop: "15px" }}>
                <div style={{ color: theme.colors.lightAccent }}>
                  Robber Max Cards Safety Number: {robberMaxCardsValue}
                </div>
                <input
                  type="number"
                  value={robberMaxCards}
                  onChange={(e) => setRobberMaxCards(e.target.value)}
                  placeholder="7"
                  style={{
                    width: "60px",
                    fontSize: "16px",
                    padding: "5px",
                    border: theme.styling.defaultBorder,
                    borderRadius: theme.styling.defaultRadius,
                    marginRight: "5px"
                  }}
                />
                <DefaultTextButton
                  onClick={() => {
                    const max = Number(robberMaxCards);
                    if (!Number.isInteger(max) || max < 0) {
                      alert("Invalid quantity. Example: 7");
                      return;
                    }
                    onSetRobberMax(max); // ✅ SOCKET EMIT
                    console.log("Set robber max to:", max);
                  }}
                  text="Submit"
                />
              </div>

              {/* Victory Points Needed */}
              <div style={{ marginTop: "15px" }}>
                <div style={{ color: theme.colors.lightAccent }}>
                  Victory Points Needed: {victoryPointsNeededValue}
                </div>
                <input
                  type="number"
                  value={victoryPointsNeeded}
                  onChange={(e) => setVictoryPointsNeeded(e.target.value)}
                  placeholder="10"
                  style={{
                    width: "60px",
                    fontSize: "16px",
                    padding: "5px",
                    border: theme.styling.defaultBorder,
                    borderRadius: theme.styling.defaultRadius,
                    marginRight: "5px"
                  }}
                />
                <DefaultTextButton
                  onClick={() => {
                    const vpNeeded = Number(victoryPointsNeeded);
                    if (!Number.isInteger(vpNeeded) || vpNeeded < 0) {
                      alert("Invalid quantity. Example: 10");
                      return;
                    }
                    onSetVictoryPointsNeeded(vpNeeded); // ✅ SOCKET EMIT
                    console.log("Set victory points needed to:", vpNeeded);
                  }}
                  text="Submit"
                />
              </div>


              {/* Paired Player */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: theme.colors.lightAccent,
                  cursor: "pointer",
                  marginTop: "15px"
                }}
              >
                <input
                  type="checkbox"
                  checked={pairedPlayerEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    console.log(enabled);
                    setPairedPlayerEnabled(enabled);
                    onEnabledPairedPlayer(enabled);
                  }}
                />
                Paired Player
              </label>

              {/* Expansion Cards */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: theme.colors.lightAccent,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={expDevCards}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    console.log(enabled);
                    setExpDevCards(enabled);
                    onSetDevCards(enabled);
                  }}
                />
                Expansion Action Cards
              </label>

            </div>
          )}

        </>
      )}


    </div>
  );
}
