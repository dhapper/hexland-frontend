import { Resource } from "../utils/constants";
import theme from "../ui/theme";
import { ReactComponent as WoodIcon } from "../assets/icons/transparentRes/wood-pile.svg";
import { ReactComponent as BrickIcon } from "../assets/icons/transparentRes/brick-pile.svg";
import { ReactComponent as SheepIcon } from "../assets/icons/transparentRes/sheep.svg";
import { ReactComponent as WheatIcon } from "../assets/icons/transparentRes/wheat.svg";
import { ReactComponent as OreIcon } from "../assets/icons/transparentRes/stone-pile.svg";
import hillBg from "../assets/brick.jpg";
import fieldBg from "../assets/wheat.jpg";
import pastureBg from "../assets/sheep.jpg";
import forestBg from "../assets/wood.jpg";
import mountainBg from "../assets/ore.jpg";
import desertBg from "../assets/desert.jpg";

const HEX_RESOURCES = {
  hill: {
    bg: hillBg,
    icon: BrickIcon,
  },
  field: {
    bg: fieldBg,
    icon: WheatIcon,
  },
  pasture: {
    bg: pastureBg,
    icon: SheepIcon,
  },
  forest: {
    bg: forestBg,
    icon: WoodIcon,
  },
  mountain: {
    bg: mountainBg,
    icon: OreIcon,
  },
  desert: {
    bg: desertBg,
  },
};

function Hex({ x, y, size = 60, fill = "#c2a14d", onClick, type }) {
  const h = size;
  const w = size * 0.87;

  const points = `
    ${x},${y - h}
    ${x + w},${y - h / 2}
    ${x + w},${y + h / 2}
    ${x},${y + h}
    ${x - w},${y + h / 2}
    ${x - w},${y - h / 2}
  `;

  const clipId = `hex-clip-${x}-${y}`;

  const resource = HEX_RESOURCES[type];
  const bgImage = resource?.bg;
  const Icon = resource?.icon; // the React component for the icon
  const iconSize = type == "field" ? size * 0.7 : size * 0.75;

  return (
    <g onClick={onClick} style={{}}>
      <defs>
        <clipPath id={clipId}>
          <polygon points={points} />
        </clipPath>
      </defs>

      {/* Background image if mapped */}
      {bgImage && (
        <image
          href={bgImage}
          x={x - w}
          y={y - h}
          width={w * 2}
          height={h * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
      )}

      {/* Fallback fill */}
      <polygon
        points={points}
        fill={bgImage ? "none" : fill}
        stroke="#333"
        strokeWidth="3"
      />

      {/* Outer border (black) */}
      {/* <polygon
        points={points}
        fill="none"
        stroke="black"
        strokeWidth="6"
      /> */}

      {/* Inner border (sand) */}
      <polygon
        points={points}
        fill="none"
        // stroke={theme.colors.sand}
        stroke="black"
        strokeWidth="3"
      />


      {/* Icon (centered) */}
      {Icon && (
        <svg
          x={x - iconSize / 2}   // horizontal center like before
          y={y - iconSize}       // vertical position like before
          width={iconSize}
          height={iconSize}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id={`iconShadow-${x}-${y}`} width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="black" floodOpacity="1" />
            </filter>
          </defs>

          <g filter={`url(#iconShadow-${x}-${y})`}>
            <Icon width="100%" height="100%" />
          </g>
        </svg>
      )}

    </g>
  );
}

export default Hex;
