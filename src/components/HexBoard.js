// components/HexBoard.js
import React from "react";
import Hex from "./Hex";
import Vertex from "./Vertex";
import Edge from "./Edge";
import { TILE_TYPES } from "../utils/tileTypes";

export default function HexBoard({ boardLayout, tiles }) {
  // ---------------- CONFIG ----------------
  const BASE_SIZE = 60;   // logical hex radius
  const SCALE = 0.8;      // visual zoom
  // ----------------------------------------

  const size = BASE_SIZE;
  const dx = size * 2 * 0.87;
  const dy = size * 1.5;

  const PADDING = size * 2;

  const [board, setBoard] = React.useState([]);
  const [vertices, setVertices] = React.useState([]);
  const [edges, setEdges] = React.useState([]);
  const [ports, setPorts] = React.useState([]);
  const [bounds, setBounds] = React.useState(null);

  // Hard-coded test ports
  const TEST_PORTS = [
    { resource: "brick", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "brick", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "brick", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "brick", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "wood", offer: "2:1" },

  ];

  // --- Get longest connected road ---
  const getLongestRoad = (edges, filter = () => true) => {
    // Build adjacency map
    const adjacency = {};
    edges.forEach(edge => {
      if (!edge.placed || !filter(edge)) return;
      const v1Key = `${edge.v1.x}_${edge.v1.y}`;
      const v2Key = `${edge.v2.x}_${edge.v2.y}`;
      adjacency[v1Key] = adjacency[v1Key] || [];
      adjacency[v2Key] = adjacency[v2Key] || [];
      adjacency[v1Key].push(edge);
      adjacency[v2Key].push(edge);
    });

    let maxLength = 0;

    const dfs = (vertexKey, visitedEdges) => {
      let localMax = visitedEdges.size;
      for (const edge of adjacency[vertexKey] || []) {
        if (visitedEdges.has(edge)) continue;
        visitedEdges.add(edge);
        const nextVertexKey =
          `${edge.v1.x}_${edge.v1.y}` === vertexKey
            ? `${edge.v2.x}_${edge.v2.y}`
            : `${edge.v1.x}_${edge.v1.y}`;
        localMax = Math.max(localMax, dfs(nextVertexKey, visitedEdges));
        visitedEdges.delete(edge);
      }
      return localMax;
    };

    // Start DFS from each vertex
    Object.keys(adjacency).forEach(vertexKey => {
      maxLength = Math.max(maxLength, dfs(vertexKey, new Set()));
    });

    return maxLength;
  };


  // --- Log longest road whenever edges change ---
  React.useEffect(() => {
    if (edges.length === 0) return;

    const longest = getLongestRoad(edges);
    console.log("Longest road:", longest);
  }, [edges]);


  // --- Build board ---
  React.useEffect(() => {
    if (!boardLayout || !tiles) return;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    const tempBoard = [];
    const tempVertices = {};
    const tempEdges = {};

    let tileIndex = 0;

    boardLayout.forEach((hexCount, row) => {
      const rowArr = [];
      const y = row * dy;

      const rowWidth = (hexCount - 1) * dx;
      const xOffset = -rowWidth / 2;

      for (let col = 0; col < hexCount; col++) {
        const x = xOffset + col * dx;
        const tile = tiles[tileIndex++] || { type: "unknown" };

        const tileColor =
          TILE_TYPES.find(t => t.type === tile.type)?.color || "#c2a14d";

        const hex = {
          id: `${row}-${col}`,
          row,
          col,
          x,
          y,
          color: tileColor,
          type: tile.type,
        };

        rowArr.push(hex);

        // --- Update bounds ---
        minX = Math.min(minX, x - size);
        maxX = Math.max(maxX, x + size);
        minY = Math.min(minY, y - size);
        maxY = Math.max(maxY, y + size);

        // --- Vertices ---
        const h = size;
        const w = size * 0.87;
        const positions = [
          [x, y - h],
          [x + w, y - h / 2],
          [x + w, y + h / 2],
          [x, y + h],
          [x - w, y + h / 2],
          [x - w, y - h / 2],
        ];

        const keys = [];
        positions.forEach(([vx, vy]) => {
          const key = `${Math.round(vx)}_${Math.round(vy)}`;
          keys.push(key);

          minX = Math.min(minX, vx);
          maxX = Math.max(maxX, vx);
          minY = Math.min(minY, vy);
          maxY = Math.max(maxY, vy);

          if (!tempVertices[key]) {
            tempVertices[key] = { x: vx, y: vy, hasHouse: false };
          }
        });

        // --- Edges ---
        for (let i = 0; i < 6; i++) {
          const k1 = keys[i];
          const k2 = keys[(i + 1) % 6];
          const edgeKey = k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;

          if (!tempEdges[edgeKey]) {
            tempEdges[edgeKey] = {
              v1: tempVertices[k1],
              v2: tempVertices[k2],
              placed: false,
              active: false,
              hexes: [hex],
            };
          } else {
            tempEdges[edgeKey].hexes.push(hex);
          }
        }
      }

      tempBoard.push(rowArr);
    });

    // --- Assign ports to border edges ---
    const borderEdges = Object.values(tempEdges).filter(edge => edge.hexes.length === 1);

    // Sort border edges by angle around board center
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    borderEdges.sort((a, b) => {
      const ax = (a.v1.x + a.v2.x) / 2 - centerX;
      const ay = (a.v1.y + a.v2.y) / 2 - centerY;
      const bx = (b.v1.x + b.v2.x) / 2 - centerX;
      const by = (b.v1.y + b.v2.y) / 2 - centerY;
      return Math.atan2(ay, ax) - Math.atan2(by, bx);
    });

    const portAssignments = [];
    const MIN_SPACING = 3; // minimum edges between ports
    const MAX_SPACING = 4; // maximum edges between ports
    let lastPlacedIndex = -MIN_SPACING;

    for (let i = 0; i < borderEdges.length && portAssignments.length < TEST_PORTS.length; i++) {
      if (i - lastPlacedIndex >= MIN_SPACING) {
        const port = TEST_PORTS[portAssignments.length];
        portAssignments.push({ ...port, edge: borderEdges[i] });

        // pick next step randomly between MIN_SPACING and MAX_SPACING
        const step = MIN_SPACING + Math.floor(Math.random() * (MAX_SPACING - MIN_SPACING + 1));
        lastPlacedIndex = i;
        i += step - 1; // -1 because the loop will increment i
      }
    }

    // --- Wrap-around check: remove last port if too close to first ---
    if (portAssignments.length > 1) {
      const firstEdgeIndex = borderEdges.indexOf(portAssignments[0].edge);
      const lastEdgeIndex = borderEdges.indexOf(portAssignments[portAssignments.length - 1].edge);
      const wrapDistance = borderEdges.length - lastEdgeIndex + firstEdgeIndex;

      if (wrapDistance < MIN_SPACING) {
        portAssignments.pop(); // remove last port to avoid adjacency
      }
    }

    setBoard(tempBoard);
    setVertices(Object.values(tempVertices));
    setEdges(Object.values(tempEdges));
    setPorts(portAssignments);

    setBounds({
      minX: minX - PADDING,
      minY: minY - PADDING,
      width: maxX - minX + PADDING * 2,
      height: maxY - minY + PADDING * 2,
    });
  }, [boardLayout, tiles, dx, dy, size]);

  // --- Vertex click ---
  const handleVertexClick = (vertex) => {
    if (vertex.hasHouse) return;
    vertex.hasHouse = true;

    setEdges(prev =>
      prev.map(edge => ({
        ...edge,
        active: !edge.placed && (edge.v1.hasHouse || edge.v2.hasHouse),
      }))
    );
  };

  // --- Place road ---
  const handleRoadPlace = (edge) => {
    if (edge.placed) return;
    setEdges(prev =>
      prev.map(e =>
        e === edge ? { ...e, placed: true, active: false } : e
      )
    );
  };

  if (!bounds) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        border: "3px solid red",
      }}
    >
      <svg
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ border: "3px solid lime" }}
      >
        <g transform={`scale(${SCALE})`}>
          {/* Debug bounds */}
          <rect
            x={bounds.minX}
            y={bounds.minY}
            width={bounds.width}
            height={bounds.height}
            fill="none"
            stroke="blue"
            strokeWidth="4"
          />

          {/* Hexes */}
          {board.map(row =>
            row.map(hex => (
              <g key={hex.id}>
                <Hex x={hex.x} y={hex.y} size={size} fill={hex.color} />
                <text
                  x={hex.x}
                  y={hex.y + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#fff"
                  pointerEvents="none"
                >
                  {hex.type}
                </text>
              </g>
            ))
          )}

          {/* Vertices */}
          {vertices.map((v, i) => (
            <Vertex key={i} x={v.x} y={v.y} onClick={() => handleVertexClick(v)} />
          ))}

          {/* Edges */}
          {edges.map((e, i) => (
            <Edge
              key={i}
              v1={e.v1}
              v2={e.v2}
              placed={e.placed}
              active={e.active}
              onClick={e.active ? () => handleRoadPlace(e) : undefined}
            />
          ))}

          {/* Ports */}
          {ports.map((port, i) => {
            const { edge, resource, offer } = port;
            const x = (edge.v1.x + edge.v2.x) / 2;
            const y = (edge.v1.y + edge.v2.y) / 2;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={size / 3} fill="white" stroke="black" strokeWidth="2" />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fill="black"
                  pointerEvents="none"
                >
                  {resource} {offer}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
