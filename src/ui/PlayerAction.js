// src/ui/PlayerAction.js
import React, { useState } from "react";
import theme from "./theme";
import DefaultTextButton from "./DefaultTextButton";

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
    // isMyPairedTurn
}) {

    const [hovered, setHovered] = useState(false);

    return (

        <div
            style={{
                background: theme.colors.componentBackground,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                // padding: theme.styling.componentPadding,
                margin: theme.styling.componentMargin,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    margin: "10px"
                }}
            >

                <DefaultTextButton
                    text="Road"
                    onClick={roadAction}
                    disabled={!canAffordRoad}
                />

                <DefaultTextButton
                    text="House"
                    onClick={houseAction}
                    disabled={!canAffordHouse}
                />

                <DefaultTextButton
                    text="City"
                    onClick={cityAction}
                    disabled={!canAffordCity}
                />

                <DefaultTextButton
                    text="Card"
                    onClick={() => buildCard()}
                    disabled={!canAffordDevCard}
                />

                <DefaultTextButton
                    text="Trade"
                    onClick={tradeAction}
                />

                <DefaultTextButton
                    text="End Turn"
                    onClick={endTurnAction}
                    backgroundColor={theme.colors.redButton}
                />

            </div>
        </div>
    );
}
