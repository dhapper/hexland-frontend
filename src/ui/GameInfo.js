import { truncate } from "../utils/stringUtils";
import Dice from "./Dice";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";
import { Phase, TurnPhase } from "../utils/constants";
import DefaultTextButton from "./DefaultTextButton";

export default function GameInfo({
    turnOrder = [],
    players,
    currentPlayerId,
    myPlayerId,
    hostId,
    lastRoll,
    bankResources,
    rollTime,
    rollDice,
    phase,
    turnPhase,
    pairedPlayerId,
    onExitToLobby,
    isHost
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                }}
            >
                {isHost && (
                    <DefaultTextButton
                        text="Back To Lobby"
                        onClick={() => onExitToLobby()}
                        backgroundColor={theme.colors.redButton}
                    />
                )}
            </div>

            {phase !== Phase.LOBBY && (

                turnOrder.map((id) => {
                    const player = players[id] || { color: "#999" };
                    const isMe = id === myPlayerId;
                    const isCurrentTurn = id === currentPlayerId;
                    const isHost = id === hostId;

                    const visibleVP = player.visibleVictoryPoints ?? 0;
                    const actualVP = player.actualVictoryPoints ?? 0;
                    const vpText = isMe && visibleVP !== actualVP
                        ? `${visibleVP} (${actualVP})` // show actualVP only for yourself
                        : `${visibleVP}`;             // everyone else only sees visibleVP

                    return (
                        <div
                            key={id}
                            style={{
                                marginBottom: 10,
                                padding: 7,
                                backgroundColor: player.color,
                                color: "#fff",
                                borderRadius: theme.styling.defaultRadius,
                                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                                position: "relative",
                                minHeight: 50,
                            }}
                        >
                            {/* Top-right indicator */}
                            <div style={{ position: "absolute", top: 8, right: 8 }}>
                                {isHost ? "✪" : isMe ? "YOU" : ""}
                            </div>

                            {/* Player name */}
                            <strong style={{ textShadow: "0px 0px 4px black" }}>
                                {truncate(id)}
                            </strong>

                            {/* Current turn */}
                            {isCurrentTurn && (
                                <div style={{
                                    fontSize: "0.9em",
                                    fontStyle: "italic",
                                    marginTop: 4,
                                    textShadow: "0px 0px 4px black"
                                }}>
                                    current turn
                                </div>
                            )}

                            {/* Paired Player */}
                            {id === pairedPlayerId && (
                                <div style={{
                                    fontSize: "0.9em",
                                    fontStyle: "italic",
                                    marginTop: 4,
                                    textShadow: "0px 0px 4px black"
                                }}>
                                    paired player
                                </div>
                            )}

                            {/* Bottom-right Victory Points */}
                            <div style={{
                                position: "absolute",
                                bottom: 8,
                                right: 8,
                                fontWeight: "bold",
                                textShadow: "0px 0px 4px black"
                            }}>
                                {vpText}
                            </div>
                        </div>
                    );
                })



            )}

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

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "10px",
                }}
            >

                {/* dice roll */}
                {rollTime && (
                    // <button
                    //     onClick={rollDice}
                    // >Roll The Dice</button>
                    <DefaultTextButton
                        text="ROLL"
                        onClick={rollDice}
                        backgroundColor={theme.colors.blueButton}
                    />
                )}

                {lastRoll[0] && (
                    <div style={{ color: theme.colors.lightAccent, textShadow: "0px 0px 4px black", fontWeight: "400", fontSize: "20px" }}>
                        <strong>
                            Last roll: <Dice value={lastRoll[0]} /> <Dice value={lastRoll[1]} />
                        </strong>
                    </div>
                )}

            </div>

        </div>
    );
}