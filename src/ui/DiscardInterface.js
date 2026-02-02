import { useState, useMemo } from "react";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";
import { truncate } from "../utils/stringUtils";

export default function DiscardInterface({
    resources,          // { wood: 3, brick: 2, ... }
    discardCount,       // number player must discard
    onSubmitDiscard,    // (discardList) => void
    robber,
    myPlayerId,
    satisfied,
}) {
    // Track discard amounts
    const [discardAmounts, setDiscardAmounts] = useState(
        Object.fromEntries(Object.keys(resources).map((r) => [r, 0]))
    );

    const adjustDiscard = (res, delta) => {
        setDiscardAmounts((prev) => {
            const next = prev[res] + delta;
            return {
                ...prev,
                [res]: Math.min(
                    Math.max(next, 0),
                    resources[res] // cannot discard more than owned
                ),
            };
        });
    };

    // Build flat list: { wood: 2 } → ["wood", "wood"]
    const discardList = useMemo(
        () =>
            Object.entries(discardAmounts).flatMap(([res, qty]) =>
                Array(qty).fill(res)
            ),
        [discardAmounts]
    );

    const totalDiscarded = discardList.length;
    const isExactAmount = totalDiscarded === discardCount;

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
                minWidth: "500px",
            }}
        >


            {satisfied && (
                <div style={{ textAlign: "center",  }}>
                    <h4>Waiting for other players to discard</h4>

                    {Object.entries(robber.mustDiscard)
                        .filter(([_, info]) => !info.satisfied)
                        .map(([playerId]) => (
                            <p key={playerId}>
                                Waiting for player {truncate(playerId)} to discard…
                            </p>
                        ))}
                </div>
            )}


            {!satisfied && (

                <div>

                    <h3 style={{ color: theme.colors.lightAccent }}>
                        Discard Cards
                    </h3>

                    <p style={{ marginBottom: "12px" }}>
                        You must discard{" "}
                        <strong>{discardCount}</strong> card
                        {discardCount !== 1 ? "s" : ""}.
                        <br />
                        Selected:{" "}
                        <strong>{totalDiscarded}</strong>
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "32px",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        {/* Your resources */}
                        <div
                            style={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <h4 style={{ color: theme.colors.lightAccent }}>
                                Your Resources
                            </h4>
                            {Object.entries(resources).map(([res, amount]) => (
                                <ResourceBadge
                                    key={res}
                                    resource={res}
                                    quantity={amount - discardAmounts[res]}
                                    dim={amount - discardAmounts[res] === 0}
                                />
                            ))}
                        </div>

                        {/* Discard */}
                        <div
                            style={{
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <h4 style={{ color: theme.colors.lightAccent }}>
                                Discard
                            </h4>

                            {Object.keys(resources).map((res) => (
                                <div
                                    key={res}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <ResourceBadge
                                        resource={res}
                                        quantity={discardAmounts[res]}
                                        dim={discardAmounts[res] === 0}
                                    />
                                    <button onClick={() => adjustDiscard(res, -1)}>
                                        -
                                    </button>
                                    <button onClick={() => adjustDiscard(res, 1)}>
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Submit */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <button
                            onClick={() => onSubmitDiscard(discardList)}
                            disabled={!isExactAmount}
                            style={{
                                marginTop: "16px",
                                opacity: isExactAmount ? 1 : 0.4,
                                cursor: isExactAmount ? "pointer" : "not-allowed",
                            }}
                        >
                            Submit Discard
                        </button>
                    </div>

                </div>

            )}

        </div>
    );
}
