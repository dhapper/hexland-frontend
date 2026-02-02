import theme from "../ui/theme";
import PortBadge from "./PortBadge";
import ResourceBadge from "./ResourceBadge";
import DevCard from "./DevCard";

export default function PlayerInventory({
    resources,
    ports,
    myPlayerId,
    myCards,
    cardsBoughtThisTurn,
    canPlayCard,
    playDevCard
}) {

    // show resource / quantity - DONE
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

            {/* <div style={{ marginTop: "10px" }}>
                <strong>My Cards</strong>

                {(!myCards || Object.keys(myCards).length === 0) && (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        No cards
                    </div>
                )}

                {myCards && Object.entries(myCards).map(([card, count]) => (
                    <div key={card}>
                        {card.toUpperCase()} × {count}
                    </div>
                ))}
            </div> */}

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap", // optional: wraps to next line if too many
                    alignItems: "center",
                }}
            >
                {/* <strong>My Cards</strong> */}

                {/* {(!myCards || Object.keys(myCards).length === 0) && (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>No cards</div>
                )} */}

                {myCards && 
                    Object.entries(myCards).filter(([_, count]) => count >= 1).map(([cardType, count]) => (
                        <DevCard
                            key={cardType}
                            cardType={cardType}
                            quantity={count}
                            size={50}
                            playDevCard={playDevCard}
                            // canUseThisTurn={count > (cardsBoughtThisTurn?.[cardType] || 0)}
                             canUseThisTurn={count > (cardsBoughtThisTurn?.[cardType] || 0) && canPlayCard}
                        />
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
                {ports
                    .filter(port => port.owner.includes(myPlayerId))
                    .map((port, i) => (
                        <PortBadge offer={port.offer} resource={port.resource} />
                    ))}
            </div>

        </div>
    );
}