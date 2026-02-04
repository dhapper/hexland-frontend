import theme from "../ui/theme";
import PortBadge from "./PortBadge";
import ResourceBadge from "./ResourceBadge";
import DevCard from "./DevCard";
import { DevCard as DevCardConst } from "../utils/constants";
import SpecialVictoryCard from "./SpecialVictoryCard";
import { SpecialVictoryCardConst } from "../utils/constants";

export default function PlayerInventory({
    resources,
    ports,
    myPlayerId,
    myCards,
    cardsBoughtThisTurn,
    canPlayCard,
    playDevCard,
    hasLongestRoad,
    hasLargestArmy,
    playerId
}) {

    // show resource / quantity
    // ports - DONE
    // action cards
    // largest road / largest army

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
                    gap: "8px",
                    flexWrap: "wrap", // optional: wraps to next line if too many
                    alignItems: "center",
                }}
            >
                {Object.entries(resources)
                    .filter(([res, amount]) => amount !== 0)
                    .map(([res, amount]) => (
                        <ResourceBadge resource={res} quantity={amount}></ResourceBadge>
                    ))}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap", // optional: wraps to next line if too many
                    alignItems: "center",
                    marginTop: "10px"
                }}
            >

                {myCards &&
                    Object.entries(myCards).filter(([_, count]) => count >= 1).map(([cardType, count]) => (
                        <DevCard
                            key={cardType}
                            cardType={cardType}
                            quantity={count}
                            size={50}
                            playDevCard={playDevCard}
                            // canUseThisTurn={count > (cardsBoughtThisTurn?.[cardType] || 0)}
                            canUseThisTurn={count > (cardsBoughtThisTurn?.[cardType] || 0) && canPlayCard && cardType != DevCardConst.VICTORY_POINT}
                        />
                    ))}
            </div>


            {/* {ports.filter(port => port.owner.includes(myPlayerId)) > 0 && ( */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap", // optional: wraps to next line if too many
                        alignItems: "center",
                        marginTop: "10px"
                    }}
                >
                    {ports
                        .filter(port => port.owner.includes(myPlayerId))
                        .map((port, i) => (
                            <PortBadge offer={port.offer} resource={port.resource} />
                        ))}
                </div>
            {/* )} */}


            {(hasLongestRoad || hasLargestArmy) && (
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap", // optional: wraps to next line if too many
                        alignItems: "center",
                        marginTop: "10px"
                    }}
                >
                    {hasLongestRoad && (
                        <SpecialVictoryCard specialVictoryCard={SpecialVictoryCardConst.LONGEST_ROAD} ></SpecialVictoryCard>
                    )}

                    {hasLargestArmy && (
                        <SpecialVictoryCard specialVictoryCard={SpecialVictoryCardConst.LARGEST_ARMY} ></SpecialVictoryCard>
                    )}
                </div>
            )}

        </div>
    );
}