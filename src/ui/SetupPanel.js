// src/ui/PlayerAction.js
import React from "react";
import theme from "./theme";
import { truncate } from "../utils/stringUtils";
import { Phase } from "../utils/constants";
import Dice from "./Dice";
import DefaultTextButton from "./DefaultTextButton";
import { PLAYER_UI_COLORS } from "../utils/playerUIColorMap";

export default function SetupPanel(props) {
    const {
        turnOrder,
        players,
        myPlayerId,
        currentPlayerId,
        hostId,
        phase,
        turnOrderRolls,
        turnOrderRollFunction,
        lastRolls,
    } = props;

    const safeLastRolls = lastRolls ?? {};
    return (
        <div
            style={{
                background: theme.colors.componentBackground,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                padding: theme.styling.componentPadding,
                margin: theme.styling.componentMargin,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            {turnOrder.map((id) => {
                const player = players[id] || { color: "#999" };
                const isMe = id === myPlayerId;
                const isCurrentTurn = id === currentPlayerId;
                const isHost = id === hostId;

                const dice = lastRolls[id]; // 🎯 key line

                return (
                    <div
                        key={id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* PLAYER CARD */}
                        <div
                            style={{
                                padding: 10,
                                minWidth: 160,
                                // backgroundColor: player.color,
                                backgroundColor: PLAYER_UI_COLORS[player.color].bgColor,
                                color: "#000000",
                                borderRadius: theme.styling.defaultRadius,
                                border: `${theme.styling.defaultBorder} ${PLAYER_UI_COLORS[player.color].borderColor}`,
                            }}
                        >
                            {/* Name + Host / YOU */}
                            <div style={{ display: "flex" }}>
                                <strong
                                    style={{
                                        flex: 1,
                                        textAlign: "left",
                                        // textShadow: "0px 0px 4px black",
                                    }}
                                >
                                    {/* {truncate(id)} */}
                                    {player.displayName}
                                </strong>

                                <span style={{ width: "3em", textAlign: "right" }}>
                                    {isHost ? "✪" : isMe ? "YOU" : ""}
                                </span>
                            </div>

                            {/* Current turn */}
                            {isCurrentTurn && (
                                <div
                                    style={{
                                        fontSize: "0.9em",
                                        fontStyle: "italic",
                                        marginTop: 4,
                                        // textShadow: "0px 0px 4px black",
                                    }}
                                >
                                    current turn
                                </div>
                            )}
                        </div>

                        {/* ACTION / DICE AREA */}
                        <div style={{}}>
                            {/* MY PLAYER */}
                            {isMe &&
                                phase === Phase.ROLL_FOR_TURN_ORDER &&
                                !turnOrderRolls?.[myPlayerId] &&
                                !dice && (
                                    // <button onClick={turnOrderRollFunction}>
                                    //     Roll Dice for Turn Order
                                    // </button>
                                    <DefaultTextButton
                                        onClick={turnOrderRollFunction}
                                        text={"ROLL"}
                                    />
                                )}

                            {/* SHOW DICE (ME OR OTHERS) */}
                            {dice && (
                                <div>
                                    <Dice value={dice[0]} /> <Dice value={dice[1]} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
