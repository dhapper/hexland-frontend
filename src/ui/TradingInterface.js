// src/ui/TradingInterface.js
import { useState } from "react";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";
import PortBadge from "./PortBadge";
import DefaultTextButton from "./DefaultTextButton";

export default function TradingInterface({
    resources,
    ports,
    myPlayerId,
    onPlayerTrade,
    onBankTrade,
    closeInterface,
    isMyPairedTurn
}) {
    // Track what player is offering
    const [offerAmounts, setOfferAmounts] = useState(
        Object.fromEntries(Object.keys(resources).map((r) => [r, 0]))
    );

    // Track what player wants
    const [wantAmounts, setWantAmounts] = useState(
        Object.fromEntries(Object.keys(resources).map((r) => [r, 0]))
    );

    const adjustOffer = (res, delta) => {
        setOfferAmounts((prev) => ({
            ...prev,
            [res]: Math.min(Math.max(prev[res] + delta, 0), resources[res]),
        }));
    };

    const adjustWant = (res, delta) => {
        setWantAmounts((prev) => ({
            ...prev,
            [res]: Math.min(Math.max(prev[res] + delta, 0), 20),
        }));
    };

    // Convert { wood: 2 } → ["wood", "wood"]
    const buildList = (tradeObj) =>
        Object.entries(tradeObj).flatMap(([res, qty]) =>
            Array(qty).fill(res)
        );

    const offerList = buildList(offerAmounts);
    const wantList = buildList(wantAmounts);

    // ----- BANK / PORT TRADE VALIDATION -----
    const offerQty = offerList.length;
    const offerResource = offerList[0];
    const singleResourceOffer =
        offerQty > 0 && new Set(offerList).size === 1;

    const ownedPorts = ports.filter((p) =>
        p.owner.includes(myPlayerId)
    );

    const hasAnyPort = ownedPorts.some((p) => p.offer === "3:1");
    const hasSpecificPort = ownedPorts.some(
        (p) => p.offer === "2:1" && p.resource === offerResource
    );

    const isValidBankTrade =
        singleResourceOffer &&
        wantList.length > 0 &&
        (
            offerQty === 4 ||
            (offerQty === 3 && hasAnyPort) ||
            (offerQty === 2 && hasSpecificPort)
        );

    // ----- RESET HELPER -----
    const resetTradeAmounts = () => {
        setOfferAmounts(Object.fromEntries(Object.keys(resources).map((r) => [r, 0])));
        setWantAmounts(Object.fromEntries(Object.keys(resources).map((r) => [r, 0])));
    };

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
                minWidth: "600px",
            }}
        >
            {/* Columns */}
            <div
                style={{
                    display: "flex",
                    gap: "32px",
                    justifyContent: "center",
                    width: "100%",
                    alignItems: "flex-start", // make all columns align at top
                }}
            >
                {/* Your resources */}
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ color: theme.colors.lightAccent }}>
                        Your Resources
                    </h4>
                    {Object.entries(resources).map(([res, amount]) => (
                        <ResourceBadge
                            key={res}
                            resource={res}
                            quantity={amount - offerAmounts[res]}
                            dim={amount - offerAmounts[res] === 0}
                        />
                    ))}
                </div>

                {/* Offer */}
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ color: theme.colors.lightAccent }}>
                        Offer
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
                                quantity={offerAmounts[res]}
                                dim={offerAmounts[res] === 0}
                            />
                            <button onClick={() => adjustOffer(res, -1)}>-</button>
                            <button onClick={() => adjustOffer(res, 1)}>+</button>
                        </div>
                    ))}
                </div>

                {/* Want */}
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4 style={{ color: theme.colors.lightAccent }}>
                        Want
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
                                quantity={wantAmounts[res]}
                                dim={wantAmounts[res] === 0}
                            />
                            <button onClick={() => adjustWant(res, -1)}>-</button>
                            <button onClick={() => adjustWant(res, 1)}>+</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trade buttons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>

                {!isMyPairedTurn && (
                    <DefaultTextButton
                        onClick={() => {
                            onPlayerTrade(offerList, wantList);
                            resetTradeAmounts();
                        }}
                        disabled={!offerList.length || !wantList.length}
                        text={"Player Trade"}
                    />
                )}

                <DefaultTextButton
                    onClick={() => {
                        onBankTrade(offerList, wantList);
                        resetTradeAmounts();
                    }}
                    disabled={!isValidBankTrade}
                    text={"Bank / Port Trade"}
                />
            </div>

            {/* Ports */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "10px",
                }}
            >
                {ownedPorts.map((port, i) => (
                    <PortBadge
                        key={i}
                        offer={port.offer}
                        resource={port.resource}
                    />
                ))}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <DefaultTextButton
                    onClick={closeInterface}
                    text="Close"
                    backgroundColor={theme.colors.redButton}
                />
            </div>
        </div>
    );
}
