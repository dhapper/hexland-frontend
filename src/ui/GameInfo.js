import { truncate } from "../utils/stringUtils";
import Dice from "./Dice";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";

export default function GameInfo({
    turnOrder = [],
    players,
    currentPlayerId,
    myPlayerId,
    hostId,
    lastRoll,
    bankResources,
}) {


    return (
        <div
            style={{
                background: theme.colors.componentBackground,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                padding: theme.styling.componentPadding,
                margin: theme.styling.componentMargin
            }}
        >
            {turnOrder.map((id, index) => {
                const player = players[id] || { color: "#999" }; // fallback
                const isMe = id === myPlayerId;
                const isCurrentTurn = id === currentPlayerId;
                const isHost = id === hostId;

                return (
                    <div
                        key={id}
                        style={{
                            marginBottom: 10,
                            padding: 10,
                            backgroundColor: player.color,
                            color: "#fff",
                            borderRadius: theme.styling.defaultRadius,
                            border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                        }}
                    >
                        {/* First line: Host | Name | YOU */}
                        <div style={{ display: "flex" }}>

                            {/* Name centered */}
                            <strong style={{ flex: 1, textAlign: "left", textShadow: "0px 0px 4px black" }}>
                                {truncate(id)}
                            </strong>

                            {/* Host / YOU indicator*/}
                            <span style={{ width: "3em", textAlign: "right" }}>
                                {isHost
                                    ? "✪"      // you are the host, show star instead of YOU
                                    : !isHost && isMe
                                        ? "YOU"    // you are not host, show YOU
                                        : ""       // anyone else, show nothing
                                }
                            </span>

                        </div>


                        {/* Second line: Current turn (centered) */}
                        {isCurrentTurn && (
                            <div style={{ fontSize: "0.9em", fontStyle: "italic", textAlign: "left", marginTop: "4px", textShadow: "0px 0px 4px black" }}>
                                current turn
                            </div>
                        )}
                    </div>

                );
            })}

            <div
                style={{
                    display: "flex",
                    gap: "8px", // spacing between badges
                    flexWrap: "wrap", // optional: wraps to next line if too many
                    alignItems: "center", // vertically center badges
                }}
            >
                {bankResources?.map(({ resource, quantity }) => (
                    <ResourceBadge resource={resource} quantity={quantity} size={60}></ResourceBadge>
                ))}
            </div>

            {/* dice roll */}
            {lastRoll[0] && (
                <div style={{ color: theme.colors.lightAccent, textShadow: "0px 0px 4px black" }}>
                        <strong>
                            Last roll: <Dice value={lastRoll[0]} /> <Dice value={lastRoll[1]} />
                        </strong>
                </div>
            )}

        </div>
    );
}