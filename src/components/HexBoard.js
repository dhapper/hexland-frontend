// components/HexBoard.js
import React from "react";
import Hex from "./Hex";
import Vertex from "./Vertex";
import Edge from "./Edge";
import Robber from "./Robber";
import { TILE_TYPES } from "../utils/tileTypes";
import { BuildTypes, Phase } from "../utils/constants";
import theme from "../ui/theme";
import portBg from "../assets/vecteezy_wood.jpg";

export default function HexBoard({
  boardLayout,
  tiles,
  vertices,
  edges,
  ports,
  players,
  currentPlayerId,
  myPlayerId,
  onPlaceHouse,
  onPlaceRoad,
  onPlaceCity,
  scale = 0.8,
  gameState,
  socket,
  buildMode,
  robber,
  placeRobber,
  isMyPairedTurn,
  debug
}) {
  // ---------------- CONFIG ----------------
  const BASE_SIZE = 60;   // logical hex radius
  const SCALE = scale;    // visual zoom
  const HEX_WIDTH_FACTOR = Math.sqrt(3) / 2; // ≈0.866
  const size = BASE_SIZE;
  const dx = size * 2 * HEX_WIDTH_FACTOR;
  const dy = size * 1.5;
  const PADDING = size * 0.6;

  // ---------------- UI ----------------
  const VERTEX_ACTIVE_SIZE = 10;
  const VERTEX_INACTIVE_SIZE = 5;
  const EDGE_INACTIVE_SIZE = 0;

  // ---------------- BOARD ----------------
  const [board, setBoard] = React.useState([]);
  const [bounds, setBounds] = React.useState(null);

  // ---------------- HELPERS ----------------
  const makeKey = (x, y) => `${Math.round(x)}_${Math.round(y)}`;

  const offsetPerp = (v1, v2, distance) => {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { x: (dy / length) * distance, y: (-dx / length) * distance };
  };

  const buildEdgeKey = (v1, v2) => {
    const k1 = makeKey(v1.x, v1.y);
    const k2 = makeKey(v2.x, v2.y);
    return k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
  };

  // ---------------- BUILD BOARD ----------------
  React.useEffect(() => {
    if (!boardLayout || !tiles) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const tempBoard = [];
    let tileIndex = 0;

    boardLayout.forEach((hexCount, row) => {
      const rowArr = [];
      const y = row * dy;
      const rowWidth = (hexCount - 1) * dx;
      const xOffset = -rowWidth / 2;

      for (let col = 0; col < hexCount; col++) {
        const x = xOffset + col * dx;
        const tile = tiles[tileIndex++] || { type: "unknown" };
        const tileColor = TILE_TYPES.find(t => t.type === tile.type)?.color || "#000";

        const hex = {
          id: `${row}-${col}`,
          tileId: tileIndex - 1, // 🔥 IMPORTANT
          row,
          col,
          x,
          y,
          color: tileColor,
          type: tile.type,
          number: tile.number
        };
        rowArr.push(hex);

        minX = Math.min(minX, x - size);
        maxX = Math.max(maxX, x + size);
        minY = Math.min(minY, y - size);
        maxY = Math.max(maxY, y + size);
      }

      tempBoard.push(rowArr);
    });

    setBoard(tempBoard);
    setBounds({
      minX: minX - PADDING,
      minY: minY - PADDING,
      width: maxX - minX + PADDING * 2,
      height: maxY - minY + PADDING * 2
    });
  }, [boardLayout, tiles, dx, dy, size]);

  // ---------------- CLICK HANDLERS ----------------
  const handleVertexClick = (vertex) => {
    console.log(buildMode)
    if (buildMode === BuildTypes.HOUSE || gameState.phase === Phase.SETUP) {
      onPlaceHouse(makeKey(vertex.x, vertex.y));
    } else if (buildMode === BuildTypes.CITY) {
      onPlaceCity(makeKey(vertex.x, vertex.y));
    }
  };

  const handleRoadPlace = (edge) => {
    if (edge.placed) return;
    onPlaceRoad(buildEdgeKey(edge.v1, edge.v2));
  };

  if (!bounds) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        ...(debug && { border: "4px solid yellow" }),
      }}
    >
      <svg
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ ...(debug && { border: "4px solid lime" }), }}
        overflow="visible"
      >

        <defs>
          <filter id="boardShadow" width="300%" height="300%" x="-100%" y="-100%" >
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="50"
              // floodColor="#ffbe46"
              floodColor={theme.colors.sand}
              floodOpacity="1"
            />
          </filter>
        </defs>

        <g filter="url(#boardShadow)">
          <g transform={`scale(${SCALE})`}>
            {/* Debug bounds */}
            {debug && (
              <rect
                x={bounds.minX}
                y={bounds.minY}
                width={bounds.width}
                height={bounds.height}
                fill="none"
                stroke="blue"
                strokeWidth="4"
              />
            )}

            {/* Ports */}
            {ports.map((port, i) => {
              const { edge, resource, offer } = port;
              const midX = (edge.v1.x + edge.v2.x) / 2;
              const midY = (edge.v1.y + edge.v2.y) / 2;
              const { x: offsetX, y: offsetY } = offsetPerp(edge.v1, edge.v2, 20);
              const textOffsetFactor = 1.2;

              const patternId = `port-bg-${i}`;

              return (
                <g key={i}>
                  <defs>
                    <pattern id={patternId} patternUnits="userSpaceOnUse" width="60" height="60">
                      <image href={portBg} x="0" y="0" width="60" height="60" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                  </defs>

                  <circle
                    cx={midX + offsetX}
                    cy={midY + offsetY}
                    r={30}
                    fill={`url(#${patternId})`} // <-- minimal change: use image fill
                    // stroke="#4d4130"
                    stroke="black"
                    strokeWidth="3"
                  />

                  <defs>
                    <filter id={`textShadow-${i}`} width="300%" height="300%">
                      <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="black" floodOpacity="0.75" />
                      <feDropShadow dx="-1" dy="-1" stdDeviation="2" floodColor="black" floodOpacity="0.75" />
                      <feDropShadow dx="1" dy="-1" stdDeviation="2" floodColor="black" floodOpacity="0.75" />
                      <feDropShadow dx="-1" dy="1" stdDeviation="2" floodColor="black" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  <text
                    x={midX + offsetX * textOffsetFactor}
                    y={midY + offsetY * textOffsetFactor}
                    textAnchor="middle"
                    fontSize={14}
                    // fontWeight="bold"
                    // fill={theme.colors.sand}
                    fill="white"
                    filter={`url(#textShadow-${i})`} // <-- added drop shadow
                  >
                    <tspan x={midX + offsetX * textOffsetFactor} dy="-8">{offer}</tspan>
                    <tspan x={midX + offsetX * textOffsetFactor} dy="16">{resource}</tspan>
                  </text>

                </g>
              );
            })}


            {/* Hexes */}
            {board.map(row =>
              row.map(hex => (
                <g key={hex.id}>
                  <Hex x={hex.x} y={hex.y} size={size} fill={hex.color} type={hex.type} />

                  {/* Type text on top */}
                  {/* <text
                    x={hex.x}
                    y={hex.y - 10} // slightly above center
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="bold"
                    fill="#202020"
                    pointerEvents="none"
                  >
                    {hex.type}
                  </text> */}

                  {/* Robber */}
                  {robber?.tileId === hex.tileId && (
                    <Robber x={hex.x + 30} y={hex.y + 10} size={28} placeRobber={false} />
                  )}
                  {robber?.mustBePlaced && robber?.tileId !== hex.tileId && myPlayerId === robber.placingPlayer && (
                    <Robber x={hex.x + 30} y={hex.y + 10} size={28} placeRobber={true} onPlaceRobber={() => placeRobber(hex.tileId)} />
                  )}

                  {/* Number inside beige square */}
                  {hex.number != null && (
                    <>
                      <rect
                        x={hex.x - 12} // square centered horizontally
                        y={hex.y + 5}  // below hex center
                        width={24}
                        height={24}
                        rx={4} // rounded corners
                        fill="#f5f5dc" // beige
                        stroke="#000"
                        strokeWidth={2}
                      />
                      <text
                        x={hex.x}
                        y={hex.y + 22} // vertical center of rect
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight="bold"
                        fill={hex.number === 6 || hex.number === 8 ? "red" : "black"}
                        pointerEvents="none"
                      >
                        {hex.number}
                      </text>
                    </>
                  )}
                </g>
              ))
            )}


            {/* Edges */}
            {edges.map((e) => {
              const isSetup = gameState.phase === Phase.SETUP;
              const isInGame = gameState.phase === Phase.IN_GAME;
              const isMyTurn = gameState.turn === myPlayerId;
              const edgeKey = buildEdgeKey(e.v1, e.v2);

              const validSetup = isSetup && isMyTurn && gameState.setupStep === BuildTypes.ROAD;
              const validInGame = isInGame && isMyTurn && buildMode === BuildTypes.ROAD;
              // const showEligibleRoadPlacements = (validSetup || validInGame) && e.active;

              const canShowRoad =
                (isSetup && isMyTurn && gameState.setupStep === BuildTypes.ROAD) ||
                (isInGame && isMyTurn && buildMode === BuildTypes.ROAD) ||
                (isMyPairedTurn && buildMode === BuildTypes.ROAD && !isSetup);  // added this

              const showEligibleRoadPlacements = canShowRoad && e.active;

              const canClick = e.active && !e.placed && (
                validSetup || validInGame || (isMyPairedTurn && buildMode === BuildTypes.ROAD)
              );

              let fillColor;
              let size;

              if (e.placed) {
                // Vertex already has a house → use owner color
                fillColor = gameState.players[e.playerId]?.color || "black";
                size = VERTEX_ACTIVE_SIZE;
              } else if (showEligibleRoadPlacements) {
                // Empty but clickable
                fillColor = "#fff";
                size = VERTEX_ACTIVE_SIZE;
              } else {
                // Empty and not clickable
                fillColor = "#888";
                size = 5;
              }

              return (
                <Edge
                  key={edgeKey}
                  v1={e.v1}
                  v2={e.v2}
                  placed={e.placed}
                  active={showEligibleRoadPlacements}
                  playerColor={fillColor}
                  clickColor={'#fff'}
                  // onClick={() => handleRoadPlace(e)}
                  onClick={() => {
                    if (!canClick) return;
                    handleRoadPlace(e);
                  }}
                />
              );
            })}

            {/* Vertex */}
            {vertices.map((v) => {
              const isSetup = gameState.phase === Phase.SETUP;
              const isInGame = gameState.phase === Phase.IN_GAME;
              const isMyTurn = gameState.turn === myPlayerId;
              const vertexKey = makeKey(v.x, v.y);

              // Can place a new house
              const showAvailableHouses =
                ((isSetup && isMyTurn && gameState.setupStep === BuildTypes.HOUSE) ||
                  (isInGame && isMyTurn && buildMode === BuildTypes.HOUSE) ||
                  (isMyPairedTurn && buildMode === BuildTypes.HOUSE && !isSetup)  // added this
                ) &&
                v.active &&
                !v.buildingType;

              // Can upgrade an existing house to a city
              const showAvailableCities =
                ((isInGame && isMyTurn) || isMyPairedTurn) && // added this
                buildMode === BuildTypes.CITY &&
                v.buildingType === BuildTypes.HOUSE &&
                v.playerId === myPlayerId;

              // Combine for clickable
              const canClick = showAvailableHouses || showAvailableCities;

              // Determine visual
              let fillColor, size;
              if (v.buildingType === BuildTypes.CITY) {
                fillColor = gameState.players[v.playerId]?.color || "black";
                size = VERTEX_ACTIVE_SIZE * 1.2;
              } else if (showAvailableCities) {
                fillColor = "#fff"; // highlight upgradeable
                size = VERTEX_ACTIVE_SIZE;
              } else if (v.buildingType === BuildTypes.HOUSE) {
                fillColor = gameState.players[v.playerId]?.color || "black";
                size = VERTEX_ACTIVE_SIZE;
              } else if (showAvailableHouses) {
                fillColor = "#fff"; // highlight available
                size = VERTEX_ACTIVE_SIZE;
              } else {
                fillColor = "#888"; // inactive
                size = VERTEX_INACTIVE_SIZE;
              }

              return (
                <g key={vertexKey}>
                  <Vertex
                    x={v.x}
                    y={v.y}
                    size={size}
                    fillColor={fillColor}
                    clickable={canClick}
                    onClick={() => {
                      if (!canClick) return;
                      handleVertexClick(v);
                    }}
                  />
                  {v.buildingType === BuildTypes.CITY && (

                    <text
                      x={v.x}
                      y={v.y + 6} // slightly lower to vertically center
                      textAnchor="middle"
                      fontSize={20}
                      fontWeight="bold"
                      fill="white"
                      pointerEvents="none"
                    >
                      ★
                    </text>
                  )}
                </g>
              );

            })}

            {/* {tiles.map(tile => {
            const hasRobber = robber?.tileId === tile.id;
            <>hi</>
            return (
              <div key={tile.id}>
                Tile {tile.id} ({tile.type})
                {hasRobber && <span> 🏴 Robber</span>}
              </div>
            );
          })} */}


          </g>
        </g>
      </svg>
    </div>
  );
}
