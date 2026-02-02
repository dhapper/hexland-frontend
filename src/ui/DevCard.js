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

export default function DevCard({ cardType, quantity = 1, size = 80, playDevCard }) {
    const [hovered, setHovered] = useState(false);

    const cardData = devCardMap[cardType];
    if (!cardData) return null;

    const { icon: IconComponent, color, solid } = cardData;

    // Decide fill color based on whether it's a solid card
    const iconFill = solid ? color : "#000000"; // black for thin-line cards
    const bgColor = hovered ? "#7adb66" : color; // background is always card color
    const borderColor = "#000000";

    return (
        <div
            onClick={() => {
                console.log("Clicked dev card:", cardType);
                playDevCard?.(cardType);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                cursor: "pointer",
                transition: "background-color 0.15s ease, transform 0.1s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
        >
            <IconComponent
                style={{
                    width: "70%",
                    height: "70%",
                    fill: iconFill,
                    stroke: "#000000", // outline for visibility
                    strokeWidth: 0.1,
                    pointerEvents: "none",
                }}
            // playDevCard={playDevCard}
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
