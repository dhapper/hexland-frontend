// constants.js
export const BuildTypes = {
  HOUSE: "house",
  ROAD: "road",
  CITY: "city",
  ACTION: "action"
};

export const Phase = {
  SETUP: "setup",
  IN_GAME: "in_game",
  LOBBY: "lobby",
  ROLL_FOR_TURN_ORDER: "rollForTurnOrder"
};

export const TurnPhase = {
  ROLL: "roll",
  ACTION: "action"
};

export const Resource = {
  WOOD: "wood",
  ORE: "ore",
  WHEAT: "wheat",
  BRICK: "brick",
  SHEEP: "sheep"
};

export const DevCard = {
    MONOPOLY: "monopoly",
    ROAD_BUILDING: "roadBuilding",
    INVENTION: "invention",
    KNIGHT: "knight",
    VICTORY_POINT: "victoryPoint"
};

export const SpecialVictoryCardConst = {
    LONGEST_ROAD: "longestRoad",
    LARGEST_ARMY: "largestArmy",
};

export const Costs = {
  ROAD: { wood: 1, brick: 1 },
  SETTLEMENT: { wood: 1, brick: 1, sheep: 1, wheat: 1 },
  CITY: { wheat: 2, ore: 3 },
  DEV_CARD: { sheep: 1, wheat: 1, ore: 1 },
}

// backend/constants/buildToCost.js
export const BuildToCost = {
  house: "SETTLEMENT",
  road: "ROAD",
  city: "CITY",
  devCard: "DEV_CARD",
};
