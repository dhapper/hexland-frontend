// src/components/DevCard.js
import { useState } from "react";
import { DevCard as DevCardType } from "../utils/constants";
import { ReactComponent as KnightIcon } from "../assets/icons/knight.svg";
import { ReactComponent as BuildRoadIcon } from "../assets/icons/road.svg";
import { ReactComponent as InventorIcon } from "../assets/icons/inventor.svg";
import { ReactComponent as MonopolyIcon } from "../assets/icons/monopoly.svg";
import { ReactComponent as VictoryPointIcon } from "../assets/icons/victory-point.svg";
import theme from "../ui/theme";

const devCardMap = {
    [DevCardType.KNIGHT]: { icon: KnightIcon, color: theme.colors.knightCard, solid: false },
    [DevCardType.ROAD_BUILDING]: { icon: BuildRoadIcon, color: theme.colors.altCard, solid: false },
    [DevCardType.INVENTION]: { icon: InventorIcon, color: theme.colors.altCard, solid: false },
    [DevCardType.MONOPOLY]: { icon: MonopolyIcon, color: theme.colors.altCard, solid: false },
    [DevCardType.VICTORY_POINT]: { icon: VictoryPointIcon, color: theme.colors.vpCard, solid: true },
};

export default function DevCard({ cardType, quantity = 1, size = 80, playDevCard, canUseThisTurn = true }) {
    const [hovered, setHovered] = useState(false);

    const cardData = devCardMap[cardType];
    if (!cardData) return null;

    const { icon: IconComponent, color, solid } = cardData;

    // Decide icon fill color based on whether it's solid
    const iconFill = solid ? color : "#000000";

    // Background is always card color
    const bgColor = color;

    // Border color depends on whether it can be used this turn
    const borderColor = canUseThisTurn ? "#000000" : "#888888"; // greyed out if not usable

    return (
        <div
            onClick={() => {
                if (canUseThisTurn) playDevCard?.(cardType);
            }}
            onMouseEnter={() => canUseThisTurn && setHovered(true)}
            onMouseLeave={() => canUseThisTurn && setHovered(false)}
            style={{
                width: size,
                height: size,
                paddingTop: size / 4,
                paddingBottom: size / 4,
                borderRadius: theme.styling.defaultRadius,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: bgColor,
                border: `4px solid ${borderColor}`,
                position: "relative",
                margin: "4px",
                overflow: "visible",
                cursor: canUseThisTurn ? "pointer" : "not-allowed",
                transition: canUseThisTurn ? "background-color 0.15s ease, transform 0.1s ease" : "none",
                transform: canUseThisTurn && hovered ? "scale(1.05)" : "scale(1)",
            }}
        >
            <IconComponent
                style={{
                    width: "70%",
                    height: "70%",
                    fill: iconFill,
                    stroke: "#000000",
                    strokeWidth: 0.1,
                    pointerEvents: "none",
                }}
            />

            {quantity > 1 && (
                <div
                    style={{
                        position: "absolute",
                        top: -8,
                        left: -8,
                        minWidth: size * 0.4,
                        height: size * 0.4,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black",
                        fontWeight: "bold",
                        fontSize: size * 0.2,
                        boxShadow: "0 0 2px black",
                        padding: "0px",
                        border: `4px solid #000000`,
                        overflow: "visible"
                    }}
                >
                    {quantity}
                </div>
            )}
        </div>
    );
}
