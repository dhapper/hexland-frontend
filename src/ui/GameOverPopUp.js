import theme from "../ui/theme";
import { truncate } from "../utils/stringUtils";

export default function GameOverPopUp({
    winnerDisplayName,
    isHost,
    onBackToLobby,
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
            <h1 style={{ color: theme.colors.lightAccent }}>
                {winnerDisplayName} has WON!
            </h1>

            {isHost && (
                <button
                    onClick={() => onBackToLobby()}
                >
                    Back to Lobby
                </button>
            )}

        </div>
    );
}
