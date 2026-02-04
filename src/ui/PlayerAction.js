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
    canAffordRoad,
    canAffordHouse,
    canAffordCity,
    canAffordDevCard,
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
                    disabled={!canAffordRoad}
                    style={{
                        cursor: canAffordRoad ? "pointer" : "default"
                    }}
                >Road</button>
                <button
                    onClick={houseAction}
                    disabled={!canAffordHouse}
                    style={{
                        cursor: canAffordHouse ? "pointer" : "default"
                    }}
                >House</button>
                <button
                    onClick={cityAction}
                    disabled={!canAffordCity}
                    style={{
                        cursor: canAffordCity ? "pointer" : "default"
                    }}
                >City</button>
                <button
                    onClick={() => buildCard()}
                    disabled={!canAffordDevCard}
                    style={{
                        cursor: canAffordDevCard ? "pointer" : "default"
                    }}
                >Card</button>
                <button
                    onClick={tradeAction}
                    style={{
                        cursor: "pointer"
                    }}
                >Trade</button>
                <button
                    onClick={endTurnAction}
                    style={{
                        cursor: "pointer"
                    }}
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
