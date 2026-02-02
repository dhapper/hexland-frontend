// src/ui/PlayerAction.js
import React from "react";
import theme from "./theme";

export default function PlayerAction({
    roadAction,
    houseAction,
    cityAction,
    tradeAction,
    endTurnAction,
    isHost,
    exitLobbyAction,
    actionTime,
    buildCard,
}) {
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
                alignItems: "center",
            }}
        >
            <div style={{}}>
                <button
                    onClick={roadAction}
                >Road</button>
                <button
                    onClick={houseAction}
                >House</button>
                <button
                    onClick={cityAction}
                >City</button>
                <button
                    onClick={() => buildCard()}
                >Card</button>
                <button
                    onClick={tradeAction}
                >Trade</button>
                <button
                    onClick={endTurnAction}
                >End Turn</button>
                {/* { isHost && (
                    <button
                        onClick={exitLobbyAction}
                    >Exit to Lobby</button>
                )} */}
            </div>
        </div>
    );
}
