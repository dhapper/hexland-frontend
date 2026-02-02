import { useState, useMemo } from "react";
import theme from "../ui/theme";
import ResourceBadge from "./ResourceBadge";

export default function InventionInterface({
    bankResources,      // [{ resource: "wood", quantity: 19 }, ...]
    onSubmitInvention,  // (wantList) => void
    onClose,
}) {
    // Track selected amounts (max total = 2)
    const [selectedAmounts, setSelectedAmounts] = useState(
        Object.fromEntries(bankResources.map(b => [b.resource, 0]))
    );

    const totalSelected = Object.values(selectedAmounts).reduce(
        (sum, v) => sum + v,
        0
    );

    const adjustSelect = (res, delta) => {
        setSelectedAmounts(prev => {
            const next = prev[res] + delta;

            if (next < 0) return prev;
            if (delta > 0 && totalSelected >= 2) return prev;

            return {
                ...prev,
                [res]: next,
            };
        });
    };

    // Build flat wantList → ["ore", "wheat"]
    const wantList = useMemo(
        () =>
            Object.entries(selectedAmounts).flatMap(([res, qty]) =>
                Array(qty).fill(res)
            ),
        [selectedAmounts]
    );

    const isValid = totalSelected === 2;

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
                minWidth: "420px",
            }}
        >
            <h3 style={{ color: theme.colors.lightAccent }}>
                Invention
            </h3>

            <p style={{ marginBottom: "12px" }}>
                Select <strong>2</strong> resources from the bank.
                <br />
                Selected: <strong>{totalSelected}</strong> / 2
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {bankResources.map(({ resource, quantity }) => {
                    const selected = selectedAmounts[resource];
                    const disablePlus =
                        totalSelected >= 2 || quantity - selected <= 0;

                    return (
                        <div
                            key={resource}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <ResourceBadge
                                resource={resource}
                                quantity={selected}
                                dim={selected === 0}
                            />

                            <button
                                onClick={() => adjustSelect(resource, -1)}
                                disabled={selected === 0}
                            >
                                -
                            </button>

                            <button
                                onClick={() => adjustSelect(resource, 1)}
                                disabled={disablePlus}
                                style={{
                                    opacity: disablePlus ? 0.4 : 1,
                                    cursor: disablePlus
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                +
                            </button>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => onSubmitInvention(wantList)}
                disabled={!isValid}
                style={{
                    marginTop: "16px",
                    opacity: isValid ? 1 : 0.4,
                    cursor: isValid ? "pointer" : "not-allowed",
                }}
            >
                Take Resources
            </button>

            {/* Bare-bones close button */}
            <button
                onClick={onClose}
                style={{
                    padding: "8px 16px",
                    borderRadius: theme.styling.defaultRadius,
                    border: `2px solid ${theme.colors.lightAccent}`,
                    backgroundColor: theme.colors.componentBackground,
                    color: theme.colors.lightAccent,
                    cursor: "pointer",
                    marginTop: "auto",
                }}
            >
                Close
            </button>
        </div>
    );
}
