// offlineBoardInputs.js
const { BuildTypes } = require("./constants");

// ---------------- CONFIG ----------------
const BASE_SIZE = 60;
const HEX_WIDTH_FACTOR = 0.87;
const dx = BASE_SIZE * 2 * HEX_WIDTH_FACTOR;
const dy = BASE_SIZE * 1.5;

// export BOARD_LAYOUT so it can be used outside
export const BOARD_LAYOUT = [3, 4, 5, 4, 3];

// ---------------- TILES ----------------
const TOTAL_HEXES = BOARD_LAYOUT.reduce((a, b) => a + b, 0);
const ALL_TILES = ['forest', 'hill', 'field', 'pasture', 'mountain']; // remove 'desert' here
const ALL_TOKENS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

const desertIndex = Math.floor(TOTAL_HEXES / 2); // center tile
let tokenIndex = 0;

export const TILES = Array.from({ length: TOTAL_HEXES }, (_, i) => {
    if (i === desertIndex) {
        return { id: i, type: 'desert', number: null };
    }
    const type = ALL_TILES[tokenIndex % ALL_TILES.length];
    const number = ALL_TOKENS[tokenIndex % ALL_TOKENS.length];
    tokenIndex++;
    return { id: i, type, number };
});


// ---------------- VERTICES & EDGES ----------------
const verticesMap = {};
const edgesMap = {};
export const BOARD = [];

let tileIndex = 0; // ✅ declare with let

BOARD_LAYOUT.forEach((hexCount, row) => {
    const rowArr = [];
    const y = row * dy;
    const rowWidth = (hexCount - 1) * dx;
    const xOffset = -rowWidth / 2;

    for (let col = 0; col < hexCount; col++) {
        const x = xOffset + col * dx;
        const tile = TILES[tileIndex++]; // use declared tileIndex
        rowArr.push({ ...tile, row, col, x, y });

        const h = BASE_SIZE;
        const w = BASE_SIZE * HEX_WIDTH_FACTOR;
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
            if (!verticesMap[key]) {
                verticesMap[key] = { x: vx, y: vy, playerId: null, buildingType: null, active: false };
            }
        });

        for (let i = 0; i < 6; i++) {
            const k1 = keys[i];
            const k2 = keys[(i + 1) % 6];
            const edgeKey = k1 < k2 ? `${k1}_${k2}` : `${k2}_${k1}`;
            if (!edgesMap[edgeKey]) {
                edgesMap[edgeKey] = { v1: verticesMap[k1], v2: verticesMap[k2], placed: false, playerId: null, hexes: [tile] };
            } else {
                edgesMap[edgeKey].hexes.push(tile);
            }
        }
    }
    BOARD.push(rowArr);
});


export const VERTICES = Object.values(verticesMap);
export const EDGES = Object.values(edgesMap);

// ---------------- PORTS ----------------
const borderEdges = EDGES.filter(e => e.hexes.length === 1);
const centerX = BOARD.flat().reduce((acc, t) => acc + t.x, 0) / TOTAL_HEXES;
const centerY = BOARD.flat().reduce((acc, t) => acc + t.y, 0) / TOTAL_HEXES;

borderEdges.sort((a, b) => {
    const ax = (a.v1.x + a.v2.x) / 2 - centerX;
    const ay = (a.v1.y + a.v2.y) / 2 - centerY;
    const bx = (b.v1.x + b.v2.x) / 2 - centerX;
    const by = (b.v1.y + b.v2.y) / 2 - centerY;
    return Math.atan2(ay, ax) - Math.atan2(by, bx);
});

const PORT_TYPES = [
    { resource: "brick", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "sheep", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wheat", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "ore", offer: "2:1" },

    { resource: "brick", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "sheep", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wheat", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "ore", offer: "2:1" },

    { resource: "brick", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wood", offer: "2:1" },
    { resource: "sheep", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "wheat", offer: "2:1" },
    { resource: "any", offer: "3:1" },
    { resource: "ore", offer: "2:1" },

];

export const PORTS = [];
const MIN_SPACING = 3;
let lastPlacedIndex = -MIN_SPACING;

for (let i = 0; i < borderEdges.length && PORTS.length < PORT_TYPES.length; i++) {
    if (i - lastPlacedIndex >= MIN_SPACING) {
        const port = PORT_TYPES[PORTS.length];
        PORTS.push({
            ...port,
            edge: borderEdges[i],
            owner: [],
            vertices: [borderEdges[i].v1, borderEdges[i].v2],
        });
        lastPlacedIndex = i;
        i += MIN_SPACING - 1;
    }
}
