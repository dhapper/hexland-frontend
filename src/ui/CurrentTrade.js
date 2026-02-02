// src/ui/CurrentTrade.js
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";
import { truncate } from "../utils/stringUtils";

export default function CurrentTrade({
    myPlayerId,
    players, // all players { id, name }
    currentTrade, // { fromPlayerId, offer, want, responses }
    resources, // { wood: 2, ore: 1, ... } needed to check accept
    closeTrade,
    confirmTrade,
    onAccept,
    onDecline
}) {
    if (!currentTrade) return null; // nothing to show

    const { fromPlayerId, offer, want, responses } = currentTrade;
    const isInitiator = myPlayerId === fromPlayerId;

    // Helper: check if player can fulfill the trade
    const canAccept = Object.entries(want).every(
        ([res, qty]) => (resources[res] || 0) >= qty
    );

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
                // minWidth: "500px",
            }}
        >
            <h4 style={{ color: theme.colors.lightAccent }}>
                {isInitiator ? "Your Trade Offer" : "Incoming Trade Offer"}
            </h4>

            {/* Offer / Want columns */}
            <div
                style={{
                    display: "flex",
                    gap: "32px",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                {/* Offer */}
                <div style={{ textAlign: "center" }}>
                    <h5 style={{ color: theme.colors.lightAccent }}>Offer</h5>
                    {Object.entries(offer).map(([res, qty]) => (
                        <ResourceBadge
                            key={`offer-${res}`}
                            resource={res}
                            quantity={qty}
                            dim={qty === 0}
                        />
                    ))}
                </div>

                {/* Want */}
                <div style={{ textAlign: "center" }}>
                    <h5 style={{ color: theme.colors.lightAccent }}>Want</h5>
                    {Object.entries(want).map(([res, qty]) => (
                        <ResourceBadge
                            key={`want-${res}`}
                            resource={res}
                            quantity={qty}
                            dim={qty === 0}
                        />
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", alignItems: "center" }}>
                {isInitiator ? (
                    <>
                        {/* Row of buttons for each other player */}
                        <div style={{ color: theme.colors.lightAccent }}>Accept Offer From:</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {Object.keys(players)
                                .filter((pid) => pid !== myPlayerId)
                                .map((pid) => (
                                    <button
                                        key={pid}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: responses?.[pid] ? players[pid].color : "grey",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: responses?.[pid] ? "pointer" : "not-allowed", // leave unclickable for now
                                        }}
                                        onClick={() => confirmTrade(pid)}
                                    >
                                        {/* {players[pid].name || pid} */}
                                        {truncate(pid)}
                                    
                                    </button>
                                ))}
                        </div>

                        {/* Close trade button below the row */}
                        <button
                            onClick={closeTrade}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Close Trade
                        </button>
                    </>
                ) : (
                    // Not initiator: Accept / Decline
                    <>
                        <button
                            onClick={onAccept}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: canAccept ? "green" : "grey",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: canAccept ? "pointer" : "not-allowed",
                            }}
                            disabled={!canAccept}
                        >
                            Accept
                        </button>
                        <button
                            onClick={onDecline}
                            style={{
                                // padding: "6px 12px",
                                // backgroundColor: "red",
                                // color: "white",
                                // border: "none",
                                // borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Decline
                        </button>
                    </>
                )}
            </div>

        </div>
    );
}
