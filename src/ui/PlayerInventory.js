import theme from "../ui/theme";
import PortBadge from "./PortBadge";
import ResourceBadge from "./ResourceBadge";

export default function PlayerInventory({
    resources,
    ports,
    myPlayerId,

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