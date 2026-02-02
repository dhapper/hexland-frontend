// src/ui/CurrentTrade.js
import theme from "../ui/theme";
import { truncate } from "../utils/stringUtils";

export default function ChooseStealPlayer({
    // myPlayerId,
    players, // all players { id, name, color }
    playersToStealFrom, // only show these players
    onSelectPlayer, // callback when player is chosen
}) {
    if (!playersToStealFrom || playersToStealFrom.length === 0) return null; // nothing to show

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
            <h4 style={{ color: theme.colors.lightAccent }}>
                Choose Player to Steal From:
            </h4>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "16px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {playersToStealFrom.map((pid) => (
                    <button
                        key={pid}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: players[pid]?.color || "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                        onClick={() => onSelectPlayer(pid)}
                    >
                        {truncate(pid)}
                    </button>
                ))}
            </div>
        </div>
    );
}
